"use client";

import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface TicketQuantityProps {
  quantity: number;
  max: number;
  onChange: (quantity: number) => void;
}

export function TicketQuantity({ quantity, max, onChange }: TicketQuantityProps) {
  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => onChange(quantity - 1)}
        disabled={quantity <= 0}
        className={cn(
          "w-8 h-8 flex items-center justify-center rounded-lg border border-border transition-colors",
          quantity <= 0
            ? "opacity-40 cursor-not-allowed"
            : "hover:bg-surface-hover hover:border-accent/50"
        )}
      >
        <Minus className="w-4 h-4" />
      </button>

      <span className="w-8 text-center font-medium tabular-nums">{quantity}</span>

      <button
        onClick={() => onChange(quantity + 1)}
        disabled={quantity >= max}
        className={cn(
          "w-8 h-8 flex items-center justify-center rounded-lg border border-border transition-colors",
          quantity >= max
            ? "opacity-40 cursor-not-allowed"
            : "hover:bg-surface-hover hover:border-accent/50"
        )}
      >
        <Plus className="w-4 h-4" />
      </button>
    </div>
  );
}
