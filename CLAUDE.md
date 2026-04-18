@AGENTS.md

# ReVenta - Plataforma de Reventa de Entradas

## Stack
- **Framework:** Next.js 16 (App Router) + TypeScript + React 19
- **Styling:** Tailwind CSS v4 (config via CSS `@theme`, no tailwind.config.ts)
- **Base de datos + Auth:** Supabase (PostgreSQL, auth integrada, RLS)
- **Pagos:** Mercado Pago Checkout Pro
- **Forms:** React Hook Form + Zod
- **Icons:** Lucide React
- **Toasts:** Sonner
- **Fechas:** date-fns (locale: es)

## Estructura del proyecto
```
src/
├── app/                    # Rutas (App Router)
│   ├── page.tsx            # Landing (hero BTS + eventos)
│   ├── events/             # Catalogo y detalle de eventos
│   ├── cart/               # Carrito de compras
│   ├── checkout/           # Checkout + confirmacion
│   ├── auth/               # Login, register, callbacks
│   ├── dashboard/          # Historial de compras (protegida)
│   └── api/                # API routes (checkout, webhooks)
├── components/
│   ├── ui/                 # Primitivos: button, card, badge, input, skeleton
│   ├── layout/             # header, footer
│   ├── events/             # event-hero, event-card, ticket-zone-card
│   ├── cart/               # cart-item, cart-summary
│   ├── auth/               # login-form, register-form, auth-guard
│   └── dashboard/          # order-history
├── lib/
│   ├── supabase/           # Clientes: client.ts (browser), server.ts, admin.ts, middleware.ts
│   ├── mercadopago/        # server.ts (Preference + Payment clients)
│   ├── validators/         # Schemas Zod: auth.ts, checkout.ts
│   ├── types.ts            # Tipos TS que mapean al schema de BD
│   ├── utils.ts            # cn(), formatCurrency(), formatDate()
│   └── constants.ts        # SITE_NAME, NAV_LINKS, MAX_TICKETS_PER_ZONE, SERVICE_FEE
├── context/cart-context.tsx # CartProvider (React Context + localStorage)
├── hooks/                  # use-cart.ts, use-user.ts
└── middleware.ts            # Refresh de sesion Supabase
supabase/
├── migrations/00001_initial_schema.sql  # Schema: events, ticket_zones, orders, order_items
└── seed.sql                             # Evento BTS con 6 zonas de tickets
```

## Base de datos (Supabase/PostgreSQL)
- **events:** titulo, slug, artista, venue, fecha, estado
- **ticket_zones:** zona dentro de un evento (VIP, Seccion A, etc.), precio, disponibilidad
- **orders:** orden de compra vinculada a usuario y MercadoPago preference
- **order_items:** items de cada orden (zona, cantidad, precio)
- **decrement_availability():** funcion SQL atomica para decrementar tickets sin race conditions
- **RLS:** eventos publicos, ordenes solo visibles por su usuario

## Tema visual
- Tema oscuro: background `#0a0a0f`, surface `#12121a`, border `#2a2a3a`
- Acento violeta: `#8b5cf6` (accent), `#7c3aed` (accent-hover)
- Texto: primary `#f0f0f5`, secondary `#8888a0`
- Font: Inter
- Los colores se definen como CSS custom properties en `globals.css` con `@theme inline`

## Convenciones
- Idioma de la UI: Español (latinoamericano)
- Paginas con datos de Supabase usan `export const dynamic = "force-dynamic"`
- El carrito vive en cliente (Context + localStorage), no en BD
- Maximo 6 tickets por zona por carrito (anti-scalping)
- Cargo por servicio: 10% sobre subtotal
- Formateo de moneda: `es-AR` con Intl.NumberFormat

## Comandos
```bash
npm run dev      # Dev server en localhost:3000
npm run build    # Build de produccion
npm run lint     # ESLint
```

## Variables de entorno (.env.local)
```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
MERCADOPAGO_ACCESS_TOKEN
MERCADOPAGO_WEBHOOK_SECRET
NEXT_PUBLIC_APP_URL
```
