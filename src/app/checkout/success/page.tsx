"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircle } from "lucide-react";
import Link from "next/link";
import { useCart } from "@/hooks/use-cart";
import { Button } from "@/components/ui/button";
import { Suspense } from "react";

function SuccessContent() {
  const searchParams = useSearchParams();
  const status = searchParams.get("collection_status");
  const externalReference = searchParams.get("external_reference");
  const { clearCart } = useCart();

  useEffect(() => {
    if (status === "approved" && externalReference) {
      clearCart();
    }
  }, [status, externalReference, clearCart]);

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 rounded-full bg-success/15 flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-success" />
        </div>

        <h1 className="text-3xl font-bold text-text-primary mb-3">
          Compra exitosa!
        </h1>

        <p className="text-text-secondary mb-8">
          Tu pago fue procesado correctamente. Recibiras un email de confirmacion
          con los detalles de tus entradas.
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

export default function CheckoutSuccessPage() {
  return (
    <Suspense>
      <SuccessContent />
    </Suspense>
  );
}
