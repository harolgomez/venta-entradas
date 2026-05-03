import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { preferenceClient } from "@/lib/mercadopago/server";
import { checkoutSchema } from "@/lib/validators/checkout";

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
    const result = checkoutSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Datos invalidos", details: result.error.flatten() },
        { status: 400 }
      );
    }

    const { items } = result.data;

    // 3. Fetch current prices and availability from DB
    const adminSupabase = createSupabaseAdminClient();
    const zoneIds = items.map((i) => i.ticketZoneId);

    const { data: zones, error: zonesError } = await adminSupabase
      .from("ticket_zones")
      .select("id, name, price, currency, available, event_id")
      .in("id", zoneIds);

    if (zonesError || !zones) {
      return NextResponse.json({ error: "Error al verificar disponibilidad" }, { status: 500 });
    }

    // 4. Validate availability and build line items
    const lineItems: {
      zoneId: string;
      zoneName: string;
      eventId: string;
      quantity: number;
      unitPrice: number;
      currency: string;
    }[] = [];

    for (const item of items) {
      const zone = zones.find((z) => z.id === item.ticketZoneId);
      if (!zone) {
        return NextResponse.json(
          { error: `Zona de tickets no encontrada: ${item.ticketZoneId}` },
          { status: 400 }
        );
      }
      if (zone.available < item.quantity) {
        return NextResponse.json(
          { error: `No hay suficientes entradas disponibles para ${zone.name}` },
          { status: 400 }
        );
      }
      lineItems.push({
        zoneId: zone.id,
        zoneName: zone.name,
        eventId: zone.event_id,
        quantity: item.quantity,
        unitPrice: zone.price,
        currency: zone.currency,
      });
    }

    // 5. Calculate total
    const total = lineItems.reduce((sum, li) => sum + li.unitPrice * li.quantity, 0);

    // 6. Get event names for preference items
    const eventIds = [...new Set(lineItems.map((li) => li.eventId))];
    const { data: events } = await adminSupabase
      .from("events")
      .select("id, title")
      .in("id", eventIds);

    const eventNames = new Map(events?.map((e) => [e.id, e.title]) ?? []);

    // 7. Create pending order in database first (we need the ID for external_reference)
    const { data: order, error: orderError } = await adminSupabase
      .from("orders")
      .insert({
        user_id: user.id,
        status: "pending",
        total,
        currency: lineItems[0]?.currency ?? "USD",
        customer_email: user.email!,
      })
      .select("id")
      .single();

    if (orderError || !order) {
      return NextResponse.json({ error: "Error al crear la orden" }, { status: 500 });
    }

    // 8. Create order items
    const orderItems = lineItems.map((li) => ({
      order_id: order.id,
      ticket_zone_id: li.zoneId,
      event_id: li.eventId,
      quantity: li.quantity,
      unit_price: li.unitPrice,
      subtotal: li.unitPrice * li.quantity,
    }));

    await adminSupabase.from("order_items").insert(orderItems);

    // 9. Create MercadoPago Preference
    const preference = await preferenceClient.create({
      body: {
        items: lineItems.map((li) => ({
          id: li.zoneId,
          title: `${eventNames.get(li.eventId) ?? "Evento"} - ${li.zoneName}`,
          quantity: li.quantity,
          unit_price: li.unitPrice,
          currency_id: li.currency,
        })),
        payer: {
          email: user.email!,
        },
        back_urls: {
          success: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/success`,
          failure: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/failure`,
          pending: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/pending`,
        },
        auto_return: "approved",
        notification_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/webhooks/mercadopago`,
        external_reference: order.id,
      },
    });

    // 10. Update order with preference ID
    await adminSupabase
      .from("orders")
      .update({ mp_preference_id: preference.id })
      .eq("id", order.id);

    // 11. Return checkout URL
    return NextResponse.json({ url: preference.init_point });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
