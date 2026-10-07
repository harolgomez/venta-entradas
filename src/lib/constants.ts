export const SITE_NAME = "Boletta";
export const SITE_DESCRIPTION = "Compra las entradas que no pudiste conseguir. Tu boleto seguro y garantizado.";
export const MAX_TICKETS_PER_ZONE = 6;
export const SERVICE_FEE_PERCENTAGE = 0.10; // 10% service fee
export const RESERVATION_PERCENTAGE = 0.20; // 20% para separar entrada
// Sufijo del external_reference de MercadoPago para el pago del saldo de una reserva
export const BALANCE_REFERENCE_SUFFIX = ":balance";

export const NAV_LINKS = [
  { href: "/", label: "Inicio" },
  { href: "/events", label: "Eventos" },
] as const;
