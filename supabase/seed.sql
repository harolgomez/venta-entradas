-- Insert BTS Concert Event
insert into public.events (id, title, slug, description, artist, venue, city, event_date, doors_open, image_url, banner_url, category)
values (
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  'BTS World Tour: LOVE YOURSELF',
  'bts-world-tour-love-yourself',
  'BTS vuelve con su gira mundial mas esperada. Vivi la energia, la musica y la magia del grupo mas grande del planeta. Este concierto incluye presentaciones de su ultimo album junto con los clasicos favoritos de los fans.',
  'BTS',
  'MetLife Stadium',
  'East Rutherford, NJ',
  '2026-07-15 19:00:00+00',
  '2026-07-15 17:00:00+00',
  '/images/bts-event.jpg',
  '/images/bts-banner.jpg',
  'concert'
);

-- Insert Ticket Zones
insert into public.ticket_zones (event_id, name, description, price, total_seats, available, sort_order) values
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'VIP Floor',         'Zona de pie frente al escenario. Incluye credencial VIP y entrada anticipada.', 450.00, 200, 47, 1),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'VIP Seated',        'Asientos premium reservados en las primeras 10 filas. Excelente visibilidad.',   350.00, 500, 123, 2),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Seccion A',         'Platea baja, secciones 101-110. Excelente vista del escenario principal.',       220.00, 2000, 384, 3),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Seccion B',         'Platea media, secciones 201-215. Buena vista general del escenario y pantallas.',150.00, 3000, 891, 4),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Seccion C',         'Platea alta, secciones 301-320. Opcion mas accesible.',                          85.00, 5000, 2103, 5),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Campo General',     'Zona de pie en el campo general detras del area VIP.',                           180.00, 1500, 512, 6);
