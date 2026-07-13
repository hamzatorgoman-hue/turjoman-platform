-- Turjoman V1 — human-readable order reference
--
-- The primary key is a uuid, which is correct for a database and useless in a
-- WhatsApp message: nobody reads one out loud, and nobody re-types one. So each
-- order also carries a short reference the studio and the founder can actually
-- say to each other — TRJ-1A2B3C4D.
--
-- It is generated in the database, not the application: the reference must exist
-- for every row, including any written by hand in the SQL editor.

create or replace function public.generate_order_reference()
returns text
language sql
volatile
as $$
  select 'TRJ-' || upper(encode(gen_random_bytes(4), 'hex'));
$$;

alter table public.orders
  add column if not exists reference text;

-- Backfill anything that predates this migration.
update public.orders
   set reference = public.generate_order_reference()
 where reference is null;

alter table public.orders
  alter column reference set default public.generate_order_reference();

alter table public.orders
  alter column reference set not null;

create unique index if not exists orders_reference_key
  on public.orders (reference);

comment on column public.orders.reference is
  'Short, speakable order reference (TRJ-XXXXXXXX). Generated in the database so every row has one.';
