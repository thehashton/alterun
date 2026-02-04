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

export default async function AdminCodexPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const [categories, entries] = await Promise.all([
    getCodexCategories(),
    getCodexEntries(),
  ]);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <h1 className="font-display text-3xl text-alterun-gold uppercase tracking-widest">
          Codex Admin
        </h1>
        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/admin/codex/entries/new"
            className="btn-hover flex items-center gap-2 rounded border border-alterun-gold/40 bg-alterun-gold/10 px-4 py-2 text-base text-alterun-gold transition-[border-color,background-color,color] duration-200 hover:border-alterun-gold hover:bg-alterun-gold/25 hover:text-alterun-gold"
          >
            <IconNewEntry className="h-5 w-5 flex-shrink-0" />
            New entry
          </Link>
          <Link
            href="/admin/codex/categories"
            className="btn-hover flex items-center gap-2 rounded border border-alterun-border bg-alterun-bg-card px-4 py-2 text-base text-alterun-muted transition-[border-color,background-color,color] duration-200 hover:border-alterun-gold/50 hover:bg-alterun-gold/10 hover:text-alterun-gold"
          >
            <IconCategories className="h-5 w-5 flex-shrink-0" />
            Categories
          </Link>
          <ExportCodexButton />
        </div>
      </div>

      <section className="mb-10">
        <h2 className="font-display text-lg text-alterun-gold uppercase tracking-wider mb-4">
          Categories ({categories.length})
        </h2>
        {categories.length === 0 ? (
          <p className="text-alterun-muted text-sm">
            No categories yet.{" "}
            <Link href="/admin/codex/categories" className="text-alterun-gold/80 hover:text-alterun-gold">
              Add one
            </Link>
          </p>
        ) : (
          <ul className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <li key={cat.id}>
                <Link
                  href={`/admin/codex/categories/${cat.id}`}
                  className="ornament-border rounded px-3 py-2 bg-alterun-bg-card text-alterun-muted hover:border-alterun-gold/30 transition-colors"
                >
                  {cat.name}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2 className="font-display text-lg text-alterun-gold uppercase tracking-wider mb-4">
          Entries ({entries.length})
        </h2>
        {entries.length === 0 ? (
          <p className="text-alterun-muted text-sm">
            No entries yet.{" "}
            <Link href="/admin/codex/entries/new" className="text-alterun-gold/80 hover:text-alterun-gold">
              Create one
            </Link>
          </p>
        ) : (
          <ul className="space-y-2">
            {entries.map((entry) => (
              <li key={entry.id}>
                <Link
                  href={`/admin/codex/entries/${entry.id}`}
                  className="ornament-border flex items-center gap-4 rounded-lg p-4 bg-alterun-bg-card hover:border-alterun-gold/30 transition-colors"
                >
                  {entry.featured_image_url && (
                    <div className="relative h-12 w-16 flex-shrink-0 rounded overflow-hidden bg-alterun-bg-elevated">
                      <img
                        src={entry.featured_image_url}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    </div>
                  )}
                  <span className="font-display text-alterun-gold">{entry.title}</span>
                  <span className="text-alterun-muted text-sm">
                    {categories.find((c) => c.id === entry.category_id)?.name ?? "—"}
                  </span>
                  <span className="text-alterun-muted text-sm ml-auto">{entry.slug}</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
