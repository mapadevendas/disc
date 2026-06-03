# Lead Roulette Engine

## Objetivo

O **Lead Roulette Engine** distribui leads automaticamente entre vendedores elegíveis usando:

- Round Robin simples.
- Weighted Round Robin.
- Filtros por região, cidade e produto.
- Disponibilidade operacional do vendedor.
- Redistribuição automática quando um lead fica 10 minutos sem atendimento.

A solução foi dimensionada para **1.000 leads/dia** e **50 vendedores**, mantendo a decisão de roteamento dentro do PostgreSQL para reduzir latência, preservar consistência transacional e evitar dupla atribuição do mesmo lead.

## Arquitetura

```text
Cliente/CRM
   |
   | REST Supabase Edge Functions
   v
Edge Functions
   |-- lead-roulette-assign
   |-- lead-roulette-availability
   |-- lead-roulette-accept
   |-- lead-roulette-redistribute
   |
   | RPC PostgreSQL
   v
PostgreSQL
   |-- lead_roulette_assign(...)
   |-- lead_roulette_redistribute_expired(...)
   |-- lead_roulette_set_seller_availability(...)
   |
   v
Tabelas Lead Roulette
   |-- lead_roulette_policies
   |-- lead_roulette_seller_profiles
   |-- lead_roulette_seller_availability_windows
   |-- lead_roulette_assignments
   |-- lead_roulette_cursors
   |-- lead_roulette_events
```

### Decisões principais

1. **PostgreSQL é o motor de decisão**: usa locks transacionais e `pg_advisory_xact_lock` por lead para evitar corrida em chamadas simultâneas.
2. **Escopos determinísticos**: o cursor de Round Robin é separado por política, região, cidade e produto.
3. **Weighted Round Robin suave**: vendedores elegíveis acumulam `current_weight`; o maior recebe o lead e tem o peso total descontado.
4. **Disponibilidade em duas camadas**: um booleano rápido (`available`) e janelas opcionais por dia/horário.
5. **Auditoria**: todos os eventos relevantes são registrados em `lead_roulette_events`.
6. **Integração com schema atual**: a migração não exige alterar a tabela `leads`; se ela existir com colunas comuns de atribuição, a função tenta sincronizar automaticamente.

## Tabelas adicionais

| Tabela | Responsabilidade |
| --- | --- |
| `lead_roulette_policies` | Define algoritmo, tempo de expiração e status da política. |
| `lead_roulette_seller_profiles` | Guarda regras de roteamento do vendedor: regiões, cidades, produtos, peso e disponibilidade. |
| `lead_roulette_seller_availability_windows` | Janelas opcionais de atendimento por dia da semana e horário. |
| `lead_roulette_assignments` | Histórico e estado atual das atribuições de leads. |
| `lead_roulette_cursors` | Cursor transacional de Round Robin por escopo. |
| `lead_roulette_events` | Trilha de auditoria para atribuição, expiração, redistribuição e disponibilidade. |

## Funções PostgreSQL

| Função | Uso |
| --- | --- |
| `lead_roulette_assign(...)` | Atribui um lead a um vendedor elegível. |
| `lead_roulette_redistribute_expired(limit)` | Expira e redistribui leads pendentes após 10 minutos. |
| `lead_roulette_set_seller_availability(...)` | Atualiza disponibilidade online/offline do vendedor. |
| `lead_roulette_accept_assignment(...)` | Marca uma atribuição como atendida antes da expiração. |
| `lead_roulette_is_seller_available(...)` | Verifica disponibilidade considerando janelas. |

## APIs REST via Edge Functions

### `POST /functions/v1/lead-roulette-assign`

Atribui um lead.

```json
{
  "lead_id": "00000000-0000-0000-0000-000000000001",
  "region": "SP",
  "city": "São Paulo",
  "product": "consórcio",
  "policy_id": null
}
```

Resposta:

```json
{
  "id": "...",
  "lead_id": "...",
  "seller_id": "...",
  "status": "pending",
  "expires_at": "2026-06-03T12:10:00Z"
}
```

### `POST /functions/v1/lead-roulette-availability`

Atualiza disponibilidade rápida do vendedor.

```json
{
  "seller_id": "00000000-0000-0000-0000-000000000050",
  "available": true,
  "reason": "online"
}
```

### `POST /functions/v1/lead-roulette-accept`

Marca uma atribuição pendente como atendida para impedir redistribuição.

```json
{
  "assignment_id": "00000000-0000-0000-0000-000000000100",
  "seller_id": "00000000-0000-0000-0000-000000000050"
}
```

### `POST /functions/v1/lead-roulette-redistribute`

Executa redistribuição de leads pendentes expirados. Deve ser chamado por agendador a cada minuto.

```json
{
  "limit": 100
}
```

## Agendamento recomendado

Configure um job a cada minuto:

```sql
select cron.schedule(
  'lead-roulette-redistribute-every-minute',
  '* * * * *',
  $$select net.http_post(
    url := current_setting('app.settings.supabase_functions_url') || '/lead-roulette-redistribute',
    headers := jsonb_build_object('Authorization', 'Bearer ' || current_setting('app.settings.service_role_key')),
    body := jsonb_build_object('limit', 100)
  );$$
);
```

Se `pg_cron`/`pg_net` não estiverem disponíveis, use GitHub Actions, Cloud Scheduler ou outro agendador externo chamando a Edge Function.

## Capacidade

Para 1.000 leads/dia e 50 vendedores:

- Média aproximada: 42 leads/hora.
- Pico conservador de 10x: 420 leads/hora, cerca de 7 leads/minuto.
- Índices parciais em atribuições pendentes e perfis ativos cobrem a redistribuição e seleção.
- O lock por lead evita contenção global; cursores são separados por escopo.

## Operação

1. Cadastre uma política em `lead_roulette_policies`.
2. Cadastre os vendedores em `lead_roulette_seller_profiles` com `seller_id`, peso e filtros.
3. Opcionalmente cadastre janelas em `lead_roulette_seller_availability_windows`.
4. Chame `lead-roulette-assign` quando um lead entrar.
5. Chame `lead-roulette-redistribute` a cada minuto.
6. Quando o vendedor atender o lead, chame `lead-roulette-accept` para registrar `accepted` e impedir redistribuição.
