import { NextResponse } from "next/server";
import { z } from "zod";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { preferenceClient } from "@/lib/mercadopago/server";
import { BALANCE_REFERENCE_SUFFIX } from "@/lib/constants";

const balanceSchema = z.object({
  orderId: z.string().uuid(),
});

export async function POST(request: Request) {
  try {
    // 1. Verify user is authenticated
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    // 2. Parse and validate request body
    const body = await request.json();
    const result = balanceSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: "Datos invalidos" }, { status: 400 });
    }

    // 3. Fetch the reservation (must belong to the user)
    const adminSupabase = createSupabaseAdminClient();
    const { data: order } = await adminSupabase
      .from("orders")
      .select(`
        id,
        status,
        total,
        currency,
        is_reservation,
        reservation_total,
        order_items (
          ticket_zone:ticket_zones (name),
          event:events (title)
        )
      `)
      .eq("id", result.data.orderId)
      .eq("user_id", user.id)
      .single();

    if (!order) {
      return NextResponse.json({ error: "Reserva no encontrada" }, { status: 404 });
    }

    const balance =
      order.is_reservation && order.status === "paid" && order.reservation_total != null
        ? Math.round((order.reservation_total - order.total) * 100) / 100
        : 0;

    if (balance <= 0) {
      return NextResponse.json(
        { error: "Esta orden no tiene saldo pendiente" },
        { status: 400 }
      );
    }

    // 4. Create MercadoPago Preference for the pending balance
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const firstItem = (order.order_items as any[])?.[0];
    const eventTitle = firstItem?.event?.title ?? "Evento";
    const zoneName = firstItem?.ticket_zone?.name ?? "Entrada";

    const preference = await preferenceClient.create({
      body: {
        items: [
          {
            id: order.id,
            title: `SALDO DE RESERVA - ${eventTitle} - ${zoneName}`,
            quantity: 1,
            unit_price: balance,
            currency_id: order.currency,
          },
        ],
        payer: {
          email: user.email!,
        },
        back_urls: {
          success: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/success`,
          failure: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/failure`,
          pending: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/pending`,
        },
        auto_return: "approved",
        notification_url: "https://www.boletta.pe/api/webhooks/mercadopago",
        external_reference: `${order.id}${BALANCE_REFERENCE_SUFFIX}`,
      },
    });

    // 5. Return checkout URL
    return NextResponse.json({ url: preference.init_point });
  } catch (error) {
    console.error("Balance checkout error:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
