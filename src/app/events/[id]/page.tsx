import { notFound } from "next/navigation";
import { Calendar, MapPin, Clock, ArrowLeft } from "lucide-react";
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
        {/* Banner gradient */}
        <div className="h-48 sm:h-64 rounded-xl bg-gradient-to-br from-accent/30 via-surface to-surface-hover flex items-center justify-center mb-6">
          <span className="text-6xl sm:text-8xl font-bold text-accent/30">
            {typedEvent.artist}
          </span>
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
    </div>
  );
}
