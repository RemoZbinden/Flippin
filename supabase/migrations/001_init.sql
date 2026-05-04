-- Flippin Webshop · Datenbankschema

create extension if not exists "uuid-ossp";

-- ─── Karten ───
create table if not exists cards (
  id             uuid primary key default uuid_generate_v4(),
  name           text not null,
  category       text not null default 'Pokémon',
  set_name       text not null default '',
  set_number     text not null default '',
  rarity         text not null default 'rare',
  condition      text not null default 'Near Mint',
  language       text not null default 'Deutsch',
  year           integer not null default 2024,
  price          numeric(10,2) not null,
  for_sale       boolean not null default true,
  foil           boolean not null default false,
  description    text,
  image_url      text,
  back_image_url text,
  -- Legacy-Felder (Dashboard-Kompatibilität)
  element        text not null default 'feuer',
  hp             integer not null default 100,
  attack         text default '',
  dmg            text default '',
  collection     text default '',
  sold           boolean not null default false,
  sold_price     numeric(10,2),
  sold_date      date,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

-- ─── Profile ───
create table if not exists profiles (
  id           uuid primary key references auth.users on delete cascade,
  display_name text,
  avatar_url   text,
  created_at   timestamptz not null default now()
);

-- ─── Bestellungen ───
create table if not exists orders (
  id                    uuid primary key default uuid_generate_v4(),
  user_id               uuid references profiles(id),
  status                text not null default 'pending',
  total                 numeric(10,2) not null,
  shipping_name         text not null,
  shipping_email        text not null,
  shipping_street       text not null,
  shipping_city         text not null,
  shipping_zip          text not null,
  shipping_country      text not null default 'CH',
  stripe_payment_intent text,
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now()
);

-- ─── Bestellpositionen ───
create table if not exists order_items (
  id        uuid primary key default uuid_generate_v4(),
  order_id  uuid not null references orders(id) on delete cascade,
  card_id   uuid references cards(id),
  card_name text not null,
  price     numeric(10,2) not null,
  quantity  integer not null default 1
);

-- ─── Row Level Security ───
alter table cards       enable row level security;
alter table profiles    enable row level security;
alter table orders      enable row level security;
alter table order_items enable row level security;

-- Karten: jeder kann lesen
create policy "Karten lesen" on cards for select using (true);
-- Karten: eingeloggte User können schreiben (Admin)
create policy "Karten einfügen" on cards for insert with check (auth.role() = 'authenticated');
create policy "Karten bearbeiten" on cards for update using (auth.role() = 'authenticated');
create policy "Karten löschen" on cards for delete using (auth.role() = 'authenticated');

-- Profile
create policy "Eigenes Profil lesen" on profiles for select using (auth.uid() = id);
create policy "Eigenes Profil bearbeiten" on profiles for update using (auth.uid() = id);
create policy "Profil erstellen" on profiles for insert with check (auth.uid() = id);

-- Bestellungen
create policy "Eigene Bestellungen lesen" on orders for select using (auth.uid() = user_id);
create policy "Bestellung anlegen" on orders for insert with check (true);

-- Bestellpositionen
create policy "Eigene Positionen lesen" on order_items for select
  using (exists (select 1 from orders o where o.id = order_items.order_id and o.user_id = auth.uid()));
create policy "Position anlegen" on order_items for insert with check (true);

-- ─── Auto updated_at ───
create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end;
$$;

create trigger cards_updated_at  before update on cards  for each row execute function set_updated_at();
create trigger orders_updated_at before update on orders for each row execute function set_updated_at();

-- ─── Auto-Profil bei Registrierung ───
create or replace function handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into profiles (id, display_name)
  values (new.id, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- ─── Storage: Karten-Bilder ───
insert into storage.buckets (id, name, public)
values ('cards', 'cards', true)
on conflict (id) do nothing;

create policy "Bilder öffentlich lesen" on storage.objects
  for select using (bucket_id = 'cards');

create policy "Bilder hochladen" on storage.objects
  for insert with check (bucket_id = 'cards' and auth.role() = 'authenticated');

create policy "Bilder löschen" on storage.objects
  for delete using (bucket_id = 'cards' and auth.role() = 'authenticated');
