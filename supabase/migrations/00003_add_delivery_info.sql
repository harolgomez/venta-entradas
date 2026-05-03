ALTER TABLE public.events ADD COLUMN IF NOT EXISTS delivery_info text;

-- Set delivery info for BTS event
UPDATE public.events
SET delivery_info = 'La transferencia de entradas se realizara via Quentro 30 dias antes del evento. Una vez completada la transferencia, recibiras una notificacion con los detalles.'
WHERE id = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890';
