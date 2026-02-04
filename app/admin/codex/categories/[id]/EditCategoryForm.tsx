"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { updateCategory, deleteCategory } from "@/lib/codex/actions";
import type { CodexCategory } from "@/lib/codex/types";

type Props = {
  category: CodexCategory;
};

export function EditCategoryForm({ category }: Props) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const form = e.currentTarget;
    const result = await updateCategory(category.id, new FormData(form));
    if (result.error) {
      setError(result.error);
      return;
    }
    router.refresh();
    router.push("/admin/codex/categories");
  }

  async function handleDelete() {
    if (!confirm("Delete this category? Entries will keep their category reference but it will be unset.")) return;
    setDeleting(true);
    setError(null);
    const result = await deleteCategory(category.id);
    if (result.error) {
      setError(result.error);
      setDeleting(false);
      return;
    }
    router.push("/admin/codex/categories");
  }

  return (
    <div className="space-y-6">
      {error && <p className="text-red-400 text-sm">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4 ornament-border rounded-lg p-6 bg-alterun-bg-card">
        <div>
          <label htmlFor="cat-name" className="block text-sm text-alterun-muted mb-1">Name</label>
          <input
            id="cat-name"
            name="name"
            type="text"
            required
            defaultValue={category.name}
            className="w-full rounded border border-alterun-border bg-alterun-bg px-3 py-2 text-alterun-muted focus:border-alterun-gold/50 focus:outline-none"
          />
        </div>
        <div>
          <label htmlFor="cat-slug" className="block text-sm text-alterun-muted mb-1">Slug</label>
          <input
            id="cat-slug"
            name="slug"
            type="text"
            required
            defaultValue={category.slug}
            className="w-full rounded border border-alterun-border bg-alterun-bg px-3 py-2 text-alterun-muted focus:border-alterun-gold/50 focus:outline-none"
          />
        </div>
        <div>
          <label htmlFor="cat-desc" className="block text-sm text-alterun-muted mb-1">Description</label>
          <textarea
            id="cat-desc"
            name="description"
            rows={2}
            defaultValue={category.description ?? ""}
            className="w-full rounded border border-alterun-border bg-alterun-bg px-3 py-2 text-alterun-muted focus:border-alterun-gold/50 focus:outline-none"
          />
        </div>
        <div>
          <label htmlFor="cat-sort" className="block text-sm text-alterun-muted mb-1">Sort order</label>
          <input
            id="cat-sort"
            name="sort_order"
            type="number"
            defaultValue={category.sort_order}
            className="w-24 rounded border border-alterun-border bg-alterun-bg px-3 py-2 text-alterun-muted focus:border-alterun-gold/50 focus:outline-none"
          />
        </div>
        <div className="flex gap-3">
          <button
            type="submit"
            className="btn-hover rounded border border-alterun-gold/40 bg-alterun-gold/10 px-4 py-2 text-base text-alterun-gold hover:bg-alterun-gold/20 hover:border-alterun-gold/50 hover:shadow-md"
          >
            Save
          </button>
          <Link
            href="/admin/codex/categories"
            className="btn-hover rounded border border-alterun-border px-4 py-2 text-base text-alterun-muted hover:border-alterun-gold/30 hover:text-alterun-gold/90"
          >
            Cancel
          </Link>
        </div>
      </form>
      <div className="ornament-border rounded-lg p-6 bg-alterun-bg-card border-red-900/30">
        <h2 className="font-display text-sm text-alterun-gold uppercase tracking-wider mb-2">Danger zone</h2>
        <button
          type="button"
          onClick={handleDelete}
          disabled={deleting}
          className="btn-hover rounded border border-red-500/50 bg-red-500/10 px-4 py-2 text-base text-red-400 hover:bg-red-500/20 hover:border-red-500/70 hover:shadow-md disabled:opacity-60"
        >
          {deleting ? "Deleting…" : "Delete category"}
        </button>
      </div>
    </div>
  );
}
