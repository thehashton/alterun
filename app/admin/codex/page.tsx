import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getCodexCategories, getCodexEntries } from "@/lib/codex/queries";
import { IconNewEntry, IconCategories } from "@/components/icons";
import { ExportCodexButton } from "./ExportCodexButton";

export const metadata = {
  title: "Codex Admin | Alterun",
  description: "Manage Codex entries.",
};

type Props = {
  searchParams: Promise<{ category?: string }>;
};

export default async function AdminCodexPage({ searchParams }: Props) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const params = await searchParams;
  const categorySlug = params.category ?? undefined;

  const [categories, entriesResult] = await Promise.all([
    getCodexCategories(),
    getCodexEntries({ pageSize: 2000, categorySlug }),
  ]);
  const entries = entriesResult.entries;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-16 text-xl">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <h1 className="font-display text-3xl text-alterun-gold uppercase tracking-widest">
          Codex Admin
        </h1>
        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/admin/codex/entries/new"
            className="btn-hover flex items-center gap-2 rounded border border-alterun-gold/40 bg-alterun-gold/10 px-4 py-2 text-xl text-alterun-gold transition-[border-color,background-color,color] duration-200 hover:border-alterun-gold hover:bg-alterun-gold/25 hover:text-alterun-gold"
          >
            <IconNewEntry className="h-5 w-5 flex-shrink-0" />
            New entry
          </Link>
          <Link
            href="/admin/codex/categories"
            className="btn-hover flex items-center gap-2 rounded border border-alterun-border bg-alterun-bg-card px-4 py-2 text-xl text-alterun-muted transition-[border-color,background-color,color] duration-200 hover:border-alterun-gold/50 hover:bg-alterun-gold/10 hover:text-alterun-gold"
          >
            <IconCategories className="h-5 w-5 flex-shrink-0" />
            Categories
          </Link>
          <ExportCodexButton />
        </div>
      </div>

      <section className="mb-10">
        <h2 className="font-display text-xl text-alterun-gold uppercase tracking-wider mb-4">
          Categories ({categories.length})
        </h2>
        {categories.length === 0 ? (
          <p className="text-alterun-muted text-xl">
            No categories yet.{" "}
            <Link href="/admin/codex/categories" className="text-alterun-gold/80 hover:text-alterun-gold">
              Add one
            </Link>
          </p>
        ) : (
          <ul className="flex flex-wrap gap-2">
            <li>
              <Link
                href="/admin/codex"
                className={`ornament-border rounded px-3 py-2 transition-colors ${
                  !categorySlug
                    ? "bg-alterun-gold/15 text-alterun-gold border-alterun-gold/50"
                    : "bg-alterun-bg-card text-alterun-muted hover:border-alterun-gold/30 hover:text-alterun-gold"
                }`}
              >
                All
              </Link>
            </li>
            {categories.map((cat) => (
              <li key={cat.id}>
                <Link
                  href={`/admin/codex?category=${encodeURIComponent(cat.slug)}`}
                  className={`ornament-border rounded px-3 py-2 transition-colors ${
                    categorySlug === cat.slug
                      ? "bg-alterun-gold/15 text-alterun-gold border-alterun-gold/50"
                      : "bg-alterun-bg-card text-alterun-muted hover:border-alterun-gold/30 hover:text-alterun-gold"
                  }`}
                >
                  {cat.name}
                </Link>
              </li>
            ))}
          </ul>
        )}
        <p className="mt-2 text-alterun-muted/80 text-lg">
          Filter entries by category. To add or edit categories, use{" "}
          <Link href="/admin/codex/categories" className="text-alterun-gold/80 hover:text-alterun-gold underline">
            Categories
          </Link>
          .
        </p>
      </section>

      <section>
        <h2 className="font-display text-xl text-alterun-gold uppercase tracking-wider mb-4">
          Entries ({entries.length})
          {categorySlug && (
            <span className="ml-2 font-normal text-alterun-muted normal-case">
              (filtered by {categories.find((c) => c.slug === categorySlug)?.name ?? categorySlug})
            </span>
          )}
        </h2>
        {entries.length === 0 ? (
          <p className="text-alterun-muted text-xl">
            {categorySlug ? "No entries in this category." : "No entries yet. "}
            {!categorySlug && (
              <>
                <Link href="/admin/codex/entries/new" className="text-alterun-gold/80 hover:text-alterun-gold">
                  Create one
                </Link>
              </>
            )}
            {categorySlug && (
              <Link href="/admin/codex" className="text-alterun-gold/80 hover:text-alterun-gold ml-1">
                Show all
              </Link>
            )}
          </p>
        ) : (
          <ul className="space-y-2">
            {entries.map((entry) => (
              <li key={entry.id}>
                <div className="ornament-border flex flex-wrap items-center gap-4 rounded-lg p-4 bg-alterun-bg-card hover:border-alterun-gold/30 transition-colors">
                  {entry.featured_image_url && (
                    <div className="relative h-12 w-16 flex-shrink-0 rounded overflow-hidden bg-alterun-bg-elevated">
                      <img
                        src={entry.featured_image_url}
                        alt=""
                        className="h-full w-full object-cover object-top"
                      />
                    </div>
                  )}
                  <Link
                    href={`/admin/codex/entries/${entry.id}`}
                    className="min-w-0 flex-1 flex items-center gap-4 flex-wrap"
                  >
                    <span className="font-display text-alterun-gold">{entry.title}</span>
                    <span className="text-alterun-muted text-xl">
                      {categories.find((c) => c.id === entry.category_id)?.name ?? "—"}
                    </span>
                    <span className="text-alterun-muted text-xl">{entry.slug}</span>
                  </Link>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Link
                      href={`/codex/${encodeURIComponent(entry.slug)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded border border-alterun-border px-3 py-1.5 text-lg text-alterun-muted hover:border-alterun-gold/40 hover:text-alterun-gold transition-colors"
                    >
                      Preview
                    </Link>
                    <Link
                      href={`/admin/codex/entries/${entry.id}`}
                      className="rounded border border-alterun-gold/40 bg-alterun-gold/10 px-3 py-1.5 text-lg text-alterun-gold hover:bg-alterun-gold/20 hover:border-alterun-gold/50 transition-colors"
                    >
                      Edit
                    </Link>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
