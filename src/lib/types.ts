export interface Event {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  artist: string;
  venue: string;
  city: string;
  event_date: string;
  doors_open: string | null;
  image_url: string | null;
  banner_url: string | null;
  category: string;
  delivery_info: string | null;
  status: "active" | "sold_out" | "cancelled" | "past";
  created_at: string;
}

export interface TicketZone {
  id: string;
  event_id: string;
  name: string;
  description: string | null;
  price: number;
  currency: string;
  total_seats: number;
  available: number;
  sort_order: number;
  created_at: string;
}

export interface Order {
  id: string;
  user_id: string | null;
  mp_preference_id: string | null;
  mp_payment_id: string | null;
  status: "pending" | "paid" | "failed" | "refunded";
  total: number;
  currency: string;
  customer_email: string;
  is_reservation: boolean;
  reservation_total: number | null;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  ticket_zone_id: string;
  event_id: string;
  quantity: number;
  unit_price: number;
  subtotal: number;
  created_at: string;
}

export interface OrderWithItems extends Order {
  order_items: (OrderItem & {
    ticket_zone: TicketZone;
    event: Event;
  })[];
}

export interface CartItem {
  ticketZoneId: string;
  eventId: string;
  eventTitle: string;
  eventSlug: string;
  zoneName: string;
  unitPrice: number;
  quantity: number;
  currency: string;
  isReservation: boolean;
}
