-- Turjoman V1 — orders
--
-- One table. Every column is something the studio actually needs to start work,
-- and the checks encode the same rules the application enforces, so a row that
-- reaches the table is a row the team can act on.
--
-- Row Level Security is enabled and *no policy is granted*. That is deliberate:
-- the only writer is the server route handler, which uses the service role key
-- and bypasses RLS. The anon key can neither read nor write this table, so a
-- leaked public key exposes nothing.

create extension if not exists "pgcrypto";

do $$
begin
  if not exists (select 1 from pg_type where typname = 'order_status') then
    create type order_status as enum (
      'new',        -- just arrived, nobody has looked at it
      'reviewing',  -- the studio is on the call with the founder
      'in_progress',
      'delivered',
      'cancelled'
    );
  end if;
end$$;

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),

  -- what the founder typed
  project_name  text not null check (char_length(btrim(project_name)) between 2 and 120),
  customer_name text not null check (char_length(btrim(customer_name)) between 2 and 120),
  mobile        text not null check (mobile ~ '^\+9665[0-9]{8}$'),
  notes         text          check (notes is null or char_length(notes) <= 2000),

  -- what the founder chose, in the flow
  activity    text not null check (activity in ('store','restaurant','office','clinic','services','other')),
  personality text not null check (personality in ('luxury','modern','warm','bold','trusted','heritage','playful','innovative')),
  style       text not null check (style in ('minimal','luxury','modern','classic','bold','elegant')),
  package     text not null check (package in ('starter','professional','launch')),
  direction   text not null check (direction in ('core','warm','quiet')),

  -- how the studio works it
  status     order_status not null default 'new',
  created_at timestamptz  not null default now(),
  updated_at timestamptz  not null default now(),

  -- provenance, for support rather than analytics
  source     text default 'web',
  user_agent text
);

-- The two questions the team asks the table: what is new, and what arrived when.
create index if not exists orders_status_created_at_idx
  on public.orders (status, created_at desc);

create index if not exists orders_created_at_idx
  on public.orders (created_at desc);

-- updated_at should never be a thing anyone has to remember to set.
create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists orders_touch_updated_at on public.orders;
create trigger orders_touch_updated_at
  before update on public.orders
  for each row execute function public.touch_updated_at();

-- Locked by default. No policies: only the service role (server) can touch this.
alter table public.orders enable row level security;
alter table public.orders force row level security;

revoke all on public.orders from anon, authenticated;

comment on table public.orders is
  'Order requests from the Turjoman flow. Written only by the server route handler (service role). RLS is on with no policies, so the anon key cannot read or write.';
