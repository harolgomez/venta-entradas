-- Clean existing data
delete from public.order_items;
delete from public.orders;
delete from public.ticket_zones;
delete from public.events;

-- Insert BTS Concert Event - Peru 2026
insert into public.events (id, title, slug, description, artist, venue, city, event_date, doors_open, image_url, banner_url, category, delivery_info)
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
  'concert',
  'La transferencia de entradas se realizara via Quentro 30 dias antes del evento. Una vez completada la transferencia, recibiras una notificacion con los detalles.'
);

-- Insert Ticket Zones
insert into public.ticket_zones (event_id, name, description, price, currency, total_seats, available, sort_order) values
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Soundcheck Package - Viernes 9', 'Entrada Campo Acceso A con acceso exclusivo a la prueba de sonido. Incluye articulo VIP, ingreso anticipado y check-in personalizado. Viernes 9 de octubre.', 5500.00, 'PEN', 300, 4, 1),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Soundcheck Package - Sabado 10', 'Entrada Campo Acceso A con acceso exclusivo a la prueba de sonido. Incluye articulo VIP, ingreso anticipado y check-in personalizado. Sabado 10 de octubre.', 5500.00, 'PEN', 300, 4, 2),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Oriente (numerado) - Viernes 9', 'Asiento numerado en Oriente con excelente vista al escenario principal y pantallas. Viernes 9 de octubre.', 4500.00, 'PEN', 5000, 3, 3);
