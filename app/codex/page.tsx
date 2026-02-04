import Link from "next/link";
import { getCodexCategories, getCodexEntries } from "@/lib/codex/queries";
import { CodexSearchForm } from "./CodexSearchForm";

export const metadata = {
  title: "Codex | Alterun",
  description: "The Codex of Alterun — people, places, and lore.",
};

type Props = {
  searchParams: Promise<{ category?: string; q?: string }>;
};

export default async function CodexPage({ searchParams }: Props) {
  const params = await searchParams;
  const categorySlug = params.category ?? undefined;
  const search = params.q ?? undefined;

  const [categories, entries] = await Promise.all([
    getCodexCategories(),
    getCodexEntries({ categorySlug, search }),
  ]);

  return (
    <div className="codex-page max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
      <header className="mb-10">
        <h1 className="font-display text-3xl sm:text-4xl text-alterun-gold uppercase tracking-widest mb-2">
          The Codex
        </h1>
        <span className="block h-px w-20 bg-alterun-gold/40 mb-4" aria-hidden />
        <p className="font-display text-alterun-gold-muted/90 text-lg tracking-wide">
          Browse by realm or search the lore.
        </p>
      </header>

      <section className="ornament-border rounded-lg border-l-2 border-l-alterun-gold/30 bg-alterun-bg-card p-5 sm:p-6 mb-10">
        <h2 className="font-display text-sm text-alterun-gold uppercase tracking-widest mb-1">
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
          <h2 className="font-display text-sm text-alterun-gold uppercase tracking-widest mb-3">
            Realms
          </h2>
          <span className="block h-px w-12 bg-alterun-gold/30 mb-3" aria-hidden />
          <div className="flex flex-wrap gap-2">
            <Link
              href="/codex"
              className={`ornament-border rounded px-4 py-2 text-base font-display uppercase tracking-wider transition-all duration-200 ${
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
                className={`ornament-border rounded px-4 py-2 text-base font-display uppercase tracking-wider transition-all duration-200 ${
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
        <h2 className="font-display text-sm text-alterun-gold uppercase tracking-widest mb-3">
          Chronicles
        </h2>
        <span className="block h-px w-12 bg-alterun-gold/30 mb-4" aria-hidden />

        {entries.length === 0 ? (
          <p className="text-alterun-muted italic">
            {search || categorySlug
              ? "No chronicles match thy query."
              : "The codex is yet empty. Entries may be inscribed from the Admin."}
          </p>
        ) : (
          <ul className="space-y-4">
            {entries.map((entry) => (
              <li key={entry.id}>
                <Link
                  href={`/codex/${entry.slug}`}
                  className="codex-entry-card ornament-border block rounded-lg border-l-2 border-l-alterun-gold/25 p-4 sm:p-5 bg-alterun-bg-card transition-all duration-200 hover:border-alterun-gold/40 hover:border-l-alterun-gold/50 hover:shadow-[0_0_20px_-4px_rgba(201,162,39,0.08)] hover:-translate-y-0.5"
                >
                  <h3 className="font-display text-lg text-alterun-gold uppercase tracking-wider">
                    {entry.title}
                  </h3>
                  {entry.excerpt && (
                    <p className="text-alterun-muted text-base mt-1 line-clamp-2">
                      {entry.excerpt}
                    </p>
                  )}
                  {entry.category_id && (
                    <span className="inline-block mt-2 text-base text-alterun-gold-muted/80 font-display uppercase tracking-wider">
                      {categories.find((c) => c.id === entry.category_id)?.name}
                    </span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
