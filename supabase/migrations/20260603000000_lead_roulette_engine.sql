create extension if not exists pgcrypto;

do $$
begin
  create type lead_roulette_algorithm as enum ('round_robin', 'weighted_round_robin');
exception when duplicate_object then null;
end $$;

do $$
begin
  create type lead_roulette_assignment_status as enum ('pending', 'accepted', 'declined', 'expired', 'reassigned', 'cancelled');
exception when duplicate_object then null;
end $$;

do $$
begin
  create type lead_roulette_event_type as enum ('assigned', 'accepted', 'expired', 'reassigned', 'availability_changed', 'no_seller_available');
exception when duplicate_object then null;
end $$;

create table if not exists public.lead_roulette_policies (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  algorithm lead_roulette_algorithm not null default 'round_robin',
  redistribution_after interval not null default interval '10 minutes',
  enabled boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint lead_roulette_policies_positive_timeout check (redistribution_after > interval '0 seconds')
);

create table if not exists public.lead_roulette_seller_profiles (
  seller_id uuid primary key,
  active boolean not null default true,
  available boolean not null default true,
  weight integer not null default 1,
  current_weight integer not null default 0,
  daily_capacity integer,
  current_load integer not null default 0,
  regions text[] not null default '{}',
  cities text[] not null default '{}',
  products text[] not null default '{}',
  last_assigned_at timestamptz,
  availability_changed_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint lead_roulette_seller_weight_positive check (weight > 0),
  constraint lead_roulette_seller_capacity_positive check (daily_capacity is null or daily_capacity > 0),
  constraint lead_roulette_seller_load_non_negative check (current_load >= 0)
);

create table if not exists public.lead_roulette_seller_availability_windows (
  id uuid primary key default gen_random_uuid(),
  seller_id uuid not null references public.lead_roulette_seller_profiles(seller_id) on delete cascade,
  weekday smallint not null,
  starts_at time not null,
  ends_at time not null,
  timezone text not null default 'America/Sao_Paulo',
  enabled boolean not null default true,
  created_at timestamptz not null default now(),
  constraint lead_roulette_availability_weekday check (weekday between 0 and 6),
  constraint lead_roulette_availability_time_order check (starts_at < ends_at)
);

create table if not exists public.lead_roulette_assignments (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null,
  seller_id uuid not null references public.lead_roulette_seller_profiles(seller_id),
  policy_id uuid not null references public.lead_roulette_policies(id),
  status lead_roulette_assignment_status not null default 'pending',
  region text,
  city text,
  product text,
  attempt integer not null default 1,
  assigned_at timestamptz not null default now(),
  expires_at timestamptz not null,
  accepted_at timestamptz,
  closed_at timestamptz,
  metadata jsonb not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint lead_roulette_assignment_attempt_positive check (attempt > 0)
);

create unique index if not exists lead_roulette_one_open_assignment_per_lead
  on public.lead_roulette_assignments(lead_id)
  where status = 'pending';

create index if not exists lead_roulette_assignments_expired_idx
  on public.lead_roulette_assignments(expires_at, assigned_at)
  where status = 'pending';

create index if not exists lead_roulette_assignments_lead_idx
  on public.lead_roulette_assignments(lead_id, created_at desc);

create index if not exists lead_roulette_seller_profiles_active_idx
  on public.lead_roulette_seller_profiles(active, available, seller_id)
  where active = true;

create table if not exists public.lead_roulette_cursors (
  policy_id uuid not null references public.lead_roulette_policies(id) on delete cascade,
  scope_hash text not null,
  position bigint not null default 0,
  updated_at timestamptz not null default now(),
  primary key (policy_id, scope_hash)
);

create table if not exists public.lead_roulette_events (
  id bigserial primary key,
  event_type lead_roulette_event_type not null,
  lead_id uuid,
  seller_id uuid,
  assignment_id uuid,
  policy_id uuid,
  payload jsonb not null default '{}',
  created_at timestamptz not null default now()
);

