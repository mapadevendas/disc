-- PostgreSQL/Supabase schema for CRM SaaS MVP
-- Multi-tenant, LGPD-ready, and scalable for high lead volume.

begin;

create extension if not exists pgcrypto;
create extension if not exists citext;

create type public.user_status as enum ('invited', 'active', 'suspended', 'deleted');
create type public.tenant_status as enum ('trial', 'active', 'suspended', 'cancelled');
create type public.lead_status as enum ('new', 'working', 'qualified', 'unqualified', 'converted', 'archived');
create type public.lead_consent_basis as enum ('consent', 'contract', 'legal_obligation', 'legitimate_interest');
create type public.opportunity_status as enum ('open', 'won', 'lost', 'cancelled');
create type public.whatsapp_direction as enum ('inbound', 'outbound');
create type public.message_status as enum ('queued', 'sent', 'delivered', 'read', 'failed', 'received');
create type public.notification_status as enum ('unread', 'read', 'archived');
create type public.ai_analysis_subject as enum ('lead', 'opportunity', 'conversation', 'message');

create table public.tenants (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug citext not null unique,
  legal_name text,
  tax_id text,
  status public.tenant_status not null default 'trial',
  plan_code text not null default 'mvp',
  data_region text not null default 'br',
  lgpd_dpo_name text,
  lgpd_dpo_email citext,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  constraint tenants_slug_format check (slug ~ '^[a-z0-9][a-z0-9-]{2,62}$'),
  constraint tenants_dpo_email_format check (lgpd_dpo_email is null or lgpd_dpo_email::text ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$')
);

create table public.roles (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  name text not null,
  key text not null,
  description text,
  permissions jsonb not null default '{}'::jsonb,
  is_system boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  constraint roles_key_format check (key ~ '^[a-z][a-z0-9_]{1,63}$'),
  constraint roles_unique_key_per_tenant unique (tenant_id, key)
);

create table public.branches (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  name text not null,
  code text,
  phone text,
  email citext,
  address jsonb not null default '{}'::jsonb,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  constraint branches_unique_code_per_tenant unique (tenant_id, code),
  constraint branches_email_format check (email is null or email::text ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$')
);

create table public.teams (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  branch_id uuid references public.branches(id) on delete set null,
  name text not null,
  description text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  constraint teams_unique_name_per_tenant unique (tenant_id, name)
);

create table public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  role_id uuid references public.roles(id) on delete set null,
  team_id uuid references public.teams(id) on delete set null,
  branch_id uuid references public.branches(id) on delete set null,
  full_name text not null,
  email citext not null,
  phone text,
  status public.user_status not null default 'invited',
  last_sign_in_at timestamptz,
  preferences jsonb not null default '{}'::jsonb,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  constraint users_unique_email_per_tenant unique (tenant_id, email),
  constraint users_email_format check (email::text ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$')
);

create table public.lead_sources (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  name text not null,
  key text,
  channel text,
  is_active boolean not null default true,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  constraint lead_sources_unique_name_per_tenant unique (tenant_id, name),
  constraint lead_sources_unique_key_per_tenant unique (tenant_id, key)
);

-- Helper used by generated column without requiring the unaccent extension.
create or replace function public.unaccent_like(value text)
returns text
language sql
immutable
as $$
  select translate(coalesce(value, ''),
    'ÁÀÂÃÄÅáàâãäåÉÈÊËéèêëÍÌÎÏíìîïÓÒÔÕÖóòôõöÚÙÛÜúùûüÇçÑñ',
    'AAAAAAaaaaaaEEEEeeeeIIIIiiiiOOOOOoooooUUUUuuuuCcNn'
  );
$$;

create table public.leads (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  source_id uuid references public.lead_sources(id) on delete set null,
  branch_id uuid references public.branches(id) on delete set null,
  owner_user_id uuid references public.users(id) on delete set null,
  full_name text not null,
  normalized_name text generated always as (lower(public.unaccent_like(full_name))) stored,
  email citext,
  phone text,
  whatsapp_phone text,
  company_name text,
  job_title text,
  status public.lead_status not null default 'new',
  score integer not null default 0,
  interest text,
  notes text,
  custom_fields jsonb not null default '{}'::jsonb,
  lgpd_basis public.lead_consent_basis not null default 'legitimate_interest',
  lgpd_consent_at timestamptz,
  lgpd_consent_ip inet,
  lgpd_consent_source text,
  lgpd_privacy_policy_version text,
  lgpd_data_retention_until date,
  lgpd_erasure_requested_at timestamptz,
  created_by uuid references public.users(id) on delete set null,
  updated_by uuid references public.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  constraint leads_score_range check (score between 0 and 100),
  constraint leads_email_format check (email is null or email::text ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  constraint leads_lgpd_consent_required check (lgpd_basis <> 'consent' or lgpd_consent_at is not null)
);

create table public.lead_tags (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  lead_id uuid not null references public.leads(id) on delete cascade,
  name text not null,
  color text,
  created_by uuid references public.users(id) on delete set null,
  created_at timestamptz not null default now(),
  constraint lead_tags_unique_name_per_lead unique (tenant_id, lead_id, name),
  constraint lead_tags_color_hex check (color is null or color ~ '^#[0-9A-Fa-f]{6}$')
);

create table public.funnels (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  name text not null,
  description text,
  is_default boolean not null default false,
  is_active boolean not null default true,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  constraint funnels_unique_name_per_tenant unique (tenant_id, name)
);

create table public.pipeline_stages (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  funnel_id uuid not null references public.funnels(id) on delete cascade,
  name text not null,
  position integer not null,
  probability_percent integer not null default 0,
  is_won boolean not null default false,
  is_lost boolean not null default false,
  color text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  constraint pipeline_stages_position_positive check (position > 0),
  constraint pipeline_stages_probability_range check (probability_percent between 0 and 100),
  constraint pipeline_stages_single_terminal check (not (is_won and is_lost)),
  constraint pipeline_stages_unique_position_per_funnel unique (tenant_id, funnel_id, position),
  constraint pipeline_stages_unique_name_per_funnel unique (tenant_id, funnel_id, name)
);

create table public.opportunities (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  lead_id uuid not null references public.leads(id) on delete cascade,
  funnel_id uuid not null references public.funnels(id) on delete restrict,
  stage_id uuid not null references public.pipeline_stages(id) on delete restrict,
  owner_user_id uuid references public.users(id) on delete set null,
  title text not null,
  description text,
  status public.opportunity_status not null default 'open',
  amount numeric(14,2) not null default 0,
  currency char(3) not null default 'BRL',
  expected_close_date date,
  closed_at timestamptz,
  lost_reason text,
  metadata jsonb not null default '{}'::jsonb,
  created_by uuid references public.users(id) on delete set null,
  updated_by uuid references public.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  constraint opportunities_amount_non_negative check (amount >= 0),
  constraint opportunities_currency_iso check (currency ~ '^[A-Z]{3}$'),
  constraint opportunities_closed_at_when_not_open check ((status = 'open' and closed_at is null) or (status <> 'open' and closed_at is not null))
);

create table public.lead_assignments (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  lead_id uuid not null references public.leads(id) on delete cascade,
  assigned_to_user_id uuid not null references public.users(id) on delete cascade,
  assigned_by_user_id uuid references public.users(id) on delete set null,
  team_id uuid references public.teams(id) on delete set null,
  branch_id uuid references public.branches(id) on delete set null,
  reason text,
  active boolean not null default true,
  assigned_at timestamptz not null default now(),
  unassigned_at timestamptz,
  constraint lead_assignments_active_dates check ((active and unassigned_at is null) or (not active and unassigned_at is not null))
);

create unique index lead_assignments_one_active_per_lead_user
  on public.lead_assignments (tenant_id, lead_id, assigned_to_user_id)
  where active;

create table public.whatsapp_conversations (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  lead_id uuid references public.leads(id) on delete set null,
  opportunity_id uuid references public.opportunities(id) on delete set null,
  assigned_user_id uuid references public.users(id) on delete set null,
  provider text not null default 'supabase',
  provider_conversation_id text,
  whatsapp_phone text not null,
  status text not null default 'open',
  last_message_at timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  closed_at timestamptz,
  deleted_at timestamptz,
  constraint whatsapp_conversations_status check (status in ('open', 'pending', 'closed', 'archived')),
  constraint whatsapp_conversations_unique_provider_id unique (tenant_id, provider, provider_conversation_id)
);

create table public.whatsapp_messages (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  conversation_id uuid not null references public.whatsapp_conversations(id) on delete cascade,
  lead_id uuid references public.leads(id) on delete set null,
  sender_user_id uuid references public.users(id) on delete set null,
  direction public.whatsapp_direction not null,
  status public.message_status not null default 'queued',
  provider_message_id text,
  message_type text not null default 'text',
  body text,
  media_url text,
  payload jsonb not null default '{}'::jsonb,
  sent_at timestamptz,
  delivered_at timestamptz,
  read_at timestamptz,
  failed_at timestamptz,
  created_at timestamptz not null default now(),
  deleted_at timestamptz,
  constraint whatsapp_messages_body_or_media check (body is not null or media_url is not null or payload <> '{}'::jsonb),
  constraint whatsapp_messages_unique_provider_message unique (tenant_id, provider_message_id)
);

create table public.ai_analysis (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  subject_type public.ai_analysis_subject not null,
  subject_id uuid not null,
  lead_id uuid references public.leads(id) on delete cascade,
  opportunity_id uuid references public.opportunities(id) on delete cascade,
  conversation_id uuid references public.whatsapp_conversations(id) on delete cascade,
  model_name text not null,
  prompt_version text,
  summary text,
  sentiment text,
  score integer,
  recommended_actions jsonb not null default '[]'::jsonb,
  input_tokens integer,
  output_tokens integer,
  result jsonb not null default '{}'::jsonb,
  created_by uuid references public.users(id) on delete set null,
  created_at timestamptz not null default now(),
  constraint ai_analysis_score_range check (score is null or score between 0 and 100),
  constraint ai_analysis_tokens_non_negative check ((input_tokens is null or input_tokens >= 0) and (output_tokens is null or output_tokens >= 0))
);

create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  user_id uuid not null references public.users(id) on delete cascade,
  type text not null,
  title text not null,
  body text,
  status public.notification_status not null default 'unread',
  payload jsonb not null default '{}'::jsonb,
  read_at timestamptz,
  created_at timestamptz not null default now(),
  expires_at timestamptz,
  constraint notifications_read_at_status check ((status = 'read' and read_at is not null) or (status <> 'read'))
);

create table public.audit_logs (
  id bigserial primary key,
  tenant_id uuid references public.tenants(id) on delete set null,
  actor_user_id uuid references public.users(id) on delete set null,
  action text not null,
  entity_table text not null,
  entity_id uuid,
  old_data jsonb,
  new_data jsonb,
  ip_address inet,
  user_agent text,
  request_id text,
  created_at timestamptz not null default now(),
  constraint audit_logs_action_format check (action ~ '^[a-z][a-z0-9_.-]{1,127}$')
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger tenants_set_updated_at before update on public.tenants for each row execute function public.set_updated_at();
create trigger roles_set_updated_at before update on public.roles for each row execute function public.set_updated_at();
create trigger branches_set_updated_at before update on public.branches for each row execute function public.set_updated_at();
create trigger teams_set_updated_at before update on public.teams for each row execute function public.set_updated_at();
create trigger users_set_updated_at before update on public.users for each row execute function public.set_updated_at();
create trigger lead_sources_set_updated_at before update on public.lead_sources for each row execute function public.set_updated_at();
create trigger leads_set_updated_at before update on public.leads for each row execute function public.set_updated_at();
create trigger funnels_set_updated_at before update on public.funnels for each row execute function public.set_updated_at();
create trigger pipeline_stages_set_updated_at before update on public.pipeline_stages for each row execute function public.set_updated_at();
create trigger opportunities_set_updated_at before update on public.opportunities for each row execute function public.set_updated_at();
create trigger whatsapp_conversations_set_updated_at before update on public.whatsapp_conversations for each row execute function public.set_updated_at();

create or replace function public.current_tenant_id()
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select u.tenant_id
  from public.users u
  where u.id = auth.uid()
    and u.status = 'active'
    and u.deleted_at is null
  limit 1;
$$;

create or replace function public.is_service_role()
returns boolean
language sql
stable
as $$
  select coalesce(auth.jwt() ->> 'role', '') = 'service_role';
$$;

create or replace function public.user_has_permission(permission_key text)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(r.permissions ->> permission_key, 'false')::boolean
  from public.users u
  left join public.roles r on r.id = u.role_id
  where u.id = auth.uid()
    and u.status = 'active'
    and u.deleted_at is null
  limit 1;
$$;

create or replace function public.same_tenant(target_tenant_id uuid)
returns boolean
language sql
stable
as $$
  select public.is_service_role() or target_tenant_id = public.current_tenant_id();
$$;

-- Cross-tenant integrity checks that PostgreSQL FKs cannot express directly.
create or replace function public.enforce_same_tenant_references()
returns trigger
language plpgsql
as $$
declare
  ref_tenant uuid;
begin
  if tg_table_name = 'teams' and new.branch_id is not null then
    select tenant_id into ref_tenant from public.branches where id = new.branch_id;
    if ref_tenant is distinct from new.tenant_id then raise exception 'branch_id belongs to another tenant'; end if;
  elsif tg_table_name = 'users' then
    if new.role_id is not null then select tenant_id into ref_tenant from public.roles where id = new.role_id; if ref_tenant is distinct from new.tenant_id then raise exception 'role_id belongs to another tenant'; end if; end if;
    if new.team_id is not null then select tenant_id into ref_tenant from public.teams where id = new.team_id; if ref_tenant is distinct from new.tenant_id then raise exception 'team_id belongs to another tenant'; end if; end if;
    if new.branch_id is not null then select tenant_id into ref_tenant from public.branches where id = new.branch_id; if ref_tenant is distinct from new.tenant_id then raise exception 'branch_id belongs to another tenant'; end if; end if;
  elsif tg_table_name = 'leads' then
    if new.source_id is not null then select tenant_id into ref_tenant from public.lead_sources where id = new.source_id; if ref_tenant is distinct from new.tenant_id then raise exception 'source_id belongs to another tenant'; end if; end if;
    if new.branch_id is not null then select tenant_id into ref_tenant from public.branches where id = new.branch_id; if ref_tenant is distinct from new.tenant_id then raise exception 'branch_id belongs to another tenant'; end if; end if;
    if new.owner_user_id is not null then select tenant_id into ref_tenant from public.users where id = new.owner_user_id; if ref_tenant is distinct from new.tenant_id then raise exception 'owner_user_id belongs to another tenant'; end if; end if;
  elsif tg_table_name = 'lead_tags' then
    select tenant_id into ref_tenant from public.leads where id = new.lead_id; if ref_tenant is distinct from new.tenant_id then raise exception 'lead_id belongs to another tenant'; end if;
    if new.created_by is not null then select tenant_id into ref_tenant from public.users where id = new.created_by; if ref_tenant is distinct from new.tenant_id then raise exception 'created_by belongs to another tenant'; end if; end if;
  elsif tg_table_name = 'pipeline_stages' then
    select tenant_id into ref_tenant from public.funnels where id = new.funnel_id;
    if ref_tenant is distinct from new.tenant_id then raise exception 'funnel_id belongs to another tenant'; end if;
  elsif tg_table_name = 'opportunities' then
    select tenant_id into ref_tenant from public.leads where id = new.lead_id; if ref_tenant is distinct from new.tenant_id then raise exception 'lead_id belongs to another tenant'; end if;
    select tenant_id into ref_tenant from public.funnels where id = new.funnel_id; if ref_tenant is distinct from new.tenant_id then raise exception 'funnel_id belongs to another tenant'; end if;
    select tenant_id into ref_tenant from public.pipeline_stages where id = new.stage_id; if ref_tenant is distinct from new.tenant_id then raise exception 'stage_id belongs to another tenant'; end if;
    if new.owner_user_id is not null then select tenant_id into ref_tenant from public.users where id = new.owner_user_id; if ref_tenant is distinct from new.tenant_id then raise exception 'owner_user_id belongs to another tenant'; end if; end if;
  elsif tg_table_name = 'lead_assignments' then
    select tenant_id into ref_tenant from public.leads where id = new.lead_id; if ref_tenant is distinct from new.tenant_id then raise exception 'lead_id belongs to another tenant'; end if;
    select tenant_id into ref_tenant from public.users where id = new.assigned_to_user_id; if ref_tenant is distinct from new.tenant_id then raise exception 'assigned_to_user_id belongs to another tenant'; end if;
  elsif tg_table_name = 'whatsapp_conversations' then
    if new.lead_id is not null then select tenant_id into ref_tenant from public.leads where id = new.lead_id; if ref_tenant is distinct from new.tenant_id then raise exception 'lead_id belongs to another tenant'; end if; end if;
    if new.opportunity_id is not null then select tenant_id into ref_tenant from public.opportunities where id = new.opportunity_id; if ref_tenant is distinct from new.tenant_id then raise exception 'opportunity_id belongs to another tenant'; end if; end if;
    if new.assigned_user_id is not null then select tenant_id into ref_tenant from public.users where id = new.assigned_user_id; if ref_tenant is distinct from new.tenant_id then raise exception 'assigned_user_id belongs to another tenant'; end if; end if;
  elsif tg_table_name = 'whatsapp_messages' then
    select tenant_id into ref_tenant from public.whatsapp_conversations where id = new.conversation_id; if ref_tenant is distinct from new.tenant_id then raise exception 'conversation_id belongs to another tenant'; end if;
    if new.lead_id is not null then select tenant_id into ref_tenant from public.leads where id = new.lead_id; if ref_tenant is distinct from new.tenant_id then raise exception 'lead_id belongs to another tenant'; end if; end if;
  elsif tg_table_name = 'notifications' then
    select tenant_id into ref_tenant from public.users where id = new.user_id; if ref_tenant is distinct from new.tenant_id then raise exception 'user_id belongs to another tenant'; end if;
  elsif tg_table_name = 'ai_analysis' then
    if new.lead_id is not null then select tenant_id into ref_tenant from public.leads where id = new.lead_id; if ref_tenant is distinct from new.tenant_id then raise exception 'lead_id belongs to another tenant'; end if; end if;
    if new.opportunity_id is not null then select tenant_id into ref_tenant from public.opportunities where id = new.opportunity_id; if ref_tenant is distinct from new.tenant_id then raise exception 'opportunity_id belongs to another tenant'; end if; end if;
    if new.conversation_id is not null then select tenant_id into ref_tenant from public.whatsapp_conversations where id = new.conversation_id; if ref_tenant is distinct from new.tenant_id then raise exception 'conversation_id belongs to another tenant'; end if; end if;
  end if;
  return new;
end;
$$;

create trigger teams_same_tenant before insert or update on public.teams for each row execute function public.enforce_same_tenant_references();
create trigger users_same_tenant before insert or update on public.users for each row execute function public.enforce_same_tenant_references();
create trigger leads_same_tenant before insert or update on public.leads for each row execute function public.enforce_same_tenant_references();
create trigger lead_tags_same_tenant before insert or update on public.lead_tags for each row execute function public.enforce_same_tenant_references();
create trigger pipeline_stages_same_tenant before insert or update on public.pipeline_stages for each row execute function public.enforce_same_tenant_references();
create trigger opportunities_same_tenant before insert or update on public.opportunities for each row execute function public.enforce_same_tenant_references();
create trigger lead_assignments_same_tenant before insert or update on public.lead_assignments for each row execute function public.enforce_same_tenant_references();
create trigger whatsapp_conversations_same_tenant before insert or update on public.whatsapp_conversations for each row execute function public.enforce_same_tenant_references();
create trigger whatsapp_messages_same_tenant before insert or update on public.whatsapp_messages for each row execute function public.enforce_same_tenant_references();
create trigger notifications_same_tenant before insert or update on public.notifications for each row execute function public.enforce_same_tenant_references();
create trigger ai_analysis_same_tenant before insert or update on public.ai_analysis for each row execute function public.enforce_same_tenant_references();

-- Performance indexes. Most are tenant-prefixed to keep tenant scans narrow.
create index tenants_status_idx on public.tenants (status) where deleted_at is null;
create index roles_tenant_idx on public.roles (tenant_id) where deleted_at is null;
create index branches_tenant_idx on public.branches (tenant_id) where deleted_at is null;
create index teams_tenant_branch_idx on public.teams (tenant_id, branch_id) where deleted_at is null;
create index users_tenant_status_idx on public.users (tenant_id, status) where deleted_at is null;
create index users_tenant_team_idx on public.users (tenant_id, team_id) where deleted_at is null;
create index lead_sources_tenant_active_idx on public.lead_sources (tenant_id, is_active) where deleted_at is null;
create index leads_tenant_status_created_idx on public.leads (tenant_id, status, created_at desc) where deleted_at is null;
create index leads_tenant_owner_status_idx on public.leads (tenant_id, owner_user_id, status) where deleted_at is null;
create index leads_tenant_source_idx on public.leads (tenant_id, source_id) where deleted_at is null;
create index leads_tenant_phone_idx on public.leads (tenant_id, phone) where phone is not null and deleted_at is null;
create index leads_tenant_whatsapp_idx on public.leads (tenant_id, whatsapp_phone) where whatsapp_phone is not null and deleted_at is null;
create index leads_tenant_email_idx on public.leads (tenant_id, email) where email is not null and deleted_at is null;
create index leads_tenant_normalized_name_idx on public.leads (tenant_id, normalized_name) where deleted_at is null;
create index leads_custom_fields_gin_idx on public.leads using gin (custom_fields);
create index lead_tags_tenant_name_idx on public.lead_tags (tenant_id, name);
create index lead_tags_lead_idx on public.lead_tags (tenant_id, lead_id);
create unique index funnels_one_default_per_tenant on public.funnels (tenant_id) where is_default and deleted_at is null;
create index pipeline_stages_tenant_funnel_idx on public.pipeline_stages (tenant_id, funnel_id, position) where deleted_at is null;
create index opportunities_tenant_stage_idx on public.opportunities (tenant_id, stage_id, status) where deleted_at is null;
create index opportunities_tenant_owner_idx on public.opportunities (tenant_id, owner_user_id, status) where deleted_at is null;
create index opportunities_tenant_lead_idx on public.opportunities (tenant_id, lead_id) where deleted_at is null;
create index opportunities_expected_close_idx on public.opportunities (tenant_id, expected_close_date) where status = 'open' and deleted_at is null;
create index lead_assignments_tenant_user_idx on public.lead_assignments (tenant_id, assigned_to_user_id, active);
create index whatsapp_conversations_tenant_lead_idx on public.whatsapp_conversations (tenant_id, lead_id) where deleted_at is null;
create index whatsapp_conversations_tenant_last_message_idx on public.whatsapp_conversations (tenant_id, last_message_at desc) where deleted_at is null;
create index whatsapp_messages_conversation_created_idx on public.whatsapp_messages (tenant_id, conversation_id, created_at desc) where deleted_at is null;
create index whatsapp_messages_provider_idx on public.whatsapp_messages (tenant_id, provider_message_id) where provider_message_id is not null;
create index ai_analysis_subject_idx on public.ai_analysis (tenant_id, subject_type, subject_id, created_at desc);
create index ai_analysis_lead_idx on public.ai_analysis (tenant_id, lead_id, created_at desc) where lead_id is not null;
create index notifications_user_status_idx on public.notifications (tenant_id, user_id, status, created_at desc);
create index audit_logs_tenant_created_idx on public.audit_logs (tenant_id, created_at desc);
create index audit_logs_entity_idx on public.audit_logs (tenant_id, entity_table, entity_id, created_at desc);

-- Row Level Security for Supabase. The service_role bypasses policies for trusted Edge Functions/jobs.
alter table public.tenants enable row level security;
alter table public.roles enable row level security;
alter table public.branches enable row level security;
alter table public.teams enable row level security;
alter table public.users enable row level security;
alter table public.lead_sources enable row level security;
alter table public.leads enable row level security;
alter table public.lead_tags enable row level security;
alter table public.funnels enable row level security;
alter table public.pipeline_stages enable row level security;
alter table public.opportunities enable row level security;
alter table public.lead_assignments enable row level security;
alter table public.whatsapp_conversations enable row level security;
alter table public.whatsapp_messages enable row level security;
alter table public.ai_analysis enable row level security;
alter table public.notifications enable row level security;
alter table public.audit_logs enable row level security;

create policy tenants_select_same_tenant on public.tenants for select using (public.is_service_role() or id = public.current_tenant_id());
create policy tenants_service_all on public.tenants for all using (public.is_service_role()) with check (public.is_service_role());

create policy roles_tenant_select on public.roles for select using (public.same_tenant(tenant_id));
create policy roles_tenant_write on public.roles for all using (public.same_tenant(tenant_id) and public.user_has_permission('settings.manage')) with check (public.same_tenant(tenant_id) and public.user_has_permission('settings.manage'));

create policy branches_tenant_select on public.branches for select using (public.same_tenant(tenant_id));
create policy branches_tenant_write on public.branches for all using (public.same_tenant(tenant_id) and public.user_has_permission('settings.manage')) with check (public.same_tenant(tenant_id) and public.user_has_permission('settings.manage'));

create policy teams_tenant_select on public.teams for select using (public.same_tenant(tenant_id));
create policy teams_tenant_write on public.teams for all using (public.same_tenant(tenant_id) and public.user_has_permission('settings.manage')) with check (public.same_tenant(tenant_id) and public.user_has_permission('settings.manage'));

create policy users_self_or_admin_select on public.users for select using (public.same_tenant(tenant_id) and (id = auth.uid() or public.user_has_permission('users.read')));
create policy users_admin_write on public.users for all using (public.same_tenant(tenant_id) and public.user_has_permission('users.manage')) with check (public.same_tenant(tenant_id) and public.user_has_permission('users.manage'));

create policy lead_sources_tenant_select on public.lead_sources for select using (public.same_tenant(tenant_id));
create policy lead_sources_tenant_write on public.lead_sources for all using (public.same_tenant(tenant_id) and public.user_has_permission('leads.manage_sources')) with check (public.same_tenant(tenant_id) and public.user_has_permission('leads.manage_sources'));

create policy leads_tenant_select on public.leads for select using (public.same_tenant(tenant_id) and (owner_user_id = auth.uid() or public.user_has_permission('leads.read_all')));
create policy leads_tenant_insert on public.leads for insert with check (public.same_tenant(tenant_id) and public.user_has_permission('leads.create'));
create policy leads_tenant_update on public.leads for update using (public.same_tenant(tenant_id) and (owner_user_id = auth.uid() or public.user_has_permission('leads.update_all'))) with check (public.same_tenant(tenant_id));
create policy leads_tenant_delete on public.leads for delete using (public.same_tenant(tenant_id) and public.user_has_permission('leads.delete'));

create policy lead_tags_tenant_select on public.lead_tags for select using (public.same_tenant(tenant_id));
create policy lead_tags_tenant_write on public.lead_tags for all using (public.same_tenant(tenant_id) and public.user_has_permission('leads.update_all')) with check (public.same_tenant(tenant_id));

create policy funnels_tenant_select on public.funnels for select using (public.same_tenant(tenant_id));
create policy funnels_tenant_write on public.funnels for all using (public.same_tenant(tenant_id) and public.user_has_permission('funnels.manage')) with check (public.same_tenant(tenant_id) and public.user_has_permission('funnels.manage'));

create policy pipeline_stages_tenant_select on public.pipeline_stages for select using (public.same_tenant(tenant_id));
create policy pipeline_stages_tenant_write on public.pipeline_stages for all using (public.same_tenant(tenant_id) and public.user_has_permission('funnels.manage')) with check (public.same_tenant(tenant_id) and public.user_has_permission('funnels.manage'));

create policy opportunities_tenant_select on public.opportunities for select using (public.same_tenant(tenant_id) and (owner_user_id = auth.uid() or public.user_has_permission('opportunities.read_all')));
create policy opportunities_tenant_write on public.opportunities for all using (public.same_tenant(tenant_id) and (owner_user_id = auth.uid() or public.user_has_permission('opportunities.manage_all'))) with check (public.same_tenant(tenant_id));

create policy lead_assignments_tenant_select on public.lead_assignments for select using (public.same_tenant(tenant_id));
create policy lead_assignments_tenant_write on public.lead_assignments for all using (public.same_tenant(tenant_id) and public.user_has_permission('leads.assign')) with check (public.same_tenant(tenant_id) and public.user_has_permission('leads.assign'));

create policy whatsapp_conversations_tenant_select on public.whatsapp_conversations for select using (public.same_tenant(tenant_id) and (assigned_user_id = auth.uid() or public.user_has_permission('whatsapp.read_all')));
create policy whatsapp_conversations_tenant_write on public.whatsapp_conversations for all using (public.same_tenant(tenant_id) and (assigned_user_id = auth.uid() or public.user_has_permission('whatsapp.manage_all'))) with check (public.same_tenant(tenant_id));

create policy whatsapp_messages_tenant_select on public.whatsapp_messages for select using (public.same_tenant(tenant_id));
create policy whatsapp_messages_tenant_write on public.whatsapp_messages for all using (public.same_tenant(tenant_id) and public.user_has_permission('whatsapp.send')) with check (public.same_tenant(tenant_id));

create policy ai_analysis_tenant_select on public.ai_analysis for select using (public.same_tenant(tenant_id) and public.user_has_permission('ai.read'));
create policy ai_analysis_tenant_write on public.ai_analysis for all using (public.same_tenant(tenant_id) and public.user_has_permission('ai.manage')) with check (public.same_tenant(tenant_id) and public.user_has_permission('ai.manage'));

create policy notifications_user_select on public.notifications for select using (public.same_tenant(tenant_id) and user_id = auth.uid());
create policy notifications_user_update on public.notifications for update using (public.same_tenant(tenant_id) and user_id = auth.uid()) with check (public.same_tenant(tenant_id) and user_id = auth.uid());
create policy notifications_service_insert on public.notifications for insert with check (public.is_service_role() or public.same_tenant(tenant_id));

create policy audit_logs_tenant_select on public.audit_logs for select using (public.same_tenant(tenant_id) and public.user_has_permission('audit.read'));
create policy audit_logs_service_insert on public.audit_logs for insert with check (public.is_service_role());

commit;
