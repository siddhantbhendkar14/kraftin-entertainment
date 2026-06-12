-- Kraftin Entertainment CMS — Phase 1 schema
create extension if not exists "pgcrypto";

create type blog_status as enum ('draft', 'published');
create type media_type as enum ('image', 'video');

create table public.blogs (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  excerpt text,
  content text not null default '',
  featured_image text,
  category text,
  tags text[] default '{}',
  seo_title text,
  seo_description text,
  status blog_status not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  published_at timestamptz
);

create index blogs_status_published_at_idx on public.blogs (status, published_at desc);
create index blogs_slug_idx on public.blogs (slug);
create index blogs_category_idx on public.blogs (category);

create table public.gallery_items (
  id uuid primary key default gen_random_uuid(),
  title text not null default '',
  category text,
  media_type media_type not null,
  media_url text not null,
  thumbnail_url text,
  cloudinary_id text,
  display_order integer not null default 0,
  is_visible boolean not null default true,
  created_at timestamptz not null default now()
);

create index gallery_visible_order_idx on public.gallery_items (is_visible, display_order asc);
create index gallery_category_idx on public.gallery_items (category);

create table public.admin_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text,
  created_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger blogs_updated_at
  before update on public.blogs
  for each row execute function public.set_updated_at();

alter table public.blogs enable row level security;
alter table public.gallery_items enable row level security;
alter table public.admin_profiles enable row level security;

create policy "Public read published blogs"
  on public.blogs for select
  using (status = 'published');

create policy "Public read visible gallery"
  on public.gallery_items for select
  using (is_visible = true);

create policy "Admins manage blogs"
  on public.blogs for all
  using (auth.uid() in (select id from public.admin_profiles))
  with check (auth.uid() in (select id from public.admin_profiles));

create policy "Admins manage gallery"
  on public.gallery_items for all
  using (auth.uid() in (select id from public.admin_profiles))
  with check (auth.uid() in (select id from public.admin_profiles));

create policy "Admins read own profile"
  on public.admin_profiles for select
  using (auth.uid() = id);
