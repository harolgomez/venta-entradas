"use client";

import { Trash2 } from "lucide-react";
import { TicketQuantity } from "@/components/events/ticket-quantity";
import { useCart } from "@/hooks/use-cart";
import { formatCurrency } from "@/lib/utils";
import { MAX_TICKETS_PER_ZONE } from "@/lib/constants";
import type { CartItem as CartItemType } from "@/lib/types";
import Link from "next/link";

interface CartItemProps {
  item: CartItemType;
}

export function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeItem } = useCart();

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 bg-surface border border-border rounded-xl">
      <div className="flex-1 min-w-0">
        <Link
          href={`/events/${item.eventSlug}`}
          className="font-semibold text-text-primary hover:text-accent transition-colors"
        >
          {item.eventTitle}
        </Link>
        <p className="text-sm text-text-secondary">{item.zoneName}</p>
        <p className="text-sm text-accent font-medium">
          {formatCurrency(item.unitPrice, item.currency)} c/u
        </p>
      </div>

      <div className="flex items-center gap-4">
        <TicketQuantity
          quantity={item.quantity}
          max={MAX_TICKETS_PER_ZONE}
          onChange={(qty) => updateQuantity(item.ticketZoneId, qty)}
        />

        <p className="font-semibold text-text-primary whitespace-nowrap min-w-[80px] text-right">
          {formatCurrency(item.unitPrice * item.quantity, item.currency)}
        </p>

        <button
          onClick={() => removeItem(item.ticketZoneId)}
          className="p-2 rounded-lg text-text-secondary hover:text-danger hover:bg-surface-hover transition-colors"
          title="Eliminar"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
