-- Atrio · 0007 demo property photos
-- ============================================================
-- Las propiedades demo (seed 0002 + 0006) traían 1 sola foto cada
-- una. Esto las actualiza a 17 fotos para que la galería del
-- detalle se vea poblada y se pueda probar el scroll-snap. Usa un
-- pool de 22 IDs de Unsplash con rotación determinística por
-- propiedad (offset basado en hashtext del id), así cada gallery
-- arranca en una foto distinta.
--
-- Solo toca propiedades con id conocido del seed para no pisar
-- submissions reales si las hubiera. Idempotente.
-- ============================================================

do $$
declare
  pool text[] := array[
    'photo-1568605114967-8130f3a36994',
    'photo-1560448204-e02f11c3d0e2',
    'photo-1502672260266-1c1ef2d93688',
    'photo-1493809842364-78817add7ffb',
    'photo-1605276374104-dee2a0ed3cd6',
    'photo-1564013799919-ab600027ffc6',
    'photo-1505691938895-1758d7feb511',
    'photo-1522708323590-d24dbb6b0267',
    'photo-1512917774080-9991f1c4c750',
    'photo-1494203484021-3c454daf695d',
    'photo-1493663284031-b7e3aefcae8e',
    'photo-1556909114-f6e7ad7d3136',
    'photo-1556228720-195a672e8a03',
    'photo-1540518614846-7eded433c457',
    'photo-1554995207-c18c203602cb',
    'photo-1556910103-1c02745aae4d',
    'photo-1583847268964-b28dc8f51f92',
    'photo-1565538810643-b5bdb714032a',
    'photo-1503174971373-b1f69850bded',
    'photo-1567767292278-a4f21aa2d36e',
    'photo-1502005229762-cf1b2da7c5d6',
    'photo-1600585154340-be6161a56a0c'
  ];
  pool_size constant int := 22;
  photos_per_prop constant int := 17;
  prop record;
  fotos_arr jsonb;
  offset_idx int;
  i int;
  pool_idx int;
begin
  for prop in
    select id, titulo
    from public.propiedades
    where id in (
      '11111111-1111-1111-1111-111111111111',
      '22222222-2222-2222-2222-222222222222',
      '33333333-3333-3333-3333-333333333333',
      'd0000001-0000-0000-0000-000000000001',
      'd0000002-0000-0000-0000-000000000002',
      'd0000003-0000-0000-0000-000000000003',
      'd0000004-0000-0000-0000-000000000004',
      'd0000005-0000-0000-0000-000000000005',
      'd0000006-0000-0000-0000-000000000006',
      'd0000007-0000-0000-0000-000000000007',
      'd0000008-0000-0000-0000-000000000008',
      'd0000009-0000-0000-0000-000000000009',
      'd0000010-0000-0000-0000-000000000010',
      'd0000011-0000-0000-0000-000000000011',
      'd0000012-0000-0000-0000-000000000012',
      'd0000013-0000-0000-0000-000000000013',
      'd0000014-0000-0000-0000-000000000014',
      'd0000015-0000-0000-0000-000000000015'
    )
  loop
    fotos_arr := '[]'::jsonb;
    offset_idx := abs(hashtext(prop.id::text)) % pool_size;

    for i in 0..(photos_per_prop - 1) loop
      pool_idx := ((offset_idx + i) % pool_size) + 1; -- arrays son 1-indexed
      fotos_arr := fotos_arr || jsonb_build_object(
        'url', 'https://images.unsplash.com/' || pool[pool_idx] || '?w=1600&q=80',
        'alt', prop.titulo || ' — foto ' || (i + 1),
        'orden', i
      );
    end loop;

    update public.propiedades
    set fotos = fotos_arr
    where id = prop.id;
  end loop;
end$$;
