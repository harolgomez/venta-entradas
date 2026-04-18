import { NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { paymentClient } from "@/lib/mercadopago/server";
import crypto from "crypto";

export async function POST(request: Request) {
  try {
    const body = await request.text();
    const xSignature = request.headers.get("x-signature");
    const xRequestId = request.headers.get("x-request-id");

    // 1. Validate signature
    if (!xSignature || !xRequestId) {
      return NextResponse.json({ error: "Missing signature" }, { status: 400 });
    }

    const notification = JSON.parse(body);
    const dataId = notification.data?.id;

    // Parse x-signature header: "ts=...,v1=..."
    const signatureParts: Record<string, string> = {};
    xSignature.split(",").forEach((part) => {
      const [key, value] = part.trim().split("=", 2);
      if (key && value) signatureParts[key] = value;
    });

    const ts = signatureParts["ts"];
    const hash = signatureParts["v1"];

    if (!ts || !hash) {
      return NextResponse.json({ error: "Invalid signature format" }, { status: 400 });
    }

    // Build manifest and verify HMAC
    const manifest = `id:${dataId};request-id:${xRequestId};ts:${ts};`;
    const expected = crypto
      .createHmac("sha256", process.env.MERCADOPAGO_WEBHOOK_SECRET!)
      .update(manifest)
      .digest("hex");

    if (hash !== expected) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    // 2. Only process payment notifications
    if (notification.type !== "payment") {
      return NextResponse.json({ received: true });
    }

    // 3. Fetch full payment details from MercadoPago API
    const payment = await paymentClient.get({ id: dataId });
    const adminSupabase = createSupabaseAdminClient();
    const orderId = payment.external_reference;

    if (!orderId) {
      return NextResponse.json({ error: "Missing external_reference" }, { status: 400 });
    }

    // 4. Handle payment status
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
          // Decrement ticket availability
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
      // "pending", "in_process", "in_mediation" — order stays pending
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("MercadoPago webhook error:", error);
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}
