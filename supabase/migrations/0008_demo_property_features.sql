-- Atrio · 0008 demo property features
-- ============================================================
-- Las features de las propiedades demo eran muy escuetas (3-5 keys).
-- Las inflo con un set rico que cubre apto profesional, apto mascotas,
-- amenities (pileta, gimnasio, sum, etc), comodidades (cochera, baulera,
-- vestidor, dependencia), instalaciones (aire, calefacción, hogar) y
-- características de unidad. El detalle ahora pretty-printea cada key
-- vía lib/features.ts y destaca apto_profesional/apto_mascotas/amenities
-- como perks arriba de las chips.
-- Idempotente: cada UPDATE tira features completo nuevo.
-- ============================================================

-- Seed 0002 — los 3 originales
update public.propiedades set features = '[
  "balcon","vista_despejada","piso_alto","luminoso",
  "apto_profesional","sum","laundry","seguridad_24",
  "aire_acondicionado","placards_empotrados","calefaccion_central"
]'::jsonb where id = '11111111-1111-1111-1111-111111111111';

update public.propiedades set features = '[
  "jardin","quincho","parrilla","cochera_doble",
  "apto_mascotas","hogar","aire_acondicionado",
  "calefaccion_central","lavadero"
]'::jsonb where id = '22222222-2222-2222-2222-222222222222';

update public.propiedades set features = '[
  "reciclado","cocina_integrada","luminoso","apto_profesional",
  "aire_acondicionado","placards_empotrados","internet_fibra"
]'::jsonb where id = '33333333-3333-3333-3333-333333333333';

-- Migración 0006 — VENTAS
update public.propiedades set features = '[
  "a_estrenar","balcon","cocina_integrada","amenities","pileta",
  "gimnasio","sum","solarium","seguridad_24","laundry",
  "bicicletero","apto_profesional","aire_acondicionado","internet_fibra"
]'::jsonb where id = 'd0000001-0000-0000-0000-000000000001';

update public.propiedades set features = '[
  "terraza","parrilla","reciclado","sin_expensas","patio",
  "pisos_madera","calefaccion_central","apto_mascotas","vestidor","hogar"
]'::jsonb where id = 'd0000002-0000-0000-0000-000000000002';

update public.propiedades set features = '[
  "pileta","jardin","cochera_doble","hogar","parrilla","quincho",
  "apto_mascotas","vestidor","calefaccion_central","dependencia",
  "aire_acondicionado","lavadero"
]'::jsonb where id = 'd0000003-0000-0000-0000-000000000003';

update public.propiedades set features = '[
  "dependencia","cochera","balcon","luminoso","apto_profesional",
  "placards_empotrados","calefaccion_central","sum","laundry",
  "baulera","aire_acondicionado","vestidor"
]'::jsonb where id = 'd0000004-0000-0000-0000-000000000004';

update public.propiedades set features = '[
  "vista_abierta","piso_alto","luminoso","cocina_integrada","balcon",
  "sum","gimnasio","seguridad_24","apto_profesional",
  "aire_acondicionado","internet_fibra"
]'::jsonb where id = 'd0000005-0000-0000-0000-000000000005';

update public.propiedades set features = '[
  "patio","reciclado","sin_expensas","planta_baja","apto_profesional",
  "apto_mascotas","parrilla","pisos_madera","aire_acondicionado",
  "calefaccion_central"
]'::jsonb where id = 'd0000006-0000-0000-0000-000000000006';

update public.propiedades set features = '[
  "vista_plaza","seguridad_24","luminoso","apto_profesional","sum",
  "laundry","balcon","baulera","calefaccion_central","internet_fibra",
  "amenities"
]'::jsonb where id = 'd0000007-0000-0000-0000-000000000007';

update public.propiedades set features = '[
  "techos_altos","pinotea","reciclado","cocina_isla","balcon_frances",
  "apto_profesional","hogar","aire_acondicionado","vestidor"
]'::jsonb where id = 'd0000008-0000-0000-0000-000000000008';

-- Migración 0006 — ALQUILERES
update public.propiedades set features = '[
  "amoblado","amenities","cochera","balcon","gimnasio","sum",
  "laundry","seguridad_24","internet_fibra","apto_mascotas",
  "aire_acondicionado","bicicletero"
]'::jsonb where id = 'd0000009-0000-0000-0000-000000000009';

update public.propiedades set features = '[
  "luminoso","contrafrente","lavadero","cocina_integrada",
  "apto_mascotas","aire_acondicionado","placards_empotrados",
  "calefaccion_central"
]'::jsonb where id = 'd0000010-0000-0000-0000-000000000010';

update public.propiedades set features = '[
  "luminoso","cerca_subte","balcon_frances","cocina_integrada",
  "apto_profesional","internet_fibra","aire_acondicionado"
]'::jsonb where id = 'd0000011-0000-0000-0000-000000000011';

update public.propiedades set features = '[
  "cochera","baulera","pileta","gimnasio","balcon","sum",
  "laundry","seguridad_24","apto_mascotas","internet_fibra",
  "aire_acondicionado","amenities","bicicletero"
]'::jsonb where id = 'd0000012-0000-0000-0000-000000000012';

update public.propiedades set features = '[
  "senorial","techos_altos","dependencia","cochera","parquet",
  "balcon","calefaccion_central","apto_profesional","vestidor",
  "baulera","hogar","lavadero"
]'::jsonb where id = 'd0000013-0000-0000-0000-000000000013';

update public.propiedades set features = '[
  "patio","parrilla","terraza","sin_expensas","apto_mascotas",
  "pisos_madera","hogar","aire_acondicionado","lavadero"
]'::jsonb where id = 'd0000014-0000-0000-0000-000000000014';

update public.propiedades set features = '[
  "jardin","parrilla","cochera_doble","lavadero","apto_mascotas",
  "dependencia","calefaccion_central","hogar","aire_acondicionado",
  "quincho"
]'::jsonb where id = 'd0000015-0000-0000-0000-000000000015';
