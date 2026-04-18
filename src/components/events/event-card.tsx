import Link from "next/link";
import { Calendar, MapPin } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate, formatCurrency } from "@/lib/utils";
import type { Event, TicketZone } from "@/lib/types";

interface EventCardProps {
  event: Event;
  minPrice?: number;
}

export function EventCard({ event, minPrice }: EventCardProps) {
  return (
    <Link href={`/events/${event.slug}`}>
      <Card className="group hover:border-accent/50 transition-all duration-300 hover:shadow-lg hover:shadow-accent/5">
        {/* Image placeholder with gradient */}
        <div className="h-48 bg-gradient-to-br from-accent/30 via-surface to-surface-hover flex items-center justify-center">
          <span className="text-5xl font-bold text-accent/40 group-hover:text-accent/60 transition-colors">
            {event.artist}
          </span>
        </div>

        <CardContent>
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="font-semibold text-text-primary group-hover:text-accent transition-colors line-clamp-2">
              {event.title}
            </h3>
            {event.status === "active" && (
              <Badge variant="success">Disponible</Badge>
            )}
            {event.status === "sold_out" && (
              <Badge variant="danger">Agotado</Badge>
            )}
          </div>

          <div className="space-y-1.5 text-sm text-text-secondary mb-3">
            <div className="flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5" />
              <span>{formatDate(event.event_date)}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5" />
              <span>{event.venue}, {event.city}</span>
            </div>
          </div>

          {minPrice !== undefined && (
            <p className="text-sm">
              <span className="text-text-secondary">Desde </span>
              <span className="text-accent font-semibold">
                {formatCurrency(minPrice)}
              </span>
            </p>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
