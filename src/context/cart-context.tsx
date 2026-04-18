"use client";

import { createContext, useCallback, useEffect, useState, type ReactNode } from "react";
import type { CartItem } from "@/lib/types";
import { MAX_TICKETS_PER_ZONE } from "@/lib/constants";

interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity">, quantity: number) => void;
  removeItem: (ticketZoneId: string) => void;
  updateQuantity: (ticketZoneId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

export const CartContext = createContext<CartContextType | null>(null);

const CART_STORAGE_KEY = "reventa-cart";

function loadCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setItems(loadCart());
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    }
  }, [items, mounted]);

  const addItem = useCallback((item: Omit<CartItem, "quantity">, quantity: number) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.ticketZoneId === item.ticketZoneId);
      if (existing) {
        const newQty = Math.min(existing.quantity + quantity, MAX_TICKETS_PER_ZONE);
        return prev.map((i) =>
          i.ticketZoneId === item.ticketZoneId ? { ...i, quantity: newQty } : i
        );
      }
      return [...prev, { ...item, quantity: Math.min(quantity, MAX_TICKETS_PER_ZONE) }];
    });
  }, []);

  const removeItem = useCallback((ticketZoneId: string) => {
    setItems((prev) => prev.filter((i) => i.ticketZoneId !== ticketZoneId));
  }, []);

  const updateQuantity = useCallback((ticketZoneId: string, quantity: number) => {
    if (quantity <= 0) {
      setItems((prev) => prev.filter((i) => i.ticketZoneId !== ticketZoneId));
      return;
    }
    setItems((prev) =>
      prev.map((i) =>
        i.ticketZoneId === ticketZoneId
          ? { ...i, quantity: Math.min(quantity, MAX_TICKETS_PER_ZONE) }
          : i
      )
    );
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0);

  return (
    <CartContext.Provider
      value={{ items, addItem, removeItem, updateQuantity, clearCart, totalItems, totalPrice }}
    >
      {children}
    </CartContext.Provider>
  );
}
