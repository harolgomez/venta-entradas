"use client";

import { ShoppingCart } from "lucide-react";
import Link from "next/link";
import { useCart } from "@/hooks/use-cart";
import { CartItem } from "@/components/cart/cart-item";
import { CartSummary } from "@/components/cart/cart-summary";
import { Button } from "@/components/ui/button";

export default function CartPage() {
  const { items, clearCart, totalItems } = useCart();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-text-primary">Tu carrito</h1>
        {totalItems > 0 && (
          <Button variant="ghost" size="sm" onClick={clearCart}>
            Vaciar carrito
          </Button>
        )}
      </div>

      {items.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-3">
            {items.map((item) => (
              <CartItem key={item.ticketZoneId} item={item} />
            ))}
          </div>
          <div>
            <CartSummary />
          </div>
        </div>
      ) : (
        <div className="text-center py-20">
          <ShoppingCart className="w-16 h-16 text-text-secondary/30 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-text-primary mb-2">
            Tu carrito esta vacio
          </h2>
          <p className="text-text-secondary mb-6">
            Explora los eventos disponibles y agrega entradas.
          </p>
          <Link href="/events">
            <Button>Ver eventos</Button>
          </Link>
        </div>
      )}
    </div>
  );
}
