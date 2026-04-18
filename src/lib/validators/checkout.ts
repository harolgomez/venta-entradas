import { z } from "zod";

export const checkoutItemSchema = z.object({
  ticketZoneId: z.string().uuid(),
  eventId: z.string().uuid(),
  quantity: z.number().int().min(1).max(6),
});

export const checkoutSchema = z.object({
  items: z.array(checkoutItemSchema).min(1, "El carrito esta vacio"),
});

export type CheckoutData = z.infer<typeof checkoutSchema>;
