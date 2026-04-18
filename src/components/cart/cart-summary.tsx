"use client";

import Link from "next/link";
import { useCart } from "@/hooks/use-cart";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import { SERVICE_FEE_PERCENTAGE } from "@/lib/constants";

export function CartSummary() {
  const { totalPrice, totalItems } = useCart();
  const serviceFee = totalPrice * SERVICE_FEE_PERCENTAGE;
  const total = totalPrice + serviceFee;

  if (totalItems === 0) return null;

  return (
    <div className="bg-surface border border-border rounded-xl p-5 space-y-4">
      <h3 className="font-semibold text-text-primary">Resumen</h3>

      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-text-secondary">
            Subtotal ({totalItems} {totalItems === 1 ? "entrada" : "entradas"})
          </span>
          <span className="text-text-primary">{formatCurrency(totalPrice)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-text-secondary">Cargo por servicio (10%)</span>
          <span className="text-text-primary">{formatCurrency(serviceFee)}</span>
        </div>
        <div className="border-t border-border pt-2 flex justify-between font-semibold text-base">
          <span className="text-text-primary">Total</span>
          <span className="text-accent">{formatCurrency(total)}</span>
        </div>
      </div>

      <Link href="/checkout" className="block">
        <Button className="w-full" size="lg">
          Continuar al pago
        </Button>
      </Link>
    </div>
  );
}
