-- Atrio · 0011 SECURITY DEFINER → SECURITY INVOKER
-- ============================================================
-- is_agent() y get_inmo_features() venían marcadas como
-- SECURITY DEFINER. El advisor de Supabase warnea que
-- ejecutarlas con privilegios del owner cuando son llamables por
-- authenticated/anon es overkill — el caller ya tiene los grants
-- que necesita para leer las tablas que estas funciones consultan:
--
--   · agentes        → SELECT público (activo = true).
--   · plans          → SELECT público (activo = true) (0009).
--   · inmobiliarias  → SELECT a agentes propios (0009).
--   · subscriptions  → SELECT a agentes propios (0009).
--
-- Las cambiamos a SECURITY INVOKER para que respeten las RLS del
-- caller. Mantenemos search_path fijo y el grant solo a
-- authenticated (anon revocado en 0010).
-- ============================================================

create or replace function public.is_agent()
returns boolean
language sql
stable
security invoker
set search_path = public, pg_temp
as $$
  select exists(
    select 1
    from public.agentes
    where user_id = auth.uid()
      and activo = true
  );
$$;

create or replace function public.get_inmo_features()
returns jsonb
language plpgsql
security invoker
set search_path = public, pg_temp
as $$
declare
  v_inmo_id uuid;
  v_is_demo boolean;
  v_estado  text;
  v_features jsonb;
  v_pro_features jsonb;
begin
  select inmobiliaria_id into v_inmo_id
  from agentes
  where user_id = auth.uid()
  limit 1;

  if v_inmo_id is null then
    return '{}';
  end if;

  select features into v_pro_features
  from plans where nombre = 'Pro' and activo = true limit 1;

  select is_demo into v_is_demo from inmobiliarias where id = v_inmo_id;
  if v_is_demo then
    return coalesce(v_pro_features, '{}');
  end if;

  select estado into v_estado
  from inmobiliaria_subscriptions
  where inmobiliaria_id = v_inmo_id
  order by created_at desc limit 1;

  if v_estado = 'trialing' then
    return coalesce(v_pro_features, '{}');
  end if;

  select p.features into v_features
  from inmobiliaria_subscriptions s
  join plans p on p.id = s.plan_id
  where s.inmobiliaria_id = v_inmo_id and s.estado = 'active'
  order by s.created_at desc limit 1;

  return coalesce(v_features, '{}');
end
$$;

revoke execute on function public.is_agent()          from public, anon;
revoke execute on function public.get_inmo_features() from public, anon;
grant  execute on function public.is_agent()          to authenticated;
grant  execute on function public.get_inmo_features() to authenticated;
