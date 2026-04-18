"use client";

import { useEffect } from "react";
import { Clock } from "lucide-react";
import Link from "next/link";
import { useCart } from "@/hooks/use-cart";
import { Button } from "@/components/ui/button";

export default function CheckoutPendingPage() {
  const { clearCart } = useCart();

  useEffect(() => {
    clearCart();
  }, [clearCart]);

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 rounded-full bg-warning/15 flex items-center justify-center mx-auto mb-6">
          <Clock className="w-10 h-10 text-warning" />
        </div>

        <h1 className="text-3xl font-bold text-text-primary mb-3">
          Pago en proceso
        </h1>

        <p className="text-text-secondary mb-8">
          Tu pago esta siendo procesado. Te enviaremos un email de confirmacion
          cuando se acredite. Esto puede tardar unos minutos dependiendo del
          medio de pago elegido.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/dashboard">
            <Button>Ver mis compras</Button>
          </Link>
          <Link href="/events">
            <Button variant="outline">Explorar mas eventos</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
