"use client";

import { useState } from "react";
import { CreditCard, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";

interface PayBalanceButtonProps {
  orderId: string;
  balance: number;
  currency: string;
}

export function PayBalanceButton({ orderId, balance, currency }: PayBalanceButtonProps) {
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");

  const handlePayment = async () => {
    setProcessing(true);
    setError("");

    try {
      const response = await fetch("/api/checkout/balance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId }),
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
    <div>
      <Button onClick={handlePayment} disabled={processing} className="w-full sm:w-auto gap-2">
        {processing ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Procesando...
          </>
        ) : (
          <>
            <CreditCard className="w-4 h-4" />
            Completar pago {formatCurrency(balance, currency)}
          </>
        )}
      </Button>
      {error && (
        <p className="text-sm text-danger bg-danger/10 px-4 py-3 rounded-lg mt-3">
          {error}
        </p>
      )}
    </div>
  );
}
