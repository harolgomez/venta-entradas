"use client";

import { useState } from "react";
import { ShoppingCart, CalendarClock } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TicketQuantity } from "./ticket-quantity";
import { useCart } from "@/hooks/use-cart";
import { formatCurrency } from "@/lib/utils";
import { MAX_TICKETS_PER_ZONE, RESERVATION_PERCENTAGE } from "@/lib/constants";
import type { TicketZone, Event } from "@/lib/types";

interface TicketZoneCardProps {
  zone: TicketZone;
  event: Event;
  mode?: "purchase" | "reservation";
}

export function TicketZoneCard({ zone, event, mode = "purchase" }: TicketZoneCardProps) {
  const [quantity, setQuantity] = useState(0);
  const { addItem } = useCart();
  const isSoldOut = zone.available === 0;
  const isLowStock = zone.available > 0 && zone.available <= 20;
  const maxQty = Math.min(zone.available, MAX_TICKETS_PER_ZONE);
  const isReservation = mode === "reservation";
  const reservationPrice = zone.price * RESERVATION_PERCENTAGE;

  const handleAddToCart = () => {
    if (quantity === 0) return;
    addItem(
      {
        ticketZoneId: zone.id,
        eventId: event.id,
        eventTitle: event.title,
        eventSlug: event.slug,
        zoneName: zone.name,
        unitPrice: zone.price,
        currency: zone.currency,
        isReservation,
      },
      quantity
    );
    toast.success(
      isReservation
        ? `${quantity}x ${zone.name} separado (reserva 20%)`
        : `${quantity}x ${zone.name} agregado al carrito`
    );
    setQuantity(0);
  };

  return (
    <Card className={isSoldOut ? "opacity-60" : ""}>
      <CardContent className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-text-primary">{zone.name}</h3>
            {isSoldOut && <Badge variant="danger">Agotado</Badge>}
            {isLowStock && !isSoldOut && (
              <Badge variant="warning">Ultimas {zone.available}!</Badge>
            )}
          </div>
          {zone.description && (
            <p className="text-sm text-text-secondary mb-1">{zone.description}</p>
          )}
          <p className="text-sm text-text-secondary">
            {zone.available} {zone.available === 1 ? "entrada disponible" : "entradas disponibles"}
          </p>
        </div>

        <div className="flex items-center gap-4 w-full sm:w-auto">
          {isReservation ? (
            <div className="text-right">
              <p className="text-xl font-bold text-accent whitespace-nowrap">
                {formatCurrency(reservationPrice, zone.currency)}
              </p>
              <p className="text-xs text-text-secondary line-through">
                {formatCurrency(zone.price, zone.currency)}
              </p>
            </div>
          ) : (
            <p className="text-xl font-bold text-accent whitespace-nowrap">
              {formatCurrency(zone.price, zone.currency)}
            </p>
          )}

          {!isSoldOut && (
            <div className="flex items-center gap-3">
              <TicketQuantity
                quantity={quantity}
                max={maxQty}
                onChange={setQuantity}
              />
              <Button
                onClick={handleAddToCart}
                disabled={quantity === 0}
                size="sm"
                className="gap-1.5 whitespace-nowrap"
              >
                {isReservation ? (
                  <>
                    <CalendarClock className="w-4 h-4" />
                    Separar
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-4 h-4" />
                    Agregar
                  </>
                )}
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
