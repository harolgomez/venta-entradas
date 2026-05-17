"use client";

import Link from "next/link";
import { useCart } from "@/hooks/use-cart";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import { RESERVATION_PERCENTAGE } from "@/lib/constants";

export function CartSummary() {
  const { items, totalPrice, totalItems, hasReservations } = useCart();

  if (totalItems === 0) return null;

  const reservationItems = items.filter((i) => i.isReservation);
  const purchaseItems = items.filter((i) => !i.isReservation);

  const purchaseSubtotal = purchaseItems.reduce(
    (sum, i) => sum + i.unitPrice * i.quantity,
    0
  );
  const reservationSubtotal = reservationItems.reduce(
    (sum, i) => sum + i.unitPrice * RESERVATION_PERCENTAGE * i.quantity,
    0
  );
  const reservationPending = reservationItems.reduce(
    (sum, i) => sum + i.unitPrice * (1 - RESERVATION_PERCENTAGE) * i.quantity,
    0
  );

  return (
    <div className="bg-surface border border-border rounded-xl p-5 space-y-4">
      <h3 className="font-semibold text-text-primary">Resumen</h3>

      <div className="space-y-2 text-sm">
        {purchaseItems.length > 0 && (
          <div className="flex justify-between">
            <span className="text-text-secondary">
              {purchaseItems.reduce((s, i) => s + i.quantity, 0)} {purchaseItems.reduce((s, i) => s + i.quantity, 0) === 1 ? "entrada" : "entradas"}
            </span>
            <span className="text-text-primary">{formatCurrency(purchaseSubtotal)}</span>
          </div>
        )}

        {reservationItems.length > 0 && (
          <>
            <div className="flex justify-between">
              <span className="text-text-secondary">
                {reservationItems.reduce((s, i) => s + i.quantity, 0)} {reservationItems.reduce((s, i) => s + i.quantity, 0) === 1 ? "reserva" : "reservas"} (20%)
              </span>
              <span className="text-text-primary">{formatCurrency(reservationSubtotal)}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-text-secondary">Pendiente por pagar (80%)</span>
              <span className="text-amber-400">{formatCurrency(reservationPending)}</span>
            </div>
          </>
        )}

        <div className="border-t border-border pt-2 flex justify-between font-semibold text-base">
          <span className="text-text-primary">Total a pagar ahora</span>
          <span className="text-accent">{formatCurrency(totalPrice)}</span>
        </div>
      </div>

      {hasReservations && (
        <p className="text-xs text-amber-400 leading-relaxed">
          El saldo pendiente de las reservas debe pagarse 30 dias antes del evento.
        </p>
      )}

      <Link href="/checkout" className="block">
        <Button className="w-full" size="lg">
          Continuar al pago
        </Button>
      </Link>
    </div>
  );
}
