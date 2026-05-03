-- Clean existing data
delete from public.order_items;
delete from public.orders;
delete from public.ticket_zones;
delete from public.events;

-- Insert BTS Concert Event - Peru 2026
insert into public.events (id, title, slug, description, artist, venue, city, event_date, doors_open, image_url, banner_url, category)
values (
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  'BTS WORLD TOUR: ARIRANG',
  'bts-world-tour-arirang',
  'BTS llega a Lima con su esperada gira mundial ARIRANG. Vive la energia, la musica y la magia del grupo mas grande del planeta. Este concierto incluye presentaciones de su ultimo album junto con los clasicos favoritos de los fans.',
  'BTS',
  'Estadio San Marcos',
  'Lima, Peru',
  '2026-10-09 20:00:00+00',
  '2026-10-09 17:00:00+00',
  '/images/bts-event.jpg',
  '/images/bts-banner.jpg',
  'concert'
);

-- Insert Ticket Zones (only Soundcheck and Tribuna Oriente)
insert into public.ticket_zones (event_id, name, description, price, currency, total_seats, available, sort_order) values
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Paquete Soundcheck', 'Entrada Campo Acceso A con acceso exclusivo a la prueba de sonido. Incluye articulo VIP, ingreso anticipado y check-in personalizado.', 2591.00, 'PEN', 300, 8, 1),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Oriente (numerado)', 'Asiento numerado en Oriente con excelente vista al escenario principal y pantallas.', 667.00, 'PEN', 5000, 3, 2);
