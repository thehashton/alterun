import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getCodexCategories } from "@/lib/codex/queries";
import { CategoryForm } from "./CategoryForm";

export const metadata = {
  title: "Codex Categories | Alterun",
  description: "Manage Codex categories.",
};

export default async function AdminCodexCategoriesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const categories = await getCodexCategories();

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
      <nav className="mb-6">
        <Link
          href="/admin/codex"
          className="text-alterun-gold/80 hover:text-alterun-gold text-sm uppercase tracking-wider"
        >
          ← Codex Admin
        </Link>
      </nav>
      <h1 className="font-display text-3xl text-alterun-gold uppercase tracking-widest mb-8">
        Categories
      </h1>

      <section className="mb-10">
        <h2 className="font-display text-lg text-alterun-gold uppercase tracking-wider mb-4">
          New category
        </h2>
        <CategoryForm />
      </section>

      <section>
        <h2 className="font-display text-lg text-alterun-gold uppercase tracking-wider mb-4">
          Existing ({categories.length})
        </h2>
        {categories.length === 0 ? (
          <p className="text-alterun-muted text-sm">No categories yet.</p>
        ) : (
          <ul className="space-y-3">
            {categories.map((cat) => (
              <li key={cat.id}>
                <Link
                  href={`/admin/codex/categories/${cat.id}`}
                  className="ornament-border block rounded-lg p-4 bg-alterun-bg-card hover:border-alterun-gold/30 transition-colors"
                >
                  <span className="font-display text-alterun-gold">{cat.name}</span>
                  <span className="text-alterun-muted text-sm ml-2">/{cat.slug}</span>
                  {cat.description && (
                    <p className="text-alterun-muted text-sm mt-1">{cat.description}</p>
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
