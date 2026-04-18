"use client";

import { XCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function CheckoutFailurePage() {
  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 rounded-full bg-danger/15 flex items-center justify-center mx-auto mb-6">
          <XCircle className="w-10 h-10 text-danger" />
        </div>

        <h1 className="text-3xl font-bold text-text-primary mb-3">
          El pago no pudo procesarse
        </h1>

        <p className="text-text-secondary mb-8">
          Hubo un problema con tu pago. No se realizo ningun cobro.
          Podes intentar nuevamente o elegir otro medio de pago.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/checkout">
            <Button>Intentar de nuevo</Button>
          </Link>
          <Link href="/cart">
            <Button variant="outline">Volver al carrito</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
