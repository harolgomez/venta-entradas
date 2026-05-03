import { Shield, CheckCircle, RotateCcw, CreditCard, Mail, Clock, AlertTriangle } from "lucide-react";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { SITE_NAME } from "@/lib/constants";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Garantia de Compra Protegida",
  description: `Conoce la garantia de compra protegida de ${SITE_NAME}. Tu compra esta respaldada al 100%.`,
};

export default function GarantiaPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm text-text-secondary hover:text-text-primary transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Volver al inicio
      </Link>

      {/* Header */}
      <div className="flex items-center gap-3 mb-2">
        <div className="w-12 h-12 rounded-xl bg-success/12 flex items-center justify-center">
          <Shield className="w-6 h-6 text-success" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-text-primary">Garantia de Compra Protegida</h1>
        </div>
      </div>
      <p className="text-text-secondary mb-10">
        En {SITE_NAME}, tu tranquilidad es nuestra prioridad. Cada compra esta respaldada
        por nuestra garantia integral.
      </p>

      {/* Guarantees */}
      <div className="space-y-6 mb-12">
        <GuaranteeCard
          icon={<CheckCircle className="w-5 h-5 text-success" />}
          title="Entradas 100% verificadas"
          description="Cada entrada publicada en nuestra plataforma pasa por un proceso de verificacion.
          Validamos la autenticidad del ticket antes de que este disponible para la venta,
          asegurando que recibas una entrada real y valida."
        />

        <GuaranteeCard
          icon={<CreditCard className="w-5 h-5 text-accent" />}
          title="Pago seguro con Mercado Pago"
          description="Todos los pagos se procesan a traves de Mercado Pago, una de las plataformas
          de pago mas seguras de Latinoamerica. Tu informacion financiera nunca pasa por nuestros
          servidores. Ademas, cuentas con el programa de Compra Protegida de Mercado Pago."
        />

        <GuaranteeCard
          icon={<RotateCcw className="w-5 h-5 text-accent" />}
          title="Reembolso garantizado"
          description="Si el evento se cancela y no se reprograma, recibiras un reembolso del 100% del
          valor de tu compra. Si la entrada resulta invalida al momento del ingreso, tambien
          te devolvemos el total de tu pago."
        />

        <GuaranteeCard
          icon={<Mail className="w-5 h-5 text-accent" />}
          title="Confirmacion inmediata"
          description="Una vez confirmado tu pago, recibiras la confirmacion de tu compra de forma inmediata.
          Podras ver el estado de tu orden en tu historial de compras en cualquier momento."
        />

        <GuaranteeCard
          icon={<Clock className="w-5 h-5 text-accent" />}
          title="Soporte continuo"
          description="Nuestro equipo esta disponible para ayudarte antes, durante y despues de tu compra.
          Si tienes alguna duda o problema, puedes contactarnos y te responderemos a la brevedad."
        />
      </div>

      {/* How it works */}
      <div className="bg-surface border border-border rounded-xl p-6 mb-10">
        <h2 className="text-xl font-bold text-text-primary mb-6">
          ¿Como funciona la proteccion?
        </h2>

        <div className="space-y-4">
          <Step
            number={1}
            title="Compras con confianza"
            description="Selecciona tus entradas y paga de forma segura con Mercado Pago. Tu dinero queda protegido."
          />
          <Step
            number={2}
            title="Verificamos la entrada"
            description="Confirmamos la validez de la entrada antes de completar la transaccion."
          />
          <Step
            number={3}
            title="Recibes tu entrada"
            description="Una vez verificada, recibes la confirmacion y los detalles de tu entrada."
          />
          <Step
            number={4}
            title="Disfruta el evento"
            description="Asiste al evento con la tranquilidad de saber que tu entrada es 100% valida."
          />
        </div>
      </div>

      {/* When refund applies */}
      <div className="bg-surface border border-border rounded-xl p-6 mb-10">
        <div className="flex items-center gap-2 mb-4">
          <AlertTriangle className="w-5 h-5 text-warning" />
          <h2 className="text-xl font-bold text-text-primary">¿Cuando aplica el reembolso?</h2>
        </div>

        <ul className="space-y-3">
          <RefundItem text="El evento es cancelado definitivamente sin reprogramacion" applies />
          <RefundItem text="La entrada resulta invalida o duplicada al momento del ingreso" applies />
          <RefundItem text="No recibes la entrada despues de la confirmacion de pago" applies />
          <RefundItem text="Cambio de planes personales o no puedes asistir" applies={false} />
          <RefundItem text="El evento se reprograma para otra fecha" applies={false} />
        </ul>
      </div>

      {/* Contact */}
      <div className="text-center bg-accent-soft rounded-xl p-8">
        <h2 className="text-lg font-semibold text-text-primary mb-2">
          ¿Tienes alguna pregunta?
        </h2>
        <p className="text-sm text-text-secondary mb-4">
          Estamos aqui para ayudarte. Contactanos para cualquier consulta sobre tu compra.
        </p>
        <a
          href="mailto:soporte@reventa.com"
          className="inline-flex items-center gap-2 text-accent hover:text-accent-hover transition-colors font-medium"
        >
          <Mail className="w-4 h-4" />
          soporte@reventa.com
        </a>
      </div>
    </div>
  );
}

function GuaranteeCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="bg-surface border border-border rounded-xl p-5">
      <div className="flex items-center gap-2 mb-2">
        {icon}
        <h3 className="font-semibold text-text-primary">{title}</h3>
      </div>
      <p className="text-sm text-text-secondary leading-relaxed">{description}</p>
    </div>
  );
}

function Step({ number, title, description }: { number: number; title: string; description: string }) {
  return (
    <div className="flex gap-4">
      <div className="w-8 h-8 rounded-full bg-accent/15 flex items-center justify-center shrink-0">
        <span className="text-sm font-bold text-accent">{number}</span>
      </div>
      <div>
        <h3 className="font-medium text-text-primary">{title}</h3>
        <p className="text-sm text-text-secondary">{description}</p>
      </div>
    </div>
  );
}

function RefundItem({ text, applies }: { text: string; applies: boolean }) {
  return (
    <li className="flex items-start gap-2">
      {applies ? (
        <CheckCircle className="w-4 h-4 text-success mt-0.5 shrink-0" />
      ) : (
        <span className="w-4 h-4 rounded-full border-2 border-border mt-0.5 shrink-0 flex items-center justify-center">
          <span className="text-[10px] text-text-secondary">✕</span>
        </span>
      )}
      <span className={`text-sm ${applies ? "text-text-primary" : "text-text-secondary"}`}>
        {text}
      </span>
    </li>
  );
}
