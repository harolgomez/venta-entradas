"use client";

import { useState } from "react";
import { ArrowLeft, ChevronDown } from "lucide-react";
import Link from "next/link";

const faqs = [
  {
    category: "Sobre las entradas",
    questions: [
      {
        q: "¿Como se que las entradas son reales?",
        a: "Cada entrada publicada en nuestra plataforma pasa por un proceso de verificacion. Validamos la autenticidad del ticket antes de que este disponible para la venta. Ademas, si al momento del evento la entrada resulta invalida, te devolvemos el 100% de tu dinero.",
      },
      {
        q: "¿Cuando recibo mis entradas?",
        a: "La entrega depende del evento. En algunos casos, la transferencia de entradas se realiza via plataformas como Quentro dias antes del evento. En la pagina de cada evento encontraras la informacion especifica sobre cuando y como se entregaran las entradas.",
      },
      {
        q: "¿Puedo comprar varias entradas a la vez?",
        a: "Si, puedes agregar hasta 6 entradas por zona al carrito. Esta limitacion existe como medida anti-revendedores para garantizar acceso justo a todos los compradores.",
      },
      {
        q: "¿Las entradas son transferibles?",
        a: "Depende de las politicas del evento y del organizador. Te recomendamos verificar las condiciones especificas de cada evento antes de realizar tu compra.",
      },
    ],
  },
  {
    category: "Pagos y precios",
    questions: [
      {
        q: "¿Que metodos de pago aceptan?",
        a: "Aceptamos todos los medios de pago disponibles en Mercado Pago: tarjetas de credito, tarjetas de debito, transferencias bancarias y otros metodos locales.",
      },
      {
        q: "¿Los precios incluyen IGV?",
        a: "Si, todos los precios mostrados en la plataforma ya incluyen el IGV (18%). El precio que ves es el precio final, sin cargos ocultos.",
      },
      {
        q: "¿Es seguro pagar en la plataforma?",
        a: "Totalmente. Los pagos se procesan a traves de Mercado Pago, una de las plataformas mas seguras de Latinoamerica. Tu informacion financiera nunca pasa por nuestros servidores.",
      },
    ],
  },
  {
    category: "Reembolsos y cancelaciones",
    questions: [
      {
        q: "¿Puedo cancelar mi compra?",
        a: "Las compras no pueden cancelarse por cambio de planes personales. Sin embargo, si el evento se cancela definitivamente o si la entrada resulta invalida, recibiras un reembolso completo.",
      },
      {
        q: "¿Que pasa si el evento se cancela?",
        a: "Si el evento es cancelado definitivamente y no se reprograma, te devolvemos el 100% del valor de tu compra, incluyendo la tarifa de servicio.",
      },
      {
        q: "¿Que pasa si el evento se reprograma?",
        a: "Si el evento se reprograma para otra fecha, tu entrada sigue siendo valida para la nueva fecha. En este caso no aplica reembolso.",
      },
      {
        q: "¿Cuanto tarda un reembolso?",
        a: "Los reembolsos se procesan a traves de Mercado Pago y pueden tardar entre 5 y 15 dias habiles en reflejarse, dependiendo de tu medio de pago y entidad bancaria.",
      },
    ],
  },
  {
    category: "Cuenta y soporte",
    questions: [
      {
        q: "¿Necesito una cuenta para comprar?",
        a: "Si, necesitas crear una cuenta para realizar una compra. Esto nos permite asociar tus entradas a tu perfil y brindarte acceso a tu historial de compras.",
      },
      {
        q: "¿Donde puedo ver mis compras anteriores?",
        a: "En la seccion 'Mi cuenta' puedes acceder a tu historial completo de compras, ver el estado de cada orden y los detalles de tus entradas.",
      },
      {
        q: "¿Como contacto a soporte?",
        a: "Puedes escribirnos a soporte@reventa.com. Nuestro equipo te respondera a la brevedad posible.",
      },
    ],
  },
];

export default function FAQPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm text-text-secondary hover:text-text-primary transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Volver al inicio
      </Link>

      <h1 className="text-3xl font-bold text-text-primary mb-2">Preguntas frecuentes</h1>
      <p className="text-text-secondary mb-10">
        Encuentra respuestas a las preguntas mas comunes sobre nuestra plataforma.
      </p>

      <div className="space-y-8">
        {faqs.map((section) => (
          <div key={section.category}>
            <h2 className="text-lg font-semibold text-text-primary mb-3">
              {section.category}
            </h2>
            <div className="space-y-2">
              {section.questions.map((faq) => (
                <FAQItem key={faq.q} question={faq.q} answer={faq.a} />
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 text-center bg-surface border border-border rounded-xl p-6">
        <p className="text-text-secondary text-sm mb-2">
          ¿No encontraste lo que buscabas?
        </p>
        <a
          href="mailto:soporte@reventa.com"
          className="text-accent hover:text-accent-hover transition-colors font-medium text-sm"
        >
          Escribenos a soporte@reventa.com
        </a>
      </div>
    </div>
  );
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="bg-surface border border-border rounded-lg overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-3 p-4 text-left hover:bg-surface-hover transition-colors"
      >
        <span className="text-sm font-medium text-text-primary">{question}</span>
        <ChevronDown
          className={`w-4 h-4 text-text-secondary shrink-0 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <div className="px-4 pb-4">
          <p className="text-sm text-text-secondary leading-relaxed">{answer}</p>
        </div>
      )}
    </div>
  );
}
