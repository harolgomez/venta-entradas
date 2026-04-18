import { redirect } from "next/navigation";
import { Ticket } from "lucide-react";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { OrderHistory } from "@/components/dashboard/order-history";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Mi cuenta",
};

export default async function DashboardPage() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login?redirect=/dashboard");
  }

  const { data: orders } = await supabase
    .from("orders")
    .select(`
      id,
      status,
      total,
      currency,
      created_at,
      order_items (
        id,
        quantity,
        unit_price,
        subtotal,
        ticket_zone:ticket_zones (name),
        event:events (title, slug)
      )
    `)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 rounded-xl bg-accent-soft flex items-center justify-center">
          <Ticket className="w-6 h-6 text-accent" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Mi cuenta</h1>
          <p className="text-sm text-text-secondary">{user.email}</p>
        </div>
      </div>

      <h2 className="text-lg font-semibold text-text-primary mb-4">
        Historial de compras
      </h2>

      <OrderHistory orders={(orders as any) ?? []} />
    </div>
  );
}
