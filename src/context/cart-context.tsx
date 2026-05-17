"use client";

import { createContext, useCallback, useEffect, useState, type ReactNode } from "react";
import type { CartItem } from "@/lib/types";
import { MAX_TICKETS_PER_ZONE, RESERVATION_PERCENTAGE } from "@/lib/constants";

function getCartKey(item: { ticketZoneId: string; isReservation: boolean }) {
  return `${item.ticketZoneId}:${item.isReservation ? "r" : "p"}`;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity">, quantity: number) => void;
  removeItem: (ticketZoneId: string, isReservation: boolean) => void;
  updateQuantity: (ticketZoneId: string, isReservation: boolean, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  hasReservations: boolean;
}

export const CartContext = createContext<CartContextType | null>(null);

const CART_STORAGE_KEY = "reventa-cart";

function loadCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    if (!stored) return [];
    const parsed = JSON.parse(stored) as CartItem[];
    return parsed.map((item) => ({
      ...item,
      isReservation: item.isReservation ?? false,
    }));
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
      const key = getCartKey(item);
      const existing = prev.find((i) => getCartKey(i) === key);
      if (existing) {
        const newQty = Math.min(existing.quantity + quantity, MAX_TICKETS_PER_ZONE);
        return prev.map((i) =>
          getCartKey(i) === key ? { ...i, quantity: newQty } : i
        );
      }
      return [...prev, { ...item, quantity: Math.min(quantity, MAX_TICKETS_PER_ZONE) }];
    });
  }, []);

  const removeItem = useCallback((ticketZoneId: string, isReservation: boolean) => {
    const key = getCartKey({ ticketZoneId, isReservation });
    setItems((prev) => prev.filter((i) => getCartKey(i) !== key));
  }, []);

  const updateQuantity = useCallback((ticketZoneId: string, isReservation: boolean, quantity: number) => {
    const key = getCartKey({ ticketZoneId, isReservation });
    if (quantity <= 0) {
      setItems((prev) => prev.filter((i) => getCartKey(i) !== key));
      return;
    }
    setItems((prev) =>
      prev.map((i) =>
        getCartKey(i) === key
          ? { ...i, quantity: Math.min(quantity, MAX_TICKETS_PER_ZONE) }
          : i
      )
    );
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = items.reduce((sum, i) => {
    const price = i.isReservation ? i.unitPrice * RESERVATION_PERCENTAGE : i.unitPrice;
    return sum + price * i.quantity;
  }, 0);
  const hasReservations = items.some((i) => i.isReservation);

  return (
    <CartContext.Provider
      value={{ items, addItem, removeItem, updateQuantity, clearCart, totalItems, totalPrice, hasReservations }}
    >
      {children}
    </CartContext.Provider>
  );
}
