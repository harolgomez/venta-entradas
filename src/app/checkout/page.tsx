"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { CreditCard, ArrowLeft, Loader2, Info } from "lucide-react";
import { TrustBanner } from "@/components/trust/trust-banner";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import Link from "next/link";
import { useCart } from "@/hooks/use-cart";
import { useUser } from "@/hooks/use-user";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";

export default function CheckoutPage() {
  const { items, totalPrice, totalItems } = useCart();
  const { user, loading: userLoading } = useUser();
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");
  const [deliveryInfos, setDeliveryInfos] = useState<string[]>([]);
  const router = useRouter();

  const total = totalPrice;

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!userLoading && !user) {
      router.push("/auth/login?redirect=/checkout");
    }
  }, [userLoading, user, router]);

  // Fetch delivery info for events in cart
  useEffect(() => {
    if (items.length === 0) return;
    const eventIds = [...new Set(items.map((i) => i.eventId))];
    const supabase = createSupabaseBrowserClient();
    supabase
      .from("events")
      .select("delivery_info")
      .in("id", eventIds)
      .not("delivery_info", "is", null)
      .then(({ data }) => {
        if (data) {
          setDeliveryInfos(data.map((e) => e.delivery_info).filter(Boolean));
        }
      });
  }, [items]);

  if (!userLoading && !user) return null;

  if (totalItems === 0 && typeof window !== "undefined") {
    router.push("/cart");
    return null;
  }

  const handlePayment = async () => {
    setProcessing(true);
    setError("");

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((item) => ({
            ticketZoneId: item.ticketZoneId,
            eventId: item.eventId,
            quantity: item.quantity,
          })),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Error al procesar el pago");
        setProcessing(false);
        return;
      }

      // Redirect to Mercado Pago Checkout Pro
      window.location.href = data.url;
    } catch {
      setError("Error de conexion. Intenta de nuevo.");
      setProcessing(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
      <Link
        href="/cart"
        className="inline-flex items-center gap-1.5 text-sm text-text-secondary hover:text-text-primary transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Volver al carrito
      </Link>

      <h1 className="text-3xl font-bold text-text-primary mb-8">Checkout</h1>

      {/* Order summary */}
      <div className="bg-surface border border-border rounded-xl p-6 mb-6">
        <h2 className="font-semibold text-text-primary mb-4">Resumen de tu orden</h2>

        <div className="space-y-3 mb-4">
          {items.map((item) => (
            <div key={item.ticketZoneId} className="flex justify-between text-sm">
              <span className="text-text-secondary">
                {item.quantity}x {item.zoneName} — {item.eventTitle}
              </span>
              <span className="text-text-primary font-medium">
                {formatCurrency(item.unitPrice * item.quantity, item.currency)}
              </span>
            </div>
          ))}
        </div>

        <div className="border-t border-border pt-3">
          <div className="flex justify-between font-semibold text-base">
            <span className="text-text-primary">Total</span>
            <span className="text-accent">{formatCurrency(total)}</span>
          </div>
        </div>
      </div>

      {/* Payment info */}
      <div className="bg-surface border border-border rounded-xl p-6 mb-6">
        <div className="flex items-center gap-2 mb-2">
          <CreditCard className="w-5 h-5 text-accent" />
          <h2 className="font-semibold text-text-primary">Pago seguro</h2>
        </div>
        <p className="text-sm text-text-secondary">
          Seras redirigido a Mercado Pago para completar el pago de forma segura.
          Aceptamos tarjetas de credito, debito, transferencias y otros medios de pago.
        </p>
      </div>

      {/* Delivery info */}
      {deliveryInfos.length > 0 && (
        <div className="bg-accent-soft border border-accent/20 rounded-xl p-4 mb-6">
          <div className="flex items-start gap-2.5">
            <Info className="w-4 h-4 text-accent mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-medium text-text-primary mb-0.5">Entrega de entradas</p>
              {deliveryInfos.map((info, i) => (
                <p key={i} className="text-xs text-text-secondary">{info}</p>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Trust banner */}
      <div className="mb-6">
        <TrustBanner variant="compact" />
      </div>

      {error && (
        <p className="text-sm text-danger bg-danger/10 px-4 py-3 rounded-lg mb-4">
          {error}
        </p>
      )}

      <Button
        onClick={handlePayment}
        disabled={processing}
        className="w-full gap-2"
        size="lg"
      >
        {processing ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Procesando...
          </>
        ) : (
          <>
            <CreditCard className="w-5 h-5" />
            Pagar {formatCurrency(total)}
          </>
        )}
      </Button>
    </div>
  );
}
