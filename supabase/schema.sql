-- Alterun Supabase schema
-- Run this in the Supabase SQL Editor after creating your project.

-- Enable UUID extension if not already
create extension if not exists "uuid-ossp";

-- Blog posts
create table if not exists public.blog_posts (
  id uuid primary key default uuid_generate_v4(),
  slug text unique not null,
  title text not null,
  excerpt text,
  body text not null,
  published boolean default false,
  published_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  author_id uuid references auth.users(id) on delete set null
);

-- Codex categories (e.g. People, Places, Factions, Items)
create table if not exists public.codex_categories (
  id uuid primary key default uuid_generate_v4(),
  slug text unique not null,
  name text not null,
  description text,
  sort_order int default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Codex entries
create table if not exists public.codex_entries (
  id uuid primary key default uuid_generate_v4(),
  slug text unique not null,
  title text not null,
  excerpt text,
  body text not null,
  category_id uuid references public.codex_categories(id) on delete set null,
  featured_image_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  author_id uuid references auth.users(id) on delete set null
);

-- Codex entry links (entry A links to entry B)
create table if not exists public.codex_links (
  id uuid primary key default uuid_generate_v4(),
  source_entry_id uuid not null references public.codex_entries(id) on delete cascade,
  target_entry_id uuid not null references public.codex_entries(id) on delete cascade,
  created_at timestamptz default now(),
  unique(source_entry_id, target_entry_id)
);

-- Optional: codex entry images (multiple images per entry)
create table if not exists public.codex_entry_images (
  id uuid primary key default uuid_generate_v4(),
  entry_id uuid not null references public.codex_entries(id) on delete cascade,
  url text not null,
  caption text,
  sort_order int default 0,
  created_at timestamptz default now()
);

-- Indexes for search and listing
create index if not exists blog_posts_slug_idx on public.blog_posts(slug);
create index if not exists blog_posts_published_at_idx on public.blog_posts(published_at desc) where published = true;
create index if not exists codex_entries_slug_idx on public.codex_entries(slug);
create index if not exists codex_entries_category_idx on public.codex_entries(category_id);
create index if not exists codex_links_source_idx on public.codex_links(source_entry_id);
create index if not exists codex_links_target_idx on public.codex_links(target_entry_id);

-- Row Level Security (RLS): allow public read on blog_posts (published only) and codex_entries; allow authenticated write
alter table public.blog_posts enable row level security;
alter table public.codex_categories enable row level security;
alter table public.codex_entries enable row level security;
alter table public.codex_links enable row level security;
alter table public.codex_entry_images enable row level security;

-- Public can read published blog posts
create policy "Public read published blog posts"
  on public.blog_posts for select
  using (published = true);

-- Public can read all codex data
create policy "Public read codex categories"
  on public.codex_categories for select using (true);
create policy "Public read codex entries"
  on public.codex_entries for select using (true);
create policy "Public read codex links"
  on public.codex_links for select using (true);
create policy "Public read codex entry images"
  on public.codex_entry_images for select using (true);

-- Authenticated users (admins) can do everything on blog and codex
-- Restrict to specific admin emails in production by changing the using expression
create policy "Authenticated full access blog_posts"
  on public.blog_posts for all
  using (auth.role() = 'authenticated');
create policy "Authenticated full access codex_categories"
  on public.codex_categories for all
  using (auth.role() = 'authenticated');
create policy "Authenticated full access codex_entries"
  on public.codex_entries for all
  using (auth.role() = 'authenticated');
create policy "Authenticated full access codex_links"
  on public.codex_links for all
  using (auth.role() = 'authenticated');
create policy "Authenticated full access codex_entry_images"
  on public.codex_entry_images for all
  using (auth.role() = 'authenticated');

-- Allow authenticated to read their own draft posts (for admin UI)
create policy "Authenticated read all blog_posts"
  on public.blog_posts for select
  using (auth.role() = 'authenticated');

-- Storage bucket for blog and codex images (create in Supabase Dashboard > Storage, or run):
-- insert into storage.buckets (id, name, public) values ('images', 'images', true);
-- Then add RLS policies for storage.objects as needed.
