import { Shield, CheckCircle, RotateCcw } from "lucide-react";
import Link from "next/link";

interface TrustBannerProps {
  variant?: "full" | "compact";
}

export function TrustBanner({ variant = "full" }: TrustBannerProps) {
  if (variant === "compact") {
    return (
      <div className="flex items-center gap-2 text-sm text-success">
        <Shield className="w-4 h-4" />
        <span className="font-medium">Compra Protegida</span>
        <span className="text-text-secondary">—</span>
        <Link href="/garantia" className="text-text-secondary hover:text-text-primary transition-colors underline underline-offset-2">
          Ver garantia
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-success/8 border border-success/20 rounded-xl p-5">
      <div className="flex items-center gap-2 mb-3">
        <Shield className="w-5 h-5 text-success" />
        <h3 className="font-semibold text-success">Compra Protegida</h3>
      </div>

      <p className="text-sm text-text-secondary mb-4">
        Todas tus compras estan respaldadas por nuestra garantia de proteccion al comprador
        y por Mercado Pago.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="flex items-start gap-2">
          <CheckCircle className="w-4 h-4 text-success mt-0.5 shrink-0" />
          <span className="text-xs text-text-secondary">
            Entradas verificadas antes de la venta
          </span>
        </div>
        <div className="flex items-start gap-2">
          <CheckCircle className="w-4 h-4 text-success mt-0.5 shrink-0" />
          <span className="text-xs text-text-secondary">
            Pago seguro con Mercado Pago
          </span>
        </div>
        <div className="flex items-start gap-2">
          <RotateCcw className="w-4 h-4 text-success mt-0.5 shrink-0" />
          <span className="text-xs text-text-secondary">
            Reembolso completo si el evento se cancela
          </span>
        </div>
      </div>

      <Link
        href="/garantia"
        className="inline-block mt-3 text-xs text-accent hover:text-accent-hover transition-colors underline underline-offset-2"
      >
        Conoce nuestra garantia completa
      </Link>
    </div>
  );
}
