-- Atrio · 0005 RLS por rol (cierra el leak detectado en QA 2026-04-29)
-- ============================================================
-- Antes (0003): cualquier `authenticated` tenía CRUD total sobre
-- propiedades, leads, interacciones, tasaciones, agentes. Después
-- abrimos `/registrarse` para clientes (0004) sin re-revisar las
-- policies, así que un cliente que se firmaba podía leer leads/
-- tasaciones de cualquiera y hacer DELETE en propiedades.
--
-- Esta migración:
--  - introduce `public.is_agent()` (SECURITY DEFINER) para distinguir
--    agentes del staff de clientes que solo se firmaron;
--  - reemplaza las policies abiertas a `authenticated` por unas que
--    chequean rol — staff hace CRUD, clientes solo SELECT/INSERT
--    sobre lo suyo y lo público.
-- ============================================================

create or replace function public.is_agent()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists(
    select 1
    from public.agentes
    where user_id = auth.uid()
      and activo = true
  );
$$;

revoke execute on function public.is_agent() from public;
grant execute on function public.is_agent() to authenticated;

-- ============================================================
-- propiedades
-- ============================================================
drop policy if exists "auth select all propiedades" on public.propiedades;
drop policy if exists "auth insert propiedades"     on public.propiedades;
drop policy if exists "auth update propiedades"     on public.propiedades;
drop policy if exists "auth delete propiedades"     on public.propiedades;

-- SELECT (authenticated): agente ve TODO; cliente ve solo activa/reservada
-- + las que él mismo subió. La policy original `to public` (estado
-- in activa/reservada) sigue vigente para anon.
create policy "auth select propiedades by role"
  on public.propiedades
  for select
  to authenticated
  using (
    public.is_agent()
    or estado in ('activa', 'reservada')
    or submitted_by = auth.uid()
  );

-- INSERT (authenticated): agente puede insertar cualquier cosa.
-- Cliente solo puede crear submissions suyas en estado en_revision sin
-- agente asignado — espejo a nivel DB de lo que hace `createPropiedad`.
create policy "auth insert propiedades by role"
  on public.propiedades
  for insert
  to authenticated
  with check (
    public.is_agent()
    or (
      submitted_by = auth.uid()
      and estado = 'en_revision'
      and agente_id is null
    )
  );

-- UPDATE / DELETE: solo agentes.
create policy "agent update propiedades"
  on public.propiedades
  for update
  to authenticated
  using (public.is_agent())
  with check (public.is_agent());

create policy "agent delete propiedades"
  on public.propiedades
  for delete
  to authenticated
  using (public.is_agent());

-- ============================================================
-- leads
-- ============================================================
drop policy if exists "auth select leads" on public.leads;
drop policy if exists "auth update leads" on public.leads;
drop policy if exists "auth delete leads" on public.leads;

-- INSERT público (anon + authenticated) lo mantiene la policy de 0001
-- "Cualquiera puede crear un lead". Solo restringimos lectura/edición.
create policy "agent select leads"
  on public.leads
  for select
  to authenticated
  using (public.is_agent());

create policy "agent update leads"
  on public.leads
  for update
  to authenticated
  using (public.is_agent())
  with check (public.is_agent());

create policy "agent delete leads"
  on public.leads
  for delete
  to authenticated
  using (public.is_agent());

-- ============================================================
-- interacciones
-- ============================================================
drop policy if exists "auth select interacciones" on public.interacciones;
drop policy if exists "auth insert interacciones" on public.interacciones;
drop policy if exists "auth update interacciones" on public.interacciones;
drop policy if exists "auth delete interacciones" on public.interacciones;

create policy "agent select interacciones"
  on public.interacciones for select to authenticated using (public.is_agent());
create policy "agent insert interacciones"
  on public.interacciones for insert to authenticated with check (public.is_agent());
create policy "agent update interacciones"
  on public.interacciones for update to authenticated using (public.is_agent()) with check (public.is_agent());
create policy "agent delete interacciones"
  on public.interacciones for delete to authenticated using (public.is_agent());

-- ============================================================
-- tasaciones
-- ============================================================
drop policy if exists "auth select tasaciones" on public.tasaciones;
drop policy if exists "auth update tasaciones" on public.tasaciones;
drop policy if exists "auth delete tasaciones" on public.tasaciones;

-- INSERT público lo mantiene la policy de 0001 "Cualquiera puede solicitar
-- una tasación".
create policy "agent select tasaciones"
  on public.tasaciones for select to authenticated using (public.is_agent());
create policy "agent update tasaciones"
  on public.tasaciones for update to authenticated using (public.is_agent()) with check (public.is_agent());
create policy "agent delete tasaciones"
  on public.tasaciones for delete to authenticated using (public.is_agent());

-- ============================================================
-- agentes
-- ============================================================
drop policy if exists "auth select all agentes" on public.agentes;
drop policy if exists "auth insert agentes"    on public.agentes;
drop policy if exists "auth update agentes"    on public.agentes;
drop policy if exists "auth delete agentes"    on public.agentes;

-- La policy "Agentes activos visibles públicamente" (0001) sigue para anon.
-- Authenticated: agente ve todos (incl. inactivos); cliente solo activos.
create policy "auth select agentes by role"
  on public.agentes
  for select
  to authenticated
  using (public.is_agent() or activo = true);

create policy "agent insert agentes"
  on public.agentes for insert to authenticated with check (public.is_agent());
create policy "agent update agentes"
  on public.agentes for update to authenticated using (public.is_agent()) with check (public.is_agent());
create policy "agent delete agentes"
  on public.agentes for delete to authenticated using (public.is_agent());
