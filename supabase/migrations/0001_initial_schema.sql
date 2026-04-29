-- Atrio · 0001 schema inicial
-- ============================================================
-- 6 tablas del dominio: agentes, zonas, propiedades, leads,
-- interacciones, tasaciones. Enums explícitos para todos los
-- estados de negocio. RLS habilitado en todas: SELECT público
-- para lo que se muestra al visitante anónimo, INSERT permitido
-- en formularios públicos (leads, tasaciones). Las políticas de
-- escritura para agentes se refinan cuando exista auth con
-- roles.
-- ============================================================

create extension if not exists postgis with schema extensions;

-- ============================================================
-- ENUMS
-- ============================================================

create type public.tipo_propiedad as enum (
  'departamento', 'casa', 'ph', 'terreno', 'local', 'oficina', 'cochera', 'emprendimiento'
);

create type public.operacion as enum (
  'venta', 'alquiler', 'alquiler_temporario'
);

create type public.estado_propiedad as enum (
  'borrador', 'activa', 'reservada', 'cerrada', 'despublicada'
);

create type public.moneda as enum ('USD', 'ARS');

create type public.region_zona as enum (
  'capital_federal', 'gba_norte', 'gba_oeste', 'gba_sur', 'costa_atlantica', 'otros'
);

create type public.tipo_propiedad_tasacion as enum (
  'departamento', 'casa', 'ph', 'terreno', 'local', 'oficina'
);

create type public.canal_lead as enum (
  'web', 'whatsapp', 'telefono', 'presencial', 'otro'
);

create type public.estado_lead as enum (
  'nuevo', 'contactado', 'calificado', 'descartado', 'convertido'
);

create type public.tipo_interaccion as enum (
  'llamada', 'whatsapp', 'email', 'visita', 'nota'
);

create type public.estado_tasacion as enum (
  'solicitada', 'en_proceso', 'completada', 'descartada'
);

-- ============================================================
-- updated_at trigger
-- ============================================================

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- ============================================================
-- agentes
-- ============================================================

create table public.agentes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users (id) on delete set null,
  nombre text not null,
  email text not null,
  telefono text,
  whatsapp text,
  foto_url text,
  matricula text,
  bio text,
  activo boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index agentes_user_id_idx on public.agentes (user_id);

create trigger agentes_updated_at
  before update on public.agentes
  for each row
  execute function public.set_updated_at();

-- ============================================================
-- zonas
-- ============================================================

create table public.zonas (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  slug text unique not null,
  region public.region_zona not null,
  foto_url text,
  orden integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index zonas_region_idx on public.zonas (region);

create trigger zonas_updated_at
  before update on public.zonas
  for each row
  execute function public.set_updated_at();

-- ============================================================
-- propiedades
-- ============================================================

create table public.propiedades (
  id uuid primary key default gen_random_uuid(),
  titulo text not null,
  slug text unique not null,
  descripcion text,
  tipo public.tipo_propiedad not null,
  operacion public.operacion not null,
  estado public.estado_propiedad not null default 'borrador',
  direccion text not null,
  zona_id uuid not null references public.zonas (id) on delete restrict,
  ambientes integer,
  dormitorios integer,
  banos integer,
  m2_cubiertos numeric,
  m2_totales numeric,
  m2_terraza numeric,
  antiguedad integer,
  precio numeric not null,
  moneda public.moneda not null,
  expensas numeric,
  expensas_moneda public.moneda,
  abl_incluido boolean not null default false,
  apto_credito boolean not null default false,
  destacada boolean not null default false,
  features jsonb not null default '[]'::jsonb,
  fotos jsonb not null default '[]'::jsonb,
  agente_id uuid not null references public.agentes (id) on delete restrict,
  ubicacion extensions.geography(Point, 4326),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index propiedades_zona_id_idx on public.propiedades (zona_id);
create index propiedades_agente_id_idx on public.propiedades (agente_id);
create index propiedades_estado_idx on public.propiedades (estado);
create index propiedades_destacada_idx on public.propiedades (destacada) where destacada = true;
create index propiedades_operacion_idx on public.propiedades (operacion);
create index propiedades_ubicacion_idx on public.propiedades using gist (ubicacion);

create trigger propiedades_updated_at
  before update on public.propiedades
  for each row
  execute function public.set_updated_at();

-- ============================================================
-- leads
-- ============================================================

create table public.leads (
  id uuid primary key default gen_random_uuid(),
  propiedad_id uuid references public.propiedades (id) on delete set null,
  nombre text not null,
  email text not null,
  telefono text,
  mensaje text,
  canal public.canal_lead not null default 'web',
  estado public.estado_lead not null default 'nuevo',
  agente_asignado_id uuid references public.agentes (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index leads_propiedad_id_idx on public.leads (propiedad_id);
create index leads_estado_idx on public.leads (estado);
create index leads_agente_asignado_id_idx on public.leads (agente_asignado_id);

create trigger leads_updated_at
  before update on public.leads
  for each row
  execute function public.set_updated_at();

-- ============================================================
-- interacciones
-- ============================================================

create table public.interacciones (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references public.leads (id) on delete cascade,
  agente_id uuid not null references public.agentes (id) on delete restrict,
  tipo public.tipo_interaccion not null,
  contenido text,
  created_at timestamptz not null default now()
);

create index interacciones_lead_id_idx on public.interacciones (lead_id);

-- ============================================================
-- tasaciones
-- ============================================================

create table public.tasaciones (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  email text not null,
  telefono text,
  direccion text,
  tipo public.tipo_propiedad_tasacion,
  ambientes integer,
  m2 numeric,
  comentarios text,
  estado public.estado_tasacion not null default 'solicitada',
  agente_asignado_id uuid references public.agentes (id) on delete set null,
  valor_estimado numeric,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index tasaciones_estado_idx on public.tasaciones (estado);

create trigger tasaciones_updated_at
  before update on public.tasaciones
  for each row
  execute function public.set_updated_at();

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

alter table public.agentes enable row level security;
alter table public.zonas enable row level security;
alter table public.propiedades enable row level security;
alter table public.leads enable row level security;
alter table public.interacciones enable row level security;
alter table public.tasaciones enable row level security;

-- agentes activos: lectura pública (cards en home, ficha en propiedades)
create policy "Agentes activos visibles públicamente"
  on public.agentes for select
  using (activo = true);

-- zonas: lectura pública
create policy "Zonas visibles públicamente"
  on public.zonas for select
  using (true);

-- propiedades: solo las activas y reservadas son públicas
create policy "Propiedades publicadas visibles públicamente"
  on public.propiedades for select
  using (estado in ('activa', 'reservada'));

-- leads: cualquiera puede crear desde un formulario público
create policy "Cualquiera puede crear un lead"
  on public.leads for insert
  with check (true);

-- tasaciones: cualquiera puede solicitar una desde un formulario público
create policy "Cualquiera puede solicitar una tasación"
  on public.tasaciones for insert
  with check (true);

-- interacciones: sin policies → bloqueado para anon. Las policies para
-- agentes se agregan cuando exista el sistema de auth con roles.
