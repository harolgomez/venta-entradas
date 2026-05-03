import { createSupabaseServerClient } from "@/lib/supabase/server";
import { EventHero } from "@/components/events/event-hero";
import { EventCard } from "@/components/events/event-card";
import { Shield, CreditCard, Ticket, CheckCircle, RotateCcw } from "lucide-react";
import Link from "next/link";
import type { Event, TicketZone } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const supabase = await createSupabaseServerClient();

  const { data: events } = await supabase
    .from("events")
    .select("*")
    .eq("status", "active")
    .order("event_date", { ascending: true });

  const featuredEvent = events?.[0] as Event | undefined;

  // Get min prices for each event
  let eventsWithPrices: { event: Event; minPrice: number }[] = [];
  if (events && events.length > 0) {
    const { data: zones } = await supabase
      .from("ticket_zones")
      .select("event_id, price")
      .in("event_id", events.map((e) => e.id))
      .gt("available", 0);

    const minPriceByEvent = new Map<string, number>();
    zones?.forEach((z: { event_id: string; price: number }) => {
      const current = minPriceByEvent.get(z.event_id);
      if (current === undefined || z.price < current) {
        minPriceByEvent.set(z.event_id, z.price);
      }
    });

    eventsWithPrices = (events as Event[]).map((event) => ({
      event,
      minPrice: minPriceByEvent.get(event.id) ?? 0,
    }));
  }

  return (
    <div>
      {/* Hero */}
      {featuredEvent && <EventHero event={featuredEvent} />}

      {/* Events grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <h2 className="text-2xl font-bold text-text-primary mb-8">
          Eventos disponibles
        </h2>

        {eventsWithPrices.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {eventsWithPrices.map(({ event, minPrice }) => (
              <EventCard key={event.id} event={event} minPrice={minPrice} />
            ))}
          </div>
        ) : (
          <p className="text-text-secondary text-center py-12">
            No hay eventos disponibles en este momento.
          </p>
        )}
      </section>

      {/* How it works */}
      <section className="border-t border-border bg-surface/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
          <h2 className="text-2xl font-bold text-text-primary text-center mb-3">
            ¿Como funciona?
          </h2>
          <p className="text-text-secondary text-center mb-12 max-w-xl mx-auto">
            Comprar tus entradas es simple y seguro. Tu compra esta protegida de inicio a fin.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="text-center">
              <div className="w-14 h-14 rounded-xl bg-accent-soft flex items-center justify-center mx-auto mb-4">
                <Ticket className="w-7 h-7 text-accent" />
              </div>
              <h3 className="font-semibold text-text-primary mb-2">
                1. Elige tu evento
              </h3>
              <p className="text-sm text-text-secondary">
                Explora los eventos disponibles y encuentra las entradas que necesitas.
              </p>
            </div>

            <div className="text-center">
              <div className="w-14 h-14 rounded-xl bg-accent-soft flex items-center justify-center mx-auto mb-4">
                <CreditCard className="w-7 h-7 text-accent" />
              </div>
              <h3 className="font-semibold text-text-primary mb-2">
                2. Paga seguro
              </h3>
              <p className="text-sm text-text-secondary">
                Paga con Mercado Pago. Tarjetas, transferencias y mas medios de pago aceptados.
              </p>
            </div>

            <div className="text-center">
              <div className="w-14 h-14 rounded-xl bg-accent-soft flex items-center justify-center mx-auto mb-4">
                <Shield className="w-7 h-7 text-accent" />
              </div>
              <h3 className="font-semibold text-text-primary mb-2">
                3. Recibe y disfruta
              </h3>
              <p className="text-sm text-text-secondary">
                Recibes la confirmacion de tu entrada verificada. Lista para usar el dia del evento.
              </p>
            </div>
          </div>

          {/* Trust section */}
          <div className="bg-surface border border-border rounded-2xl p-8">
            <div className="flex items-center justify-center gap-2 mb-6">
              <Shield className="w-6 h-6 text-success" />
              <h3 className="text-xl font-bold text-text-primary">Compra Protegida</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-success mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-medium text-text-primary">Entradas verificadas</p>
                  <p className="text-xs text-text-secondary">Validamos cada entrada antes de la venta</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CreditCard className="w-5 h-5 text-success mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-medium text-text-primary">Pago con Mercado Pago</p>
                  <p className="text-xs text-text-secondary">Plataforma segura y confiable</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <RotateCcw className="w-5 h-5 text-success mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-medium text-text-primary">Reembolso garantizado</p>
                  <p className="text-xs text-text-secondary">Si el evento se cancela, te devolvemos el 100%</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-success mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-medium text-text-primary">Soporte continuo</p>
                  <p className="text-xs text-text-secondary">Te ayudamos antes y despues de la compra</p>
                </div>
              </div>
            </div>

            <div className="text-center mt-6">
              <Link
                href="/garantia"
                className="text-sm text-accent hover:text-accent-hover transition-colors underline underline-offset-2"
              >
                Conoce nuestra garantia completa
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
