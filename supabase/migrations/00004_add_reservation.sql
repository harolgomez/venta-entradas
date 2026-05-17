-- Add reservation support to orders
ALTER TABLE public.orders ADD COLUMN is_reservation boolean NOT NULL DEFAULT false;
ALTER TABLE public.orders ADD COLUMN reservation_total numeric(10, 2);
