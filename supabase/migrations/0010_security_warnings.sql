-- Atrio · 0010 cierre de warnings de seguridad
-- ============================================================
-- Después de 0009 (que cerró los ERROR críticos de RLS) quedaron
-- 4 warnings menores que se atacan por SQL en esta migración:
--
-- 1. Función set_updated_at sin search_path fijo (mutable).
-- 2. Función get_inmo_features ejecutable por anon.
-- 3. Función is_agent ejecutable por anon.
-- 4. Policies INSERT en leads y tasaciones con WITH CHECK = true.
--
-- El warning #5 (leaked password protection en Auth) NO se cierra
-- por SQL — es un toggle del Dashboard. Steps al final del archivo.
-- ============================================================

-- 1. set_updated_at: fijar search_path para evitar function hijacking.
create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = public, pg_temp
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- 2. get_inmo_features: solo ejecutable por authenticated.
revoke execute on function public.get_inmo_features() from public;
revoke execute on function public.get_inmo_features() from anon;
grant execute on function public.get_inmo_features() to authenticated;

-- 3. is_agent: solo ejecutable por authenticated.
revoke execute on function public.is_agent() from public;
revoke execute on function public.is_agent() from anon;
grant execute on function public.is_agent() to authenticated;

-- 4. leads INSERT — defense in depth: nombre y email no vacíos.
--    Las columnas ya son NOT NULL pero esto bloquea strings vacíos /
--    solo-espacios y satisface al linter (la policy ya no es "true").
drop policy if exists "Cualquiera puede crear un lead" on public.leads;
create policy "Cualquiera puede crear un lead"
  on public.leads
  for insert
  to anon, authenticated
  with check (
    length(btrim(coalesce(nombre, ''))) > 0
    and length(btrim(coalesce(email, ''))) > 0
  );

-- 4b. tasaciones INSERT — mismo patrón.
drop policy if exists "Cualquiera puede solicitar una tasación" on public.tasaciones;
create policy "Cualquiera puede solicitar una tasación"
  on public.tasaciones
  for insert
  to anon, authenticated
  with check (
    length(btrim(coalesce(nombre, ''))) > 0
    and length(btrim(coalesce(email, ''))) > 0
  );

-- ============================================================
-- Pendiente manual (no se puede vía SQL):
--
-- 5. Leaked Password Protection
--    Supabase Dashboard → Authentication → Policies → Password
--    Activar "Leaked password protection" (chequea contra
--    HaveIBeenPwned al registrarse / cambiar password).
-- ============================================================
