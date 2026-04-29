-- Atrio · 0004 client property submissions
-- ============================================================
-- Cuando un dueño (cliente, no agente) sube su propiedad desde
-- /publicar, se guarda en estado 'en_revision' con agente_id=NULL
-- y submitted_by=auth.uid(). El admin la revisa, asigna agente
-- y la pasa a 'activa'.
-- ============================================================

-- Nuevo estado para listings que esperan revisión.
alter type public.estado_propiedad add value if not exists 'en_revision' before 'activa';

-- agente_id pasa a ser opcional hasta que el admin asigne uno.
alter table public.propiedades alter column agente_id drop not null;

-- Quién mandó la submission (referencia opcional al usuario auth).
alter table public.propiedades
  add column if not exists submitted_by uuid references auth.users(id) on delete set null;

create index if not exists propiedades_submitted_by_idx
  on public.propiedades(submitted_by);
