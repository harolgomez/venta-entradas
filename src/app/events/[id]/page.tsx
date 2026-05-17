import { notFound } from "next/navigation";
import Image from "next/image";
import { Calendar, MapPin, Clock, ArrowLeft, Info, CalendarClock } from "lucide-react";
import { TrustBanner } from "@/components/trust/trust-banner";
import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";
import { TicketZoneCard } from "@/components/events/ticket-zone-card";
import { Badge } from "@/components/ui/badge";
import { formatDate, formatDateTime } from "@/lib/utils";
import type { Event, TicketZone } from "@/lib/types";
import type { Metadata } from "next";

interface EventPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: EventPageProps): Promise<Metadata> {
  const { id } = await params;
  const supabase = await createSupabaseServerClient();
  const { data: event } = await supabase
    .from("events")
    .select("title, description, artist")
    .eq("slug", id)
    .single();

  if (!event) return { title: "Evento no encontrado" };

  return {
    title: `${event.title} - ${event.artist}`,
    description: event.description ?? `Entradas para ${event.title}`,
  };
}

export default async function EventDetailPage({ params }: EventPageProps) {
  const { id } = await params;
  const supabase = await createSupabaseServerClient();

  const { data: event } = await supabase
    .from("events")
    .select("*")
    .eq("slug", id)
    .single();

  if (!event) notFound();

  const typedEvent = event as Event;

  const { data: zones } = await supabase
    .from("ticket_zones")
    .select("*")
    .eq("event_id", typedEvent.id)
    .order("sort_order", { ascending: true });

  const typedZones = (zones ?? []) as TicketZone[];
  const totalAvailable = typedZones.reduce((sum, z) => sum + z.available, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Back link */}
      <Link
        href="/events"
        className="inline-flex items-center gap-1.5 text-sm text-text-secondary hover:text-text-primary transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Volver a eventos
      </Link>

      {/* Event header */}
      <div className="mb-8">
        {/* Banner */}
        <div className="relative h-48 sm:h-72 rounded-xl overflow-hidden mb-6">
          {typedEvent.banner_url ? (
            <>
              <Image
                src={typedEvent.banner_url}
                alt={typedEvent.title}
                fill
                className="object-cover"
                priority
                sizes="100vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
            </>
          ) : (
            <div className="h-full bg-gradient-to-br from-accent/30 via-surface to-surface-hover flex items-center justify-center">
              <span className="text-6xl sm:text-8xl font-bold text-accent/30">
                {typedEvent.artist}
              </span>
            </div>
          )}
        </div>

        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-text-primary mb-2">
              {typedEvent.title}
            </h1>
            <p className="text-lg text-text-secondary mb-4">
              {typedEvent.artist}
            </p>
          </div>

          <div className="flex gap-2">
            {typedEvent.status === "active" && totalAvailable > 0 && (
              <Badge variant="success">
                {totalAvailable} entradas disponibles
              </Badge>
            )}
            {(typedEvent.status === "sold_out" || totalAvailable === 0) && (
              <Badge variant="danger">Agotado</Badge>
            )}
          </div>
        </div>

        <div className="flex flex-wrap gap-4 text-text-secondary">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-accent" />
            <span>{formatDate(typedEvent.event_date)}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-accent" />
            <span>{typedEvent.venue}, {typedEvent.city}</span>
          </div>
          {typedEvent.doors_open && (
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-accent" />
              <span>Puertas: {formatDateTime(typedEvent.doors_open).split(" - ")[1]}</span>
            </div>
          )}
        </div>

        {typedEvent.description && (
          <p className="mt-4 text-text-secondary leading-relaxed max-w-3xl">
            {typedEvent.description}
          </p>
        )}
      </div>

      {/* Ticket zones */}
      <section>
        <h2 className="text-xl font-bold text-text-primary mb-4">
          Selecciona tus entradas
        </h2>

        <div className="space-y-3">
          {typedZones.map((zone) => (
            <TicketZoneCard key={zone.id} zone={zone} event={typedEvent} />
          ))}
        </div>

        {typedZones.length === 0 && (
          <p className="text-text-secondary text-center py-12">
            No hay zonas de entradas configuradas para este evento.
          </p>
        )}
      </section>

      {/* Reservation section */}
      {typedZones.length > 0 && totalAvailable > 0 && typedEvent.status === "active" && (
        <section className="mt-10">
          <div className="flex items-center gap-2 mb-2">
            <CalendarClock className="w-5 h-5 text-accent" />
            <h2 className="text-xl font-bold text-text-primary">
              Separa tu entrada
            </h2>
          </div>
          <p className="text-sm text-text-secondary mb-4">
            Paga solo el 20% ahora y asegura tu lugar.
          </p>

          <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 mb-4">
            <p className="text-sm text-amber-200 leading-relaxed">
              <strong>Importante:</strong> El 80% restante del valor de la entrada debe pagarse
              hasta 30 dias antes del evento. Si no se completa el pago dentro de ese plazo,
              la reserva sera anulada y no se realizara devolucion del monto abonado.
            </p>
          </div>

          <div className="space-y-3">
            {typedZones.map((zone) => (
              <TicketZoneCard key={`reservation-${zone.id}`} zone={zone} event={typedEvent} mode="reservation" />
            ))}
          </div>
        </section>
      )}

      {/* Delivery info */}
      {typedEvent.delivery_info && (
        <section className="mt-6">
          <div className="bg-accent-soft border border-accent/20 rounded-xl p-5">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-accent mt-0.5 shrink-0" />
              <div>
                <h3 className="font-semibold text-text-primary mb-1">Entrega de entradas</h3>
                <p className="text-sm text-text-secondary leading-relaxed">
                  {typedEvent.delivery_info}
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Trust banner */}
      <section className="mt-6">
        <TrustBanner />
      </section>
    </div>
  );
}
