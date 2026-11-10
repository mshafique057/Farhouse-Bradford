-- =====================================================================
-- Farm House Bradford - Supabase database setup
-- STEP 1: Neeche 'YOUR_ADMIN_EMAIL' ko apni admin email se replace karein
--         (wohi email jo Supabase > Authentication > Users mein banayenge)
-- STEP 2: Supabase > SQL Editor > New query > poora file paste > Run
-- =====================================================================

-- ---------- Admin check ----------
create or replace function public.is_admin()
returns boolean
language sql stable
as $$
  select coalesce(lower(auth.jwt() ->> 'email') = lower('YOUR_ADMIN_EMAIL'), false);
$$;

-- ---------- Tables ----------
create table if not exists public.site_settings (
  id int primary key default 1 check (id = 1),
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);
-- Khali data = site default mein "Under construction" rehti hai
insert into public.site_settings (id, data) values (1, '{}'::jsonb) on conflict (id) do nothing;

create table if not exists public.menu_categories (
  id bigint generated always as identity primary key,
  name text not null,
  sort int not null default 0
);

create table if not exists public.menu_items (
  id bigint generated always as identity primary key,
  category_id bigint references public.menu_categories(id) on delete set null,
  name text not null,
  description text,
  price text,
  image_url text,
  available boolean not null default true,
  sort int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.gallery (
  id bigint generated always as identity primary key,
  image_url text not null,
  caption text,
  created_at timestamptz not null default now()
);

create table if not exists public.posts (
  id bigint generated always as identity primary key,
  title text not null,
  slug text not null unique,
  excerpt text,
  content text,
  cover_url text,
  published boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.bookings (
  id bigint generated always as identity primary key,
  name text not null check (char_length(name) <= 120),
  phone text not null check (char_length(phone) <= 40),
  email text check (char_length(email) <= 160),
  booking_date date not null,
  booking_time text not null check (char_length(booking_time) <= 20),
  guests int not null default 2 check (guests between 1 and 200),
  notes text check (char_length(notes) <= 1000),
  status text not null default 'new',
  created_at timestamptz not null default now()
);

create table if not exists public.messages (
  id bigint generated always as identity primary key,
  type text not null default 'contact' check (type in ('contact', 'franchise')),
  name text not null check (char_length(name) <= 120),
  phone text check (char_length(phone) <= 40),
  email text check (char_length(email) <= 160),
  subject text check (char_length(subject) <= 200),
  message text check (char_length(message) <= 3000),
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);

-- ---------- Permissions ----------
grant usage on schema public to anon, authenticated;
grant select on all tables in schema public to anon, authenticated;
grant insert, update, delete on all tables in schema public to authenticated;
grant insert on public.bookings, public.messages to anon;
grant usage, select on all sequences in schema public to anon, authenticated;

-- ---------- Row Level Security ----------
alter table public.site_settings   enable row level security;
alter table public.menu_categories enable row level security;
alter table public.menu_items      enable row level security;
alter table public.gallery         enable row level security;
alter table public.posts           enable row level security;
alter table public.bookings        enable row level security;
alter table public.messages        enable row level security;

-- Public read, admin write
create policy "public read" on public.site_settings   for select using (true);
create policy "public read" on public.menu_categories for select using (true);
create policy "public read" on public.menu_items      for select using (true);
create policy "public read" on public.gallery         for select using (true);
create policy "public read posts" on public.posts     for select using (published or public.is_admin());

create policy "admin write" on public.site_settings   for all using (public.is_admin()) with check (public.is_admin());
create policy "admin write" on public.menu_categories for all using (public.is_admin()) with check (public.is_admin());
create policy "admin write" on public.menu_items      for all using (public.is_admin()) with check (public.is_admin());
create policy "admin write" on public.gallery         for all using (public.is_admin()) with check (public.is_admin());
create policy "admin write" on public.posts           for all using (public.is_admin()) with check (public.is_admin());

-- Visitors sirf bhej sakte hain (booking / message), parh nahi sakte
create policy "visitors can send" on public.bookings for insert to anon, authenticated with check (true);
create policy "visitors can send" on public.messages for insert to anon, authenticated with check (true);
create policy "admin manage"      on public.bookings for all using (public.is_admin()) with check (public.is_admin());
create policy "admin manage"      on public.messages for all using (public.is_admin()) with check (public.is_admin());

-- ---------- Image storage ----------
insert into storage.buckets (id, name, public) values ('media', 'media', true)
on conflict (id) do nothing;

create policy "media public read"  on storage.objects for select using (bucket_id = 'media');
create policy "media admin insert" on storage.objects for insert with check (bucket_id = 'media' and public.is_admin());
create policy "media admin update" on storage.objects for update using (bucket_id = 'media' and public.is_admin());
create policy "media admin delete" on storage.objects for delete using (bucket_id = 'media' and public.is_admin());
