<p align="center">
  <img src="images/alterun-logo-detailed-no-bg.png" alt="Alterun" width="480" />
</p>

# Alterun

The world of Alterun — a Next.js site with a blog (Martin/Sanderson style) and a **Codex** (wiki-style lore) with a dark fantasy theme. Admin dashboard with Supabase email auth.

## Stack

- **Next.js 14** (App Router), TypeScript, Tailwind CSS
- **Supabase** — Auth (email/password), Database, Storage (for images)
- Dark fantasy theme (gold/charcoal, ornate borders)

## Setup

1. **Install dependencies**
   ```bash
   pnpm install
   ```

2. **Supabase**
   - Create a project at [supabase.com](https://supabase.com).
   - In **Authentication > Providers**, enable **Email** (and optionally "Confirm email" off for local dev).
   - Create a user (Authentication > Users > Add user) or sign up via your app.
   - In **Project Settings > API**, copy the project URL and anon key.
   - Copy `.env.example` to `.env.local` and set:
     - `NEXT_PUBLIC_SUPABASE_URL`
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - In the **SQL Editor**, run the contents of `supabase/schema.sql` to create tables and RLS.

3. **Storage (for blog & codex images)**
   - In Supabase **Storage**, create a bucket named `images` and set it to **Public** if you want public image URLs.
   - Add policies so authenticated users can upload and the public can read (or follow Supabase storage docs).

4. **Run the app**
   ```bash
   pnpm dev
   ```
   Open [http://localhost:3000](http://localhost:3000). Go to **Admin** → **Login** to sign in.

## Routes

- `/` — Home
- `/blog` — Blog index (posts coming from Supabase)
- `/codex` — Codex index (entries, categories, search)
- `/admin` — Dashboard (requires login)
- `/admin/login` — Email login
- `/admin/blog` — Blog admin (create/edit posts)
- `/admin/codex` — Codex admin (entries, categories, images, links)

## Next steps

- Wire blog list and post pages to `blog_posts` and add admin forms.
- Wire codex list and entry pages to `codex_entries` / `codex_categories`, add linking and images.
- Add search (Supabase full-text or external) for blog and codex.
- Add more ornate styling and embellishments to match the fantasy theme.
