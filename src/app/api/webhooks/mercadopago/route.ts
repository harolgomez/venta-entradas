import { NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { paymentClient } from "@/lib/mercadopago/server";
import { getResendClient } from "@/lib/email/server";
import { buildConfirmationEmail } from "@/lib/email/templates";
import { SITE_NAME, BALANCE_REFERENCE_SUFFIX } from "@/lib/constants";

interface EmailOrder {
  id: string;
  customer_email: string;
  total: number;
  currency: string;
  is_reservation: boolean | null;
  reservation_total: number | null;
}

async function sendConfirmationEmail(
  adminSupabase: ReturnType<typeof createSupabaseAdminClient>,
  order: EmailOrder
) {
  try {
    const { data: fullItems } = await adminSupabase
      .from("order_items")
      .select(`
        quantity,
        unit_price,
        ticket_zone:ticket_zones(name),
        event:events(title, artist, event_date, venue, city, delivery_info)
      `)
      .eq("order_id", order.id);

    if (fullItems && fullItems.length > 0) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const emailItems = fullItems.map((item: any) => {
        const zone = item.ticket_zone;
        const event = item.event;
        return {
          zoneName: zone?.name ?? "Entrada",
          quantity: item.quantity,
          unitPrice: item.unit_price,
          eventTitle: event?.title ?? "Evento",
          eventArtist: event?.artist ?? "",
          eventDate: event?.event_date ?? "",
          eventVenue: event?.venue ?? "",
          eventCity: event?.city ?? "",
          deliveryInfo: event?.delivery_info ?? null,
        };
      });

      const { subject, html } = buildConfirmationEmail({
        orderId: order.id,
        customerEmail: order.customer_email,
        total: order.total,
        currency: order.currency,
        isReservation: order.is_reservation ?? false,
        reservationTotal: order.reservation_total ?? null,
        items: emailItems,
      });

      const resendClient = getResendClient();
      if (resendClient) {
        await resendClient.emails.send({
          from: `${SITE_NAME} <${process.env.RESEND_FROM_EMAIL ?? "admin@boletta.pe"}>`,
          to: order.customer_email,
          subject,
          html,
        });
      }
    }
  } catch (emailError) {
    console.error("Error sending confirmation email:", emailError);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.text();
    const notification = JSON.parse(body);

    const type = notification.type ?? notification.action;
    const dataId = notification.data?.id;

    const isPayment = type === "payment" || notification.topic === "payment";
    if (!isPayment) {
      return NextResponse.json({ received: true });
    }

    if (!dataId) {
      return NextResponse.json({ error: "Missing data.id" }, { status: 400 });
    }

    const payment = await paymentClient.get({ id: dataId });
    const adminSupabase = createSupabaseAdminClient();
    const reference = payment.external_reference;

    if (!reference) {
      return NextResponse.json({ error: "Missing external_reference" }, { status: 400 });
    }

    // Pago del saldo de una reserva: completa la orden original.
    // Un pago de saldo rechazado no debe tocar la reserva ya pagada.
    if (reference.endsWith(BALANCE_REFERENCE_SUFFIX)) {
      const orderId = reference.slice(0, -BALANCE_REFERENCE_SUFFIX.length);

      if (payment.status === "approved") {
        const { data: reservation } = await adminSupabase
          .from("orders")
          .select("id, status, total, is_reservation, reservation_total, mp_payment_id")
          .eq("id", orderId)
          .single();

        const hasBalance =
          reservation &&
          reservation.is_reservation &&
          reservation.status === "paid" &&
          reservation.reservation_total != null &&
          reservation.total < reservation.reservation_total;

        if (hasBalance) {
          // El filtro por total evita procesar dos veces la misma notificacion
          const { data: order } = await adminSupabase
            .from("orders")
            .update({
              total: reservation.reservation_total,
              mp_payment_id: [reservation.mp_payment_id, String(payment.id)]
                .filter(Boolean)
                .join(","),
              updated_at: new Date().toISOString(),
            })
            .eq("id", orderId)
            .eq("total", reservation.total)
            .select("id, customer_email, total, currency")
            .maybeSingle();

          if (order) {
            // La disponibilidad ya se desconto al pagar la reserva
            await sendConfirmationEmail(adminSupabase, {
              ...order,
              is_reservation: false,
              reservation_total: null,
            });
          }
        }
      }

      return NextResponse.json({ received: true });
    }

    const orderId = reference;

    switch (payment.status) {
      case "approved": {
        const { data: order } = await adminSupabase
          .from("orders")
          .update({
            status: "paid",
            mp_payment_id: String(payment.id),
            updated_at: new Date().toISOString(),
          })
          .eq("id", orderId)
          .select("id, customer_email, total, currency, is_reservation, reservation_total")
          .single();

        if (order) {
          // Decrement availability
          const { data: orderItems } = await adminSupabase
            .from("order_items")
            .select("ticket_zone_id, quantity")
            .eq("order_id", order.id);

          if (orderItems) {
            for (const item of orderItems) {
              await adminSupabase.rpc("decrement_availability", {
                p_zone_id: item.ticket_zone_id,
                p_quantity: item.quantity,
              });
            }
          }

          // Send confirmation email
          await sendConfirmationEmail(adminSupabase, order);
        }
        break;
      }

      case "rejected":
      case "cancelled": {
        await adminSupabase
          .from("orders")
          .update({
            status: "failed",
            updated_at: new Date().toISOString(),
          })
          .eq("id", orderId);
        break;
      }

      case "refunded": {
        await adminSupabase
          .from("orders")
          .update({
            status: "refunded",
            updated_at: new Date().toISOString(),
          })
          .eq("id", orderId);
        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("MercadoPago webhook error:", error);
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}
