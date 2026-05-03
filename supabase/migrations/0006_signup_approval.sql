-- Atrio · 0006 signup approval gate
-- Agrega aprobada a inmobiliarias y permite que un agente inactivo vea su propio registro.

ALTER TABLE public.inmobiliarias ADD COLUMN IF NOT EXISTS aprobada BOOLEAN NOT NULL DEFAULT false;
UPDATE public.inmobiliarias SET aprobada = true WHERE aprobada = false;

-- Los agentes inactivos no podían verse a sí mismos por la policy de 0005 (is_agent() OR activo=true).
-- Esta policy agrega el caso propio: el user siempre puede leer su propio registro de agente.
CREATE POLICY "users see own agente"
  ON public.agentes
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());
