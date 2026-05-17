"use client";

import { Trash2 } from "lucide-react";
import { TicketQuantity } from "@/components/events/ticket-quantity";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/hooks/use-cart";
import { formatCurrency } from "@/lib/utils";
import { MAX_TICKETS_PER_ZONE, RESERVATION_PERCENTAGE } from "@/lib/constants";
import type { CartItem as CartItemType } from "@/lib/types";
import Link from "next/link";

interface CartItemProps {
  item: CartItemType;
}

export function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeItem } = useCart();
  const effectivePrice = item.isReservation
    ? item.unitPrice * RESERVATION_PERCENTAGE
    : item.unitPrice;

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 bg-surface border border-border rounded-xl">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <Link
            href={`/events/${item.eventSlug}`}
            className="font-semibold text-text-primary hover:text-accent transition-colors"
          >
            {item.eventTitle}
          </Link>
          {item.isReservation && (
            <Badge variant="warning">Reserva 20%</Badge>
          )}
        </div>
        <p className="text-sm text-text-secondary">{item.zoneName}</p>
        {item.isReservation ? (
          <div className="flex items-center gap-2">
            <p className="text-sm text-accent font-medium">
              {formatCurrency(effectivePrice, item.currency)} c/u
            </p>
            <p className="text-xs text-text-secondary line-through">
              {formatCurrency(item.unitPrice, item.currency)}
            </p>
          </div>
        ) : (
          <p className="text-sm text-accent font-medium">
            {formatCurrency(item.unitPrice, item.currency)} c/u
          </p>
        )}
      </div>

      <div className="flex items-center gap-4">
        <TicketQuantity
          quantity={item.quantity}
          max={MAX_TICKETS_PER_ZONE}
          onChange={(qty) => updateQuantity(item.ticketZoneId, item.isReservation, qty)}
        />

        <p className="font-semibold text-text-primary whitespace-nowrap min-w-[80px] text-right">
          {formatCurrency(effectivePrice * item.quantity, item.currency)}
        </p>

        <button
          onClick={() => removeItem(item.ticketZoneId, item.isReservation)}
          className="p-2 rounded-lg text-text-secondary hover:text-danger hover:bg-surface-hover transition-colors"
          title="Eliminar"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
