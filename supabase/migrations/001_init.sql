-- FlippIt Webshop · Initiales Datenbankschema

-- Erweiterungen
create extension if not exists "uuid-ossp";

-- Karten-Tabelle
create table if not exists cards (
  id          uuid primary key default uuid_generate_v4(),
  name        text not null,
  element     text not null check (element in ('feuer','wasser','pflanze','blitz','psycho','finster','metall','drache')),
  hp          integer not null,
  set_name    text not null,
  set_number  text not null,
  rarity      text not null check (rarity in ('common','rare','holo')),
  year        integer not null,
  foil        boolean not null default false,
  condition   text not null check (condition in ('Mint','Near Mint','Excellent','Good','Played')),
  price       numeric(10,2) not null,
  for_sale    boolean not null default false,
  attack      text,
  dmg         text,
  collection  text,
  image_url   text,
  sold        boolean not null default false,
  sold_price  numeric(10,2),
  sold_date   date,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- Benutzerprofile (erweitert Supabase Auth)
create table if not exists profiles (
  id          uuid primary key references auth.users on delete cascade,
  display_name text,
  avatar_url  text,
  created_at  timestamptz not null default now()
);

-- Bestellungen
create table if not exists orders (
  id                      uuid primary key default uuid_generate_v4(),
  user_id                 uuid references profiles(id),
  status                  text not null default 'pending'
                            check (status in ('pending','paid','shipped','delivered','cancelled')),
  total                   numeric(10,2) not null,
  shipping_name           text not null,
  shipping_email          text not null,
  shipping_street         text not null,
  shipping_city           text not null,
  shipping_zip            text not null,
  shipping_country        text not null default 'CH',
  stripe_payment_intent   text,
  created_at              timestamptz not null default now(),
  updated_at              timestamptz not null default now()
);

-- Bestellpositionen
create table if not exists order_items (
  id          uuid primary key default uuid_generate_v4(),
  order_id    uuid not null references orders(id) on delete cascade,
  card_id     uuid not null references cards(id),
  card_name   text not null,
  price       numeric(10,2) not null,
  quantity    integer not null default 1
);

-- Row-Level-Security
alter table cards      enable row level security;
alter table profiles   enable row level security;
alter table orders     enable row level security;
alter table order_items enable row level security;

-- Karten: öffentlich lesbar, nur Admins schreiben
create policy "Karten öffentlich lesen" on cards for select using (true);
create policy "Admins können Karten bearbeiten" on cards for all
  using (auth.role() = 'authenticated');

-- Profile: eigenes Profil lesen/bearbeiten
create policy "Eigenes Profil lesen" on profiles for select
  using (auth.uid() = id);
create policy "Eigenes Profil bearbeiten" on profiles for update
  using (auth.uid() = id);

-- Bestellungen: eigene Bestellungen lesen
create policy "Eigene Bestellungen lesen" on orders for select
  using (auth.uid() = user_id);
create policy "Neue Bestellung anlegen" on orders for insert
  with check (auth.uid() = user_id or user_id is null);

-- Bestellpositionen: über Bestellung verknüpft
create policy "Eigene Bestellpositionen lesen" on order_items for select
  using (
    exists (
      select 1 from orders o
      where o.id = order_items.order_id and o.user_id = auth.uid()
    )
  );

-- Trigger: updated_at automatisch setzen
create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger cards_updated_at   before update on cards   for each row execute function set_updated_at();
create trigger orders_updated_at  before update on orders  for each row execute function set_updated_at();

-- Profil automatisch bei Registrierung erstellen
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
