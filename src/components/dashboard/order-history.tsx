import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatDate } from "@/lib/utils";

interface OrderItemDisplay {
  id: string;
  quantity: number;
  unit_price: number;
  subtotal: number;
  ticket_zone: { name: string } | null;
  event: { title: string; slug: string } | null;
}

interface OrderDisplay {
  id: string;
  status: string;
  total: number;
  currency: string;
  created_at: string;
  order_items: OrderItemDisplay[];
}

interface OrderHistoryProps {
  orders: OrderDisplay[];
}

const statusConfig: Record<string, { label: string; variant: "success" | "warning" | "danger" | "default" }> = {
  paid: { label: "Pagado", variant: "success" },
  pending: { label: "Pendiente", variant: "warning" },
  failed: { label: "Fallido", variant: "danger" },
  refunded: { label: "Reembolsado", variant: "default" },
};

export function OrderHistory({ orders }: OrderHistoryProps) {
  if (orders.length === 0) {
    return (
      <p className="text-text-secondary text-center py-12">
        Todavia no realizaste ninguna compra.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => {
        const config = statusConfig[order.status] ?? statusConfig.pending;

        return (
          <Card key={order.id}>
            <CardContent>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                <div className="flex items-center gap-3">
                  <Badge variant={config.variant}>{config.label}</Badge>
                  <span className="text-sm text-text-secondary">
                    {formatDate(order.created_at)}
                  </span>
                </div>
                <span className="text-lg font-bold text-accent">
                  {formatCurrency(order.total, order.currency)}
                </span>
              </div>

              <div className="space-y-1.5">
                {order.order_items.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between text-sm"
                  >
                    <span className="text-text-secondary">
                      {item.quantity}x {item.ticket_zone?.name ?? "Zona"} —{" "}
                      {item.event?.title ?? "Evento"}
                    </span>
                    <span className="text-text-primary">
                      {formatCurrency(item.subtotal)}
                    </span>
                  </div>
                ))}
              </div>

              <p className="text-xs text-text-secondary/60 mt-3">
                Orden: {order.id.slice(0, 8)}...
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
