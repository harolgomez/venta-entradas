import Link from "next/link";
import { Calendar, MapPin, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatDate, formatDateTime } from "@/lib/utils";
import type { Event } from "@/lib/types";

interface EventHeroProps {
  event: Event;
}

export function EventHero({ event }: EventHeroProps) {
  return (
    <section className="relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-accent/20 via-background to-background" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(139,92,246,0.15),transparent_70%)]" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
        <div className="max-w-3xl">
          <Badge variant="accent" className="mb-4">
            Evento destacado
          </Badge>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-text-primary mb-4">
            {event.title}
          </h1>

          <p className="text-lg text-text-secondary mb-6 leading-relaxed">
            {event.artist} — {event.description}
          </p>

          <div className="flex flex-wrap gap-4 mb-8 text-text-secondary">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-accent" />
              <span>{formatDate(event.event_date)}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-accent" />
              <span>{event.venue}, {event.city}</span>
            </div>
            {event.doors_open && (
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-accent" />
                <span>Puertas: {formatDateTime(event.doors_open).split(" - ")[1]}</span>
              </div>
            )}
          </div>

          <Link href={`/events/${event.slug}`}>
            <Button size="lg" className="text-base px-8">
              Conseguir entradas
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
