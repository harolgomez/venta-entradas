import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { format } from "date-fns";
import { es } from "date-fns/locale";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, currency: string = "PEN") {
  return new Intl.NumberFormat("es-PE", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatDate(date: string | Date, pattern: string = "d 'de' MMMM, yyyy") {
  return format(new Date(date), pattern, { locale: es });
}

export function formatDateTime(date: string | Date) {
  return format(new Date(date), "d 'de' MMMM, yyyy - HH:mm 'hs'", { locale: es });
}
