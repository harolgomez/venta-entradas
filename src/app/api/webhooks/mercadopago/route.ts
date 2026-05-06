import { NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { paymentClient } from "@/lib/mercadopago/server";
import { getResendClient } from "@/lib/email/server";
import { buildConfirmationEmail } from "@/lib/email/templates";
import { SITE_NAME } from "@/lib/constants";

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
    const orderId = payment.external_reference;

    if (!orderId) {
      return NextResponse.json({ error: "Missing external_reference" }, { status: 400 });
    }

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
          .select("id, customer_email, total, currency")
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
            // Don't fail the webhook if email fails
          }
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
