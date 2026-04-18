import { createSupabaseServerClient } from "@/lib/supabase/server";
import { EventCard } from "@/components/events/event-card";
import type { Event } from "@/lib/types";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Eventos",
  description: "Explora todos los eventos disponibles y consegui tus entradas.",
};

export default async function EventsPage() {
  const supabase = await createSupabaseServerClient();

  const { data: events } = await supabase
    .from("events")
    .select("*")
    .order("event_date", { ascending: true });

  // Get min prices
  const eventIds = events?.map((e) => e.id) ?? [];
  const { data: zones } = await supabase
    .from("ticket_zones")
    .select("event_id, price")
    .in("event_id", eventIds.length > 0 ? eventIds : ["none"])
    .gt("available", 0);

  const minPriceByEvent = new Map<string, number>();
  zones?.forEach((z: { event_id: string; price: number }) => {
    const current = minPriceByEvent.get(z.event_id);
    if (current === undefined || z.price < current) {
      minPriceByEvent.set(z.event_id, z.price);
    }
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="text-3xl font-bold text-text-primary mb-2">Eventos</h1>
      <p className="text-text-secondary mb-8">
        Encontra las entradas que no pudiste conseguir en la venta oficial.
      </p>

      {events && events.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {(events as Event[]).map((event) => (
            <EventCard
              key={event.id}
              event={event}
              minPrice={minPriceByEvent.get(event.id)}
            />
          ))}
        </div>
      ) : (
        <p className="text-text-secondary text-center py-20">
          No hay eventos disponibles en este momento.
        </p>
      )}
    </div>
  );
}