create index if not exists lead_roulette_events_lead_idx
  on public.lead_roulette_events(lead_id, created_at desc);

create or replace function public.lead_roulette_touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists lead_roulette_policies_touch_updated_at on public.lead_roulette_policies;
create trigger lead_roulette_policies_touch_updated_at
before update on public.lead_roulette_policies
for each row execute function public.lead_roulette_touch_updated_at();

drop trigger if exists lead_roulette_seller_profiles_touch_updated_at on public.lead_roulette_seller_profiles;
create trigger lead_roulette_seller_profiles_touch_updated_at
before update on public.lead_roulette_seller_profiles
for each row execute function public.lead_roulette_touch_updated_at();

drop trigger if exists lead_roulette_assignments_touch_updated_at on public.lead_roulette_assignments;
create trigger lead_roulette_assignments_touch_updated_at
before update on public.lead_roulette_assignments
for each row execute function public.lead_roulette_touch_updated_at();

create or replace function public.lead_roulette_scope_hash(
  p_policy_id uuid,
  p_region text,
  p_city text,
  p_product text
)
returns text
language sql
immutable
as $$
  select encode(
    digest(
      concat_ws('|', p_policy_id::text, lower(coalesce(p_region, '*')), lower(coalesce(p_city, '*')), lower(coalesce(p_product, '*'))),
      'sha256'
    ),
    'hex'
  );
$$;

create or replace function public.lead_roulette_is_seller_available(
  p_seller_id uuid,
  p_at timestamptz default now()
)
returns boolean
language plpgsql
stable
as $$
declare
  v_has_windows boolean;
  v_is_inside_window boolean;
begin
  select exists (
    select 1
    from public.lead_roulette_seller_availability_windows w
    where w.seller_id = p_seller_id
      and w.enabled = true
  ) into v_has_windows;

  if not v_has_windows then
    return true;
  end if;

  select exists (
    select 1
    from public.lead_roulette_seller_availability_windows w
    where w.seller_id = p_seller_id
      and w.enabled = true
      and extract(dow from p_at at time zone w.timezone)::smallint = w.weekday
      and (p_at at time zone w.timezone)::time >= w.starts_at
      and (p_at at time zone w.timezone)::time < w.ends_at
  ) into v_is_inside_window;

  return v_is_inside_window;
end;
$$;

