-- Atrio · 0002 seed inicial
-- ============================================================
-- Datos para que la home tenga contenido real al deployar:
-- 3 zonas (Caballito, Villa Devoto, Almagro), 1 agente demo
-- y las 3 propiedades destacadas que ya tenían los mocks.
-- IDs hardcodeados para que sean estables/idempotentes.
-- ============================================================

insert into public.zonas (id, nombre, slug, region, orden) values
  ('11111111-aaaa-1111-aaaa-111111111111', 'Caballito',    'caballito',     'capital_federal', 10),
  ('22222222-aaaa-2222-aaaa-222222222222', 'Villa Devoto', 'villa-devoto',  'capital_federal', 20),
  ('33333333-aaaa-3333-aaaa-333333333333', 'Almagro',      'almagro',       'capital_federal', 30);

insert into public.agentes (id, nombre, email, telefono, whatsapp, matricula, bio, activo) values
  (
    'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee',
    'María Pérez',
    'maria@atrio.com.ar',
    '+5491145678900',
    '+5491145678900',
    'CUCICBA 7654',
    'Especialista en Capital Federal con 12 años de experiencia.',
    true
  );

insert into public.propiedades (
  id, titulo, slug, descripcion,
  tipo, operacion, estado,
  direccion, zona_id,
  ambientes, dormitorios, banos,
  m2_cubiertos, m2_totales, m2_terraza, antiguedad,
  precio, moneda, expensas, expensas_moneda,
  abl_incluido, apto_credito, destacada,
  features, fotos,
  agente_id
) values
(
  '11111111-1111-1111-1111-111111111111',
  'Piso alto con balcón aterrazado',
  'piso-alto-balcon-aterrazado-caballito',
  'Departamento luminoso de tres ambientes en piso alto, con balcón aterrazado al frente y vista despejada.',
  'departamento', 'venta', 'activa',
  'Av. Rivadavia al 5400',
  '11111111-aaaa-1111-aaaa-111111111111',
  3, 2, 1,
  68, 72, 4, 12,
  165000, 'USD', 285000, 'ARS',
  false, true, true,
  '["balcon","luminoso","vista_despejada"]'::jsonb,
  '[{"url":"https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=900&q=80","alt":"Piso alto con balcón aterrazado en Caballito","orden":0}]'::jsonb,
  'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee'
),
(
  '22222222-2222-2222-2222-222222222222',
  'Casa con jardín y quincho',
  'casa-jardin-quincho-villa-devoto',
  'Casa de 4 ambientes con jardín al fondo, quincho con parrilla y cochera para dos autos.',
  'casa', 'alquiler', 'activa',
  'Mercedes 2300',
  '22222222-aaaa-2222-aaaa-222222222222',
  4, 3, 2,
  140, 220, null, 35,
  850000, 'ARS', null, null,
  true, false, true,
  '["jardin","quincho","cochera","parrilla"]'::jsonb,
  '[{"url":"https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=900&q=80","alt":"Casa con jardín y quincho en Villa Devoto","orden":0}]'::jsonb,
  'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee'
),
(
  '33333333-3333-3333-3333-333333333333',
  'Monoambiente reciclado',
  'monoambiente-reciclado-almagro',
  'Monoambiente totalmente reciclado a nuevo, cocina integrada y baño completo.',
  'departamento', 'venta', 'activa',
  'Bulnes 1100',
  '33333333-aaaa-3333-aaaa-333333333333',
  1, 0, 1,
  38, 38, null, 50,
  92500, 'USD', 120000, 'ARS',
  false, true, true,
  '["reciclado","cocina_integrada"]'::jsonb,
  '[{"url":"https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=900&q=80","alt":"Monoambiente reciclado en Almagro","orden":0}]'::jsonb,
  'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee'
);
