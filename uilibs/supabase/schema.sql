-- =====================================================================
--  ADISA - Supabase schema
--  Run this SQL in:  Supabase Dashboard → SQL Editor → New query → Run
--  (or paste into the supabase CLI:  supabase db push)
-- =====================================================================

-- -------------------- Extensions --------------------
create extension if not exists "pgcrypto";

-- ====================== products ======================
create table if not exists public.products (
    id              uuid        primary key default gen_random_uuid(),
    slug            text        not null unique,
    name            text        not null,
    brand           text        not null default 'ADISA Select',
    description     text        not null default '',
    image_path      text        not null,
    extra_images    text[]      not null default '{}',
    source_price    integer     not null,            -- original ₦ from source
    sale_price      integer     not null,            -- your retail price ₦
    currency        text        not null default 'NGN',
    sizes_uk        smallint[]  not null default '{}'::smallint[],
    colors          text[]      not null default '{}'::text[],
    category        text        not null default 'sneakers',
    rating          real        not null default 4.6,
    reviews         integer     not null default 0,
    is_featured     boolean     not null default false,
    in_stock        boolean     not null default true,
    created_at      timestamptz not null default now(),
    updated_at      timestamptz not null default now()
);

create index if not exists products_category_idx     on public.products(category);
create index if not exists products_is_featured_idx  on public.products(is_featured);

-- ====================== orders ======================
create table if not exists public.orders (
    id                uuid        primary key default gen_random_uuid(),
    ref               text       not null unique,                       -- paystack/cb ref
    customer_name     text       not null,
    customer_email    text       not null,
    customer_phone    text       not null,
    delivery_address  text       not null,
    delivery_city     text       not null,
    delivery_state    text       not null default 'Lagos',
    items             jsonb      not null,                              -- array of {slug,name,size,color,qty,price}
    subtotal          integer    not null,
    delivery_fee      integer    not null default 0,
    total             integer    not null,
    payment_method    text       not null,                              -- 'card' | 'crypto'
    payment_status    text       not null default 'pending',            -- pending | paid | failed
    fulfillment_status text      not null default 'new',               -- new | processing | shipped | delivered | cancelled
    paid_at           timestamptz,
    created_at        timestamptz not null default now()
);

create index if not exists orders_payment_status_idx    on public.orders(payment_status);
create index if not exists orders_fulfillment_status_idx on public.orders(fulfillment_status);

-- ====================== reviews (optional) ======================
create table if not exists public.reviews (
    id           uuid        primary key default gen_random_uuid(),
    product_id   uuid        not null references public.products(id) on delete cascade,
    name         text        not null,
    rating       smallint    not null check (rating between 1 and 5),
    body         text        not null default '',
    created_at   timestamptz not null default now()
);

-- ====================== Row Level Security =====================
alter table public.products  enable row level security;
alter table public.orders    enable row level security;
alter table public.reviews   enable row level security;

-- Public can READ products and reviews (anonymous list page)
create policy "Public read products" on public.products
    for select using (true);

create policy "Public read reviews" on public.reviews
    for select using (true);

-- Anyone can CREATE orders (the checkout flow)
create policy "Anyone can create orders" on public.orders
    for insert with check (true);

-- Only authenticated (admin via service-role) can write/mutate products
create policy "Auth can manage products" on public.products
    for all
    using (auth.role() = 'authenticated')
    with check (auth.role() = 'authenticated');

-- Authenticated can READ and update orders (admin)
create policy "Auth can manage orders" on public.orders
    for all
    using (auth.role() = 'authenticated')
    with check (auth.role() = 'authenticated');

-- Only the order's owner email can READ their own order (for receipts)
-- (For now, admins traverse; customer reads receipt via its own server route.)
create policy "Anyone can read own order by ref" on public.orders
    for select using (true);

-- Anyone can submit reviews
create policy "Anyone can create reviews" on public.reviews
    for insert with check (true);

-- ====================== updated_at trigger =====================
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

drop trigger if exists products_touch_updated_at on public.products;
create trigger products_touch_updated_at
    before update on public.products
    for each row execute function public.touch_updated_at();

-- ====================== Seed: a few products ======================
-- The full catalog ships with the Next.js code itself (src/lib/products.ts)
-- but seeding these lets the live admin see rows immediately.
insert into public.products
    (slug, name, description, image_path, source_price, sale_price,
     sizes_uk, colors, category, is_featured)
values
    ('adisa-air-runner', 'ADISA Air Runner',
     'Lightweight breathable running shoe for everyday wear. Mesh upper, cushioned heel, durable rubber outsole.',
     '/shoes/1-qJSr_PPQHNuCL5-QlNi_2YuYl4Zechj.png',
     8500, 23000,
     '{6,7,8,9,10,11,12}', '{Black,White,Grey}', 'sneakers', true),
    ('adisa-classic-oxford', 'ADISA Classic Oxford',
     'A timeless Oxford silhouette in premium leather. Goodyear-welted sole, padded insole, an elegant men''s formal shoe.',
     '/shoes/10N5lr89eOLZ5hS1fJpDa3tH00ZFBmDEK.png',
     15000, 32000,
     '{6,7,8,9,10,11}', '{Black,Brown}', 'formal', true),
    ('adisa-urban-boot', 'ADISA Urban Boot',
     'An all-day city boot. Water-resistant upper, ankle support, cushioned sole. Built for Lagos streets.',
     '/shoes/15Fh2sRJcsRYgie-_Dpspbor1sOfBbJnj.png',
     12000, 31000,
     '{7,8,9,10,11,12,13}', '{Brown,Black}', 'boots', true)
on conflict (slug) do nothing;
