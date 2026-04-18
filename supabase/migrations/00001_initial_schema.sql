-- Enable UUID generation
create extension if not exists "uuid-ossp";

-- EVENTS table
create table public.events (
  id            uuid primary key default uuid_generate_v4(),
  title         text not null,
  slug          text unique not null,
  description   text,
  artist        text not null,
  venue         text not null,
  city          text not null,
  event_date    timestamptz not null,
  doors_open    timestamptz,
  image_url     text,
  banner_url    text,
  category      text not null default 'concert',
  status        text not null default 'active'
      check (status in ('active', 'sold_out', 'cancelled', 'past')),
  created_at    timestamptz default now()
);

-- TICKET_ZONES table
create table public.ticket_zones (
  id            uuid primary key default uuid_generate_v4(),
  event_id      uuid references public.events(id) on delete cascade,
  name          text not null,
  description   text,
  price         numeric(10, 2) not null,
  currency      text not null default 'USD',
  total_seats   integer not null,
  available     integer not null,
  sort_order    integer default 0,
  created_at    timestamptz default now(),
  constraint available_lte_total check (available >= 0 and available <= total_seats)
);

-- ORDERS table
create table public.orders (
  id                uuid primary key default uuid_generate_v4(),
  user_id           uuid references auth.users(id) on delete set null,
  stripe_session_id text unique,
  stripe_payment_id text,
  status            text not null default 'pending'
      check (status in ('pending', 'paid', 'failed', 'refunded')),
  total             numeric(10, 2) not null,
  currency          text not null default 'USD',
  customer_email    text not null,
  created_at        timestamptz default now(),
  updated_at        timestamptz default now()
);

-- ORDER_ITEMS table
create table public.order_items (
  id              uuid primary key default uuid_generate_v4(),
  order_id        uuid references public.orders(id) on delete cascade,
  ticket_zone_id  uuid references public.ticket_zones(id),
  event_id        uuid references public.events(id),
  quantity        integer not null check (quantity > 0),
  unit_price      numeric(10, 2) not null,
  subtotal        numeric(10, 2) not null,
  created_at      timestamptz default now()
);

-- Indexes
create index idx_events_slug on public.events(slug);
create index idx_events_status on public.events(status);
create index idx_ticket_zones_event on public.ticket_zones(event_id);
create index idx_orders_user on public.orders(user_id);
create index idx_orders_stripe_session on public.orders(stripe_session_id);
create index idx_order_items_order on public.order_items(order_id);

-- Row Level Security
alter table public.events enable row level security;
alter table public.ticket_zones enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;

-- Events & ticket_zones: readable by everyone
create policy "Events are publicly readable"
  on public.events for select using (true);

create policy "Ticket zones are publicly readable"
  on public.ticket_zones for select using (true);

-- Orders: users can only read their own orders
create policy "Users can read own orders"
  on public.orders for select
  using (auth.uid() = user_id);

-- Order items: users can read items for their own orders
create policy "Users can read own order items"
  on public.order_items for select
  using (
    order_id in (
      select id from public.orders where user_id = auth.uid()
    )
  );

-- Function to decrement available tickets atomically
create or replace function public.decrement_availability(
  p_zone_id uuid,
  p_quantity integer
) returns void as $$
begin
  update public.ticket_zones
  set available = available - p_quantity
  where id = p_zone_id
    and available >= p_quantity;

  if not found then
    raise exception 'Not enough tickets available';
  end if;
end;
$$ language plpgsql security definer;
