-- Rename Stripe columns to MercadoPago equivalents
ALTER TABLE public.orders RENAME COLUMN stripe_session_id TO mp_preference_id;
ALTER TABLE public.orders RENAME COLUMN stripe_payment_id TO mp_payment_id;

-- Rename the index
DROP INDEX IF EXISTS idx_orders_stripe_session;
CREATE INDEX idx_orders_mp_preference ON public.orders(mp_preference_id);
