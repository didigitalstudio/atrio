-- Atrio · 0009 inmobiliarias multi-tenant RLS
-- ============================================================
-- Las tablas inmobiliarias / plans / inmobiliaria_subscriptions /
-- inmobiliaria_payments fueron creadas en Supabase fuera del flujo
-- de migrations del repo (esqueleto multi-tenant + billing).
-- Tenían RLS deshabilitado → cualquiera con la anon key podía leer
-- y modificar todo (alerta crítica de Supabase advisors el 2026-05-03).
--
-- Esta migración:
--   - Activa RLS en las 4 tablas.
--   - Define policies SELECT mínimas y seguras:
--       · plans         → público lee planes activos (catálogo).
--       · inmobiliarias → solo agentes activos de esa inmo.
--       · subscriptions → solo agentes activos de esa inmo.
--       · payments      → solo agentes activos de esa inmo.
--   - INSERT/UPDATE/DELETE quedan sin policy → bloqueados para
--     anon y authenticated. Solo service_role puede modificar
--     (que es lo correcto para billing y altas de tenants).
--
-- Nota: María Pérez (admin seed) tiene agentes.inmobiliaria_id = null,
-- por lo que después de esta migración no podrá leer inmobiliarias /
-- subscriptions / payments si se loguea como agente. Como ninguna
-- página del repo consulta esas tablas, no rompe nada operativamente.
-- Cuando se sume al menos una inmobiliaria al flujo del repo, hay
-- que asignarle inmobiliaria_id a los agentes existentes.
-- ============================================================

alter table public.plans                       enable row level security;
alter table public.inmobiliarias               enable row level security;
alter table public.inmobiliaria_subscriptions  enable row level security;
alter table public.inmobiliaria_payments       enable row level security;

-- plans: catálogo legible públicamente (solo activos).
drop policy if exists "Planes activos legibles públicamente" on public.plans;
create policy "Planes activos legibles públicamente"
  on public.plans
  for select
  to anon, authenticated
  using (activo = true);

-- inmobiliarias: solo agentes activos de esa inmo.
drop policy if exists "Agentes ven su propia inmobiliaria" on public.inmobiliarias;
create policy "Agentes ven su propia inmobiliaria"
  on public.inmobiliarias
  for select
  to authenticated
  using (
    exists (
      select 1
      from public.agentes
      where agentes.inmobiliaria_id = inmobiliarias.id
        and agentes.user_id = auth.uid()
        and agentes.activo = true
    )
  );

-- inmobiliaria_subscriptions: solo agentes activos de esa inmo.
drop policy if exists "Agentes ven la subscription de su inmobiliaria"
  on public.inmobiliaria_subscriptions;
create policy "Agentes ven la subscription de su inmobiliaria"
  on public.inmobiliaria_subscriptions
  for select
  to authenticated
  using (
    exists (
      select 1
      from public.agentes
      where agentes.inmobiliaria_id = inmobiliaria_subscriptions.inmobiliaria_id
        and agentes.user_id = auth.uid()
        and agentes.activo = true
    )
  );

-- inmobiliaria_payments: solo agentes activos de esa inmo.
drop policy if exists "Agentes ven los pagos de su inmobiliaria"
  on public.inmobiliaria_payments;
create policy "Agentes ven los pagos de su inmobiliaria"
  on public.inmobiliaria_payments
  for select
  to authenticated
  using (
    exists (
      select 1
      from public.agentes
      where agentes.inmobiliaria_id = inmobiliaria_payments.inmobiliaria_id
        and agentes.user_id = auth.uid()
        and agentes.activo = true
    )
  );
