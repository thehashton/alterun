import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import { getCodexCategories, getCodexEntries } from "@/lib/codex/queries";
import { IconPlus, IconEye, IconPencil, IconPin } from "@/components/icons";
import { CodexSearchForm } from "./CodexSearchForm";

export const metadata = {
  title: "Codex | Alterun",
  description: "The Codex of Alterun — people, places, and lore.",
};

const PAGE_SIZE = 12;

type Props = {
  searchParams: Promise<{ category?: string; q?: string; page?: string }>;
};

export default async function CodexPage({ searchParams }: Props) {
  const params = await searchParams;
  const categorySlug = params.category ?? undefined;
  const search = params.q ?? undefined;
  const page = Math.max(1, parseInt(params.page ?? "1", 10) || 1);

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [categories, entriesResult] = await Promise.all([
    getCodexCategories(),
    getCodexEntries({ categorySlug, search, page, pageSize: PAGE_SIZE }),
  ]);
  const { entries, total, totalPages } = entriesResult;

  return (
    <div className="codex-page max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
      <header className="mb-10 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl sm:text-4xl text-alterun-gold uppercase tracking-widest mb-2">
            The Codex
          </h1>
          <span className="block h-px w-20 bg-alterun-gold/40 mb-4" aria-hidden />
          <p className="font-display text-alterun-gold-muted/90 text-lg tracking-wide">
            Browse by realm or search the lore.
          </p>
        </div>
        {user && (
          <Link
            href="/admin/codex/entries/new"
            className="btn-hover flex shrink-0 items-center gap-2 rounded border border-alterun-gold/40 bg-alterun-gold/10 px-4 py-2 text-xl font-display uppercase tracking-wider text-alterun-gold transition-[border-color,background-color,color] duration-200 hover:border-alterun-gold hover:bg-alterun-gold/25"
          >
            <IconPlus className="h-5 w-5 flex-shrink-0" />
            Add entry
          </Link>
        )}
      </header>

      <section className="ornament-border rounded-lg border-l-2 border-l-alterun-gold/30 bg-alterun-bg-card p-5 sm:p-6 mb-10">
        <h2 className="font-display text-xl text-alterun-gold uppercase tracking-widest mb-1">
          Consult the index
        </h2>
        <span className="block h-px w-12 bg-alterun-gold/30 mb-4" aria-hidden />
        <CodexSearchForm
          categories={categories}
          initialCategory={categorySlug}
          initialSearch={search}
          className="mb-0"
        />
      </section>

      {categories.length > 0 && (
        <nav className="mb-10" aria-label="Codex categories">
          <h2 className="font-display text-xl text-alterun-gold uppercase tracking-widest mb-3">
            Realms
          </h2>
          <span className="block h-px w-12 bg-alterun-gold/30 mb-3" aria-hidden />
          <div className="flex flex-wrap gap-2">
            <Link
              href="/codex"
              className={`ornament-border rounded px-4 py-2 text-xl font-display uppercase tracking-wider transition-all duration-200 ${
                !categorySlug
                  ? "bg-alterun-gold/15 text-alterun-gold border-alterun-gold/50 shadow-[0_0_12px_rgba(201,162,39,0.12)]"
                  : "bg-alterun-bg-card text-alterun-muted hover:border-alterun-gold/30 hover:text-alterun-gold/90"
              }`}
            >
              All
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/codex?category=${encodeURIComponent(cat.slug)}`}
                className={`ornament-border rounded px-4 py-2 text-xl font-display uppercase tracking-wider transition-all duration-200 ${
                  categorySlug === cat.slug
                    ? "bg-alterun-gold/15 text-alterun-gold border-alterun-gold/50 shadow-[0_0_12px_rgba(201,162,39,0.12)]"
                    : "bg-alterun-bg-card text-alterun-muted hover:border-alterun-gold/30 hover:text-alterun-gold/90"
                }`}
              >
                {cat.name}
              </Link>
            ))}
          </div>
        </nav>
      )}

      <section>
        <div className="mb-3">
          <h2 className="font-display text-xl text-alterun-gold uppercase tracking-widest">
            Chronicles
          </h2>
        </div>
        <span className="block h-px w-12 bg-alterun-gold/30 mb-4" aria-hidden />

        {entries.length === 0 ? (
          <p className="text-alterun-muted italic">
            {search || categorySlug
              ? "No chronicles match thy query."
              : "The codex is yet empty. Entries may be inscribed from the Admin."}
          </p>
        ) : (
          <>
            <ul className="space-y-4">
              {entries.map((entry) => (
                <li key={entry.id}>
                  <div className="codex-entry-card ornament-border flex flex-wrap items-stretch gap-4 rounded-lg border-l-2 border-l-alterun-gold/25 p-4 sm:p-5 bg-alterun-bg-card transition-all duration-200 hover:border-alterun-gold/40 hover:border-l-alterun-gold/50 hover:shadow-[0_0_20px_-4px_rgba(201,162,39,0.08)] hover:-translate-y-0.5">
                    <Link
                      href={`/codex/${encodeURIComponent(entry.slug)}`}
                      className="min-w-0 flex-1 flex gap-4 items-start"
                    >
                      {entry.featured_image_url && (
                        <div className="relative h-20 w-28 flex-shrink-0 rounded overflow-hidden bg-alterun-bg-elevated">
                          <Image
                            src={entry.featured_image_url}
                            alt=""
                            fill
                            className="object-cover object-top"
                            sizes="112px"
                            unoptimized
                          />
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <h3 className="font-display text-lg text-alterun-gold uppercase tracking-wider">
                          {entry.title}
                        </h3>
                        {entry.excerpt && (
                          <p className="text-alterun-muted text-xl mt-1 line-clamp-2">
                            {entry.excerpt}
                          </p>
                        )}
                        {entry.category_id && (
                          <span className="inline-block mt-2 text-xl text-alterun-gold-muted/80 font-display uppercase tracking-wider">
                            {categories.find((c) => c.id === entry.category_id)?.name}
                          </span>
                        )}
                      </div>
                    </Link>
                    <div className="flex items-center gap-2 flex-shrink-0 self-center">
                      {entry.pinned && (
                        <span
                          className="rounded p-2 text-alterun-gold/70"
                          title="Pinned to top"
                          aria-label="Pinned to top"
                        >
                          <IconPin className="h-5 w-5" />
                        </span>
                      )}
                      <Link
                        href={`/codex/${encodeURIComponent(entry.slug)}`}
                        className="rounded p-2 text-alterun-muted hover:bg-alterun-gold/15 hover:text-alterun-gold transition-colors"
                        title="View entry"
                        aria-label="View entry"
                      >
                        <IconEye className="h-5 w-5" />
                      </Link>
                      {user && (
                        <Link
                          href={`/admin/codex/entries/${entry.id}`}
                          className="rounded p-2 text-alterun-muted hover:bg-alterun-gold/15 hover:text-alterun-gold transition-colors"
                          title="Edit entry"
                          aria-label="Edit entry"
                        >
                          <IconPencil className="h-5 w-5" />
                        </Link>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            {entries.length > 0 && (
              <nav
                className="mt-8 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-lg text-alterun-muted"
                aria-label="Codex pagination"
              >
                {page > 1 ? (
                  <Link
                    href={buildCodexPageUrl(page - 1, categorySlug, search)}
                    className="hover:text-alterun-gold transition-colors"
                  >
                    ← Previous
                  </Link>
                ) : (
                  <span className="text-alterun-muted/50" aria-hidden>← Previous</span>
                )}
                <span className="text-alterun-gold-muted/90" aria-live="polite">
                  Page {page} of {totalPages}
                  {total != null && <span className="text-alterun-muted/70"> ({total} chronicles)</span>}
                </span>
                {page < totalPages ? (
                  <Link
                    href={buildCodexPageUrl(page + 1, categorySlug, search)}
                    className="hover:text-alterun-gold transition-colors"
                  >
                    Next →
                  </Link>
                ) : (
                  <span className="text-alterun-muted/50" aria-hidden>Next →</span>
                )}
              </nav>
            )}
          </>
        )}
      </section>
    </div>
  );
}

function buildCodexPageUrl(
  page: number,
  categorySlug?: string,
  search?: string
): string {
  const params = new URLSearchParams();
  if (page > 1) params.set("page", String(page));
  if (categorySlug) params.set("category", categorySlug);
  if (search) params.set("q", search);
  const q = params.toString();
  return q ? `/codex?${q}` : "/codex";
}
