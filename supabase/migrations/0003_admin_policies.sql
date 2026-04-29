-- Atrio · 0003 RLS policies para usuarios autenticados (panel admin)
-- ============================================================
-- Hasta que tengamos un sistema de roles más fino (agentes vs
-- super-admins), cualquier usuario autenticado tiene CRUD total
-- sobre las tablas del dominio. Anon mantiene las policies
-- restrictivas existentes (SELECT público filtrado, INSERT en
-- leads/tasaciones).
-- ============================================================

-- ---------- propiedades ----------
-- Admin ve TODOS los estados (incluido borrador/cerrada/despublicada).
create policy "auth select all propiedades"
  on public.propiedades
  for select
  to authenticated
  using (true);

create policy "auth insert propiedades"
  on public.propiedades
  for insert
  to authenticated
  with check (true);

create policy "auth update propiedades"
  on public.propiedades
  for update
  to authenticated
  using (true)
  with check (true);

create policy "auth delete propiedades"
  on public.propiedades
  for delete
  to authenticated
  using (true);

-- ---------- leads ----------
create policy "auth select leads"
  on public.leads
  for select
  to authenticated
  using (true);

create policy "auth update leads"
  on public.leads
  for update
  to authenticated
  using (true)
  with check (true);

create policy "auth delete leads"
  on public.leads
  for delete
  to authenticated
  using (true);

-- ---------- interacciones ----------
create policy "auth select interacciones"
  on public.interacciones
  for select
  to authenticated
  using (true);

create policy "auth insert interacciones"
  on public.interacciones
  for insert
  to authenticated
  with check (true);

create policy "auth update interacciones"
  on public.interacciones
  for update
  to authenticated
  using (true)
  with check (true);

create policy "auth delete interacciones"
  on public.interacciones
  for delete
  to authenticated
  using (true);

-- ---------- tasaciones ----------
create policy "auth select tasaciones"
  on public.tasaciones
  for select
  to authenticated
  using (true);

create policy "auth update tasaciones"
  on public.tasaciones
  for update
  to authenticated
  using (true)
  with check (true);

create policy "auth delete tasaciones"
  on public.tasaciones
  for delete
  to authenticated
  using (true);

-- ---------- agentes ----------
-- Admin puede ver/editar TODOS los agentes (incluido inactivos).
create policy "auth select all agentes"
  on public.agentes
  for select
  to authenticated
  using (true);

create policy "auth insert agentes"
  on public.agentes
  for insert
  to authenticated
  with check (true);

create policy "auth update agentes"
  on public.agentes
  for update
  to authenticated
  using (true)
  with check (true);

create policy "auth delete agentes"
  on public.agentes
  for delete
  to authenticated
  using (true);