create or replace function public.lead_roulette_sync_lead_assignment(
  p_lead_id uuid,
  p_seller_id uuid,
  p_assignment_id uuid,
  p_status text
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_has_leads boolean;
  v_set_clauses text[] := '{}';
  v_sql text;
begin
  select to_regclass('public.leads') is not null into v_has_leads;
  if not v_has_leads then
    return;
  end if;

  if exists (select 1 from information_schema.columns where table_schema = 'public' and table_name = 'leads' and column_name = 'assigned_seller_id') then
    v_set_clauses := v_set_clauses || format('assigned_seller_id = %L::uuid', p_seller_id);
  end if;

  if exists (select 1 from information_schema.columns where table_schema = 'public' and table_name = 'leads' and column_name = 'seller_id') then
    v_set_clauses := v_set_clauses || format('seller_id = %L::uuid', p_seller_id);
  end if;

  if exists (select 1 from information_schema.columns where table_schema = 'public' and table_name = 'leads' and column_name = 'lead_roulette_assignment_id') then
    v_set_clauses := v_set_clauses || format('lead_roulette_assignment_id = %L::uuid', p_assignment_id);
  end if;

  if exists (select 1 from information_schema.columns where table_schema = 'public' and table_name = 'leads' and column_name = 'assignment_status') then
    v_set_clauses := v_set_clauses || format('assignment_status = %L', p_status);
  end if;

  if exists (select 1 from information_schema.columns where table_schema = 'public' and table_name = 'leads' and column_name = 'assigned_at') then
    v_set_clauses := v_set_clauses || 'assigned_at = now()';
  end if;

  if array_length(v_set_clauses, 1) is null then
    return;
  end if;

  v_sql := format('update public.leads set %s where id = %L::uuid', array_to_string(v_set_clauses, ', '), p_lead_id);
  execute v_sql;
end;
$$;

create or replace function public.lead_roulette_assign(
  p_lead_id uuid,
  p_region text default null,
  p_city text default null,
  p_product text default null,
  p_policy_id uuid default null,
  p_excluded_seller_ids uuid[] default '{}',
  p_metadata jsonb default '{}'
)
returns public.lead_roulette_assignments
language plpgsql
security definer
set search_path = public
as $$
declare
  v_policy public.lead_roulette_policies%rowtype;
  v_existing public.lead_roulette_assignments%rowtype;
  v_assignment public.lead_roulette_assignments%rowtype;
  v_seller_id uuid;
  v_scope_hash text;
  v_cursor_position bigint;
  v_eligible_count integer;
  v_total_weight integer;
  v_attempt integer;
begin
  perform pg_advisory_xact_lock(hashtext(p_lead_id::text));

  select * into v_policy
  from public.lead_roulette_policies
  where enabled = true
    and (p_policy_id is null or id = p_policy_id)
  order by created_at asc
  limit 1;

  if not found then
    raise exception 'No enabled lead roulette policy found' using errcode = 'P0002';
  end if;

  with expired as (
    update public.lead_roulette_assignments a
    set status = 'expired', closed_at = now()
    where a.lead_id = p_lead_id
      and a.status = 'pending'
      and a.expires_at <= now()
    returning a.seller_id
  )
  update public.lead_roulette_seller_profiles s
  set current_load = greatest(s.current_load - expired_counts.assignment_count, 0)
  from (
    select seller_id, count(*)::integer as assignment_count
    from expired
    group by seller_id
  ) expired_counts
  where s.seller_id = expired_counts.seller_id;

  select * into v_existing
  from public.lead_roulette_assignments
  where lead_id = p_lead_id
    and status = 'pending'
  order by assigned_at desc
  limit 1;

  if found then
    return v_existing;
  end if;

  select coalesce(max(attempt), 0) + 1 into v_attempt
  from public.lead_roulette_assignments
  where lead_id = p_lead_id;

  create temporary table if not exists lead_roulette_eligible_sellers (
    row_number bigint,
    seller_id uuid,
    weight integer,
    current_weight integer,
    last_assigned_at timestamptz
  ) on commit drop;

  truncate table lead_roulette_eligible_sellers;

  insert into lead_roulette_eligible_sellers(row_number, seller_id, weight, current_weight, last_assigned_at)
  select
    row_number() over (order by s.last_assigned_at nulls first, s.seller_id) - 1,
    s.seller_id,
    s.weight,
    s.current_weight,
    s.last_assigned_at
  from public.lead_roulette_seller_profiles s
  where s.active = true
    and s.available = true
    and public.lead_roulette_is_seller_available(s.seller_id, now())
    and not (s.seller_id = any(coalesce(p_excluded_seller_ids, '{}')))
    and (s.daily_capacity is null or s.current_load < s.daily_capacity)
    and (cardinality(s.regions) = 0 or exists (select 1 from unnest(s.regions) r(value) where lower(r.value) = lower(coalesce(p_region, ''))))
    and (cardinality(s.cities) = 0 or exists (select 1 from unnest(s.cities) c(value) where lower(c.value) = lower(coalesce(p_city, ''))))
    and (cardinality(s.products) = 0 or exists (select 1 from unnest(s.products) p(value) where lower(p.value) = lower(coalesce(p_product, ''))));

  select count(*), coalesce(sum(weight), 0)
  into v_eligible_count, v_total_weight
  from lead_roulette_eligible_sellers;

  if v_eligible_count = 0 then
    insert into public.lead_roulette_events(event_type, lead_id, policy_id, payload)
    values ('no_seller_available', p_lead_id, v_policy.id, jsonb_build_object(
      'region', p_region,
      'city', p_city,
      'product', p_product,
      'excluded_seller_ids', p_excluded_seller_ids
    ));
    raise exception 'No eligible seller found for lead %', p_lead_id using errcode = 'P0002';
  end if;

  if v_policy.algorithm = 'round_robin' then
    v_scope_hash := public.lead_roulette_scope_hash(v_policy.id, p_region, p_city, p_product);

    insert into public.lead_roulette_cursors(policy_id, scope_hash, position)
    values (v_policy.id, v_scope_hash, 0)
    on conflict (policy_id, scope_hash) do nothing;

    update public.lead_roulette_cursors
    set position = position + 1,
        updated_at = now()
    where policy_id = v_policy.id
      and scope_hash = v_scope_hash
    returning position - 1 into v_cursor_position;

    select seller_id into v_seller_id
    from lead_roulette_eligible_sellers
    where row_number = mod(v_cursor_position, v_eligible_count);
  else
    update public.lead_roulette_seller_profiles s
    set current_weight = s.current_weight + s.weight
    where s.seller_id in (select e.seller_id from lead_roulette_eligible_sellers e);

    select s.seller_id into v_seller_id
    from public.lead_roulette_seller_profiles s
    join lead_roulette_eligible_sellers e on e.seller_id = s.seller_id
    order by s.current_weight desc, s.last_assigned_at nulls first, s.seller_id
    limit 1;

    update public.lead_roulette_seller_profiles
    set current_weight = current_weight - v_total_weight
    where seller_id = v_seller_id;
  end if;

  insert into public.lead_roulette_assignments(
    lead_id,
    seller_id,
    policy_id,
    status,
    region,
    city,
    product,
    attempt,
    expires_at,
    metadata
  ) values (
    p_lead_id,
    v_seller_id,
    v_policy.id,
    'pending',
    p_region,
    p_city,
    p_product,
    v_attempt,
    now() + v_policy.redistribution_after,
    coalesce(p_metadata, '{}')
  )
  returning * into v_assignment;

  update public.lead_roulette_seller_profiles
  set current_load = current_load + 1,
      last_assigned_at = now()
  where seller_id = v_seller_id;

  perform public.lead_roulette_sync_lead_assignment(p_lead_id, v_seller_id, v_assignment.id, v_assignment.status::text);

  insert into public.lead_roulette_events(event_type, lead_id, seller_id, assignment_id, policy_id, payload)
  values ('assigned', p_lead_id, v_seller_id, v_assignment.id, v_policy.id, jsonb_build_object(
    'region', p_region,
    'city', p_city,
    'product', p_product,
    'algorithm', v_policy.algorithm,
    'attempt', v_attempt
  ));

  return v_assignment;
end;
$$;

create or replace function public.lead_roulette_redistribute_expired(p_limit integer default 100)
returns table(expired_assignment_id uuid, new_assignment_id uuid, lead_id uuid, previous_seller_id uuid, new_seller_id uuid)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_expired public.lead_roulette_assignments%rowtype;
  v_new public.lead_roulette_assignments%rowtype;
begin
  for v_expired in
    select *
    from public.lead_roulette_assignments
    where status = 'pending'
      and expires_at <= now()
    order by expires_at asc
    limit greatest(coalesce(p_limit, 100), 1)
    for update skip locked
  loop
    update public.lead_roulette_assignments
    set status = 'expired', closed_at = now()
    where id = v_expired.id;

    update public.lead_roulette_seller_profiles
    set current_load = greatest(current_load - 1, 0)
    where seller_id = v_expired.seller_id;

    insert into public.lead_roulette_events(event_type, lead_id, seller_id, assignment_id, policy_id, payload)
    values ('expired', v_expired.lead_id, v_expired.seller_id, v_expired.id, v_expired.policy_id, jsonb_build_object(
      'expired_at', now(),
      'attempt', v_expired.attempt
    ));

    begin
      v_new := public.lead_roulette_assign(
        v_expired.lead_id,
        v_expired.region,
        v_expired.city,
        v_expired.product,
        v_expired.policy_id,
        array[v_expired.seller_id],
        v_expired.metadata || jsonb_build_object('redistributed_from', v_expired.id)
      );

      update public.lead_roulette_assignments
      set status = 'reassigned', closed_at = now()
      where id = v_expired.id;

      insert into public.lead_roulette_events(event_type, lead_id, seller_id, assignment_id, policy_id, payload)
      values ('reassigned', v_expired.lead_id, v_new.seller_id, v_new.id, v_expired.policy_id, jsonb_build_object(
        'previous_assignment_id', v_expired.id,
        'previous_seller_id', v_expired.seller_id,
        'new_assignment_id', v_new.id
      ));

      expired_assignment_id := v_expired.id;
      new_assignment_id := v_new.id;
      lead_id := v_expired.lead_id;
      previous_seller_id := v_expired.seller_id;
      new_seller_id := v_new.seller_id;
      return next;
    exception when others then
      insert into public.lead_roulette_events(event_type, lead_id, seller_id, assignment_id, policy_id, payload)
      values ('no_seller_available', v_expired.lead_id, null, v_expired.id, v_expired.policy_id, jsonb_build_object(
        'previous_seller_id', v_expired.seller_id,
        'error', sqlerrm
      ));
    end;
  end loop;
end;
$$;

create or replace function public.lead_roulette_set_seller_availability(
  p_seller_id uuid,
  p_available boolean,
  p_reason text default null
)
returns public.lead_roulette_seller_profiles
language plpgsql
security definer
set search_path = public
as $$
declare
  v_profile public.lead_roulette_seller_profiles%rowtype;
begin
  update public.lead_roulette_seller_profiles
  set available = p_available,
      availability_changed_at = now()
  where seller_id = p_seller_id
  returning * into v_profile;

  if not found then
    raise exception 'Seller profile % not found', p_seller_id using errcode = 'P0002';
  end if;

  insert into public.lead_roulette_events(event_type, seller_id, payload)
  values ('availability_changed', p_seller_id, jsonb_build_object(
    'available', p_available,
    'reason', p_reason
  ));

  return v_profile;
end;
$$;


create or replace function public.lead_roulette_accept_assignment(
  p_assignment_id uuid,
  p_seller_id uuid default null
)
returns public.lead_roulette_assignments
language plpgsql
security definer
set search_path = public
as $$
declare
  v_assignment public.lead_roulette_assignments%rowtype;
begin
  update public.lead_roulette_assignments
  set status = 'accepted',
      accepted_at = now(),
      closed_at = now()
  where id = p_assignment_id
    and status = 'pending'
    and (p_seller_id is null or seller_id = p_seller_id)
  returning * into v_assignment;

  if not found then
    raise exception 'Pending assignment % not found', p_assignment_id using errcode = 'P0002';
  end if;

  update public.lead_roulette_seller_profiles
  set current_load = greatest(current_load - 1, 0)
  where seller_id = v_assignment.seller_id;

  perform public.lead_roulette_sync_lead_assignment(v_assignment.lead_id, v_assignment.seller_id, v_assignment.id, v_assignment.status::text);

  insert into public.lead_roulette_events(event_type, lead_id, seller_id, assignment_id, policy_id, payload)
  values ('accepted', v_assignment.lead_id, v_assignment.seller_id, v_assignment.id, v_assignment.policy_id, jsonb_build_object(
    'accepted_at', v_assignment.accepted_at
  ));

  return v_assignment;
end;
$$;

insert into public.lead_roulette_policies(name, algorithm, redistribution_after, enabled)
values ('default-round-robin', 'round_robin', interval '10 minutes', true)
on conflict (name) do nothing;
