import { SITE_NAME } from "@/lib/constants";

interface OrderEmailData {
  orderId: string;
  customerEmail: string;
  total: number;
  currency: string;
  items: {
    zoneName: string;
    quantity: number;
    unitPrice: number;
    eventTitle: string;
    eventArtist: string;
    eventDate: string;
    eventVenue: string;
    eventCity: string;
    deliveryInfo: string | null;
  }[];
}

function formatCurrencyEmail(amount: number, currency: string = "PEN"): string {
  return new Intl.NumberFormat("es-PE", {
    style: "currency",
    currency,
  }).format(amount);
}

function formatDateEmail(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("es-PE", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function buildConfirmationEmail(data: OrderEmailData) {
  const { orderId, total, currency, items } = data;

  // Get unique delivery infos
  const deliveryInfos = [...new Set(items.map((i) => i.deliveryInfo).filter(Boolean))];

  const itemsHtml = items
    .map(
      (item) => `
      <tr>
        <td style="padding: 12px 16px; border-bottom: 1px solid #2a2a3a;">
          <strong style="color: #f0f0f5;">${item.eventTitle}</strong><br/>
          <span style="color: #9d9db8; font-size: 14px;">${item.zoneName}</span>
        </td>
        <td style="padding: 12px 16px; border-bottom: 1px solid #2a2a3a; text-align: center; color: #f0f0f5;">
          ${item.quantity}
        </td>
        <td style="padding: 12px 16px; border-bottom: 1px solid #2a2a3a; text-align: right; color: #f0f0f5;">
          ${formatCurrencyEmail(item.unitPrice * item.quantity, currency)}
        </td>
      </tr>`
    )
    .join("");

  // Event details (use first item as reference)
  const event = items[0];

  const subject = `Compra confirmada - ${event.eventTitle}`;

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; background-color: #0a0a0f; font-family: 'Segoe UI', Arial, sans-serif;">
  <div style="max-width: 600px; margin: 0 auto; padding: 20px;">

    <!-- Header -->
    <div style="text-align: center; padding: 32px 0 24px;">
      <img src="${process.env.NEXT_PUBLIC_APP_URL ?? "https://boletta.pe"}/images/logo-email.png" alt="${SITE_NAME}" width="40" height="40" style="display: inline-block; vertical-align: middle;" />
      <span style="color: #06b6d4; font-size: 28px; font-weight: bold; vertical-align: middle; margin-left: 8px;">${SITE_NAME}</span>
    </div>

    <!-- Success banner -->
    <div style="background-color: rgba(34, 197, 94, 0.1); border: 1px solid rgba(34, 197, 94, 0.3); border-radius: 12px; padding: 20px; text-align: center; margin-bottom: 24px;">
      <div style="font-size: 32px; margin-bottom: 8px; color: #22c55e;">✅</div>
      <h2 style="margin: 0 0 4px; color: #22c55e; font-size: 20px;">Compra confirmada</h2>
      <p style="margin: 0; color: #9d9db8; font-size: 14px;">Orden #${orderId.slice(0, 8)}</p>
    </div>

    <!-- Event info -->
    <div style="background-color: #12121a; border: 1px solid #2a2a3a; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
      <h3 style="margin: 0 0 4px; color: #f0f0f5; font-size: 18px;">${event.eventTitle}</h3>
      <p style="margin: 0 0 12px; color: #06b6d4; font-size: 14px;">${event.eventArtist}</p>
      <table style="width: 100%;" cellpadding="0" cellspacing="0">
        <tr>
          <td style="padding: 4px 0; color: #9d9db8; font-size: 14px;">📅 Fecha</td>
          <td style="padding: 4px 0; color: #f0f0f5; font-size: 14px; text-align: right;">${formatDateEmail(event.eventDate)}</td>
        </tr>
        <tr>
          <td style="padding: 4px 0; color: #9d9db8; font-size: 14px;">📍 Lugar</td>
          <td style="padding: 4px 0; color: #f0f0f5; font-size: 14px; text-align: right;">${event.eventVenue}, ${event.eventCity}</td>
        </tr>
      </table>
    </div>

    <!-- Order items -->
    <div style="background-color: #12121a; border: 1px solid #2a2a3a; border-radius: 12px; overflow: hidden; margin-bottom: 24px;">
      <div style="padding: 16px; border-bottom: 1px solid #2a2a3a;">
        <h3 style="margin: 0; color: #f0f0f5; font-size: 16px;">Detalle de tu compra</h3>
      </div>
      <table style="width: 100%; border-collapse: collapse;" cellpadding="0" cellspacing="0">
        <thead>
          <tr style="background-color: rgba(6, 182, 212, 0.08);">
            <th style="padding: 10px 16px; text-align: left; color: #9d9db8; font-size: 12px; font-weight: 600; text-transform: uppercase;">Entrada</th>
            <th style="padding: 10px 16px; text-align: center; color: #9d9db8; font-size: 12px; font-weight: 600; text-transform: uppercase;">Cant.</th>
            <th style="padding: 10px 16px; text-align: right; color: #9d9db8; font-size: 12px; font-weight: 600; text-transform: uppercase;">Precio</th>
          </tr>
        </thead>
        <tbody>
          ${itemsHtml}
        </tbody>
      </table>
      <div style="padding: 16px; border-top: 1px solid #2a2a3a; text-align: right;">
        <span style="color: #9d9db8; font-size: 14px;">Total: </span>
        <span style="color: #06b6d4; font-size: 18px; font-weight: bold;">${formatCurrencyEmail(total, currency)}</span>
      </div>
    </div>

    <!-- Delivery info -->
    ${deliveryInfos.length > 0 ? `
    <div style="background-color: rgba(6, 182, 212, 0.08); border: 1px solid rgba(6, 182, 212, 0.2); border-radius: 12px; padding: 20px; margin-bottom: 24px;">
      <h3 style="margin: 0 0 8px; color: #06b6d4; font-size: 16px;">📩 Entrega de entradas</h3>
      ${deliveryInfos.map((info) => `<p style="margin: 0; color: #f0f0f5; font-size: 14px; line-height: 1.6;">${info}</p>`).join("")}
      <p style="margin: 8px 0 0; color: #9d9db8; font-size: 13px;">Te enviaremos un correo adicional cuando la transferencia este lista.</p>
    </div>
    ` : ""}

    <!-- Footer -->
    <div style="text-align: center; padding: 24px 0; border-top: 1px solid #2a2a3a;">
      <p style="margin: 0 0 8px; color: #9d9db8; font-size: 13px;">
        ¿Tienes alguna pregunta? Escribenos a
        <a href="mailto:admin@boletta.pe" style="color: #06b6d4; text-decoration: none;">admin@boletta.pe</a>
      </p>
      <p style="margin: 0; color: #9d9db8; font-size: 12px;">
        &copy; ${new Date().getFullYear()} ${SITE_NAME}. Todos los derechos reservados.
      </p>
    </div>

  </div>
</body>
</html>`;

  return { subject, html };
}
