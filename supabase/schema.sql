-- Untuk proyek Supabase BARU. Inventaris bersama untuk satu apotek.
-- Tidak menghapus data atau mengganti kebijakan RLS database yang sudah ada.
begin;

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  color text not null default '#3B82F6',
  created_at timestamptz not null default now()
);

create table if not exists public.suppliers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  contact text not null,
  email text not null,
  address text,
  created_at timestamptz not null default now()
);

create table if not exists public.medicines (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text not null,
  supplier text not null,
  stock integer not null default 0 check (stock >= 0),
  price numeric not null default 0 check (price >= 0),
  expirydate date not null,
  created_at timestamptz not null default now()
);

alter table public.categories enable row level security;
alter table public.suppliers enable row level security;
alter table public.medicines enable row level security;

revoke all on public.categories, public.suppliers, public.medicines from anon;
grant select, insert, update, delete on public.categories, public.suppliers, public.medicines to authenticated;

-- Semua pengguna yang masuk adalah anggota apotek yang sama.
-- Batasi pendaftaran ke tim Anda pada pengaturan Supabase sebelum produksi.
create policy "Authenticated pharmacy inventory" on public.categories
  for all to authenticated using (true) with check (true);
create policy "Authenticated pharmacy inventory" on public.suppliers
  for all to authenticated using (true) with check (true);
create policy "Authenticated pharmacy inventory" on public.medicines
  for all to authenticated using (true) with check (true);

commit;
