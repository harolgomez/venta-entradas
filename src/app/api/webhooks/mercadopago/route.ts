import { NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { paymentClient } from "@/lib/mercadopago/server";

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
          .select("id")
          .single();

        if (order) {
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
