"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createCategory } from "@/lib/codex/actions";

export function CategoryForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const form = e.currentTarget;
    const result = await createCategory(new FormData(form));
    if (result.error) {
      setError(result.error);
      return;
    }
    router.refresh();
    form.reset();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 ornament-border rounded-lg p-6 bg-alterun-bg-card">
      {error && (
        <p className="text-red-400 text-sm">{error}</p>
      )}
      <div>
        <label htmlFor="cat-name" className="block text-sm text-alterun-muted mb-1">
          Name
        </label>
        <input
          id="cat-name"
          name="name"
          type="text"
          required
          className="w-full rounded border border-alterun-border bg-alterun-bg px-3 py-2 text-alterun-muted focus:border-alterun-gold/50 focus:outline-none"
        />
      </div>
      <div>
        <label htmlFor="cat-slug" className="block text-sm text-alterun-muted mb-1">
          Slug (optional, auto from name)
        </label>
        <input
          id="cat-slug"
          name="slug"
          type="text"
          placeholder="e.g. people"
          className="w-full rounded border border-alterun-border bg-alterun-bg px-3 py-2 text-alterun-muted focus:border-alterun-gold/50 focus:outline-none"
        />
      </div>
      <div>
        <label htmlFor="cat-desc" className="block text-sm text-alterun-muted mb-1">
          Description
        </label>
        <textarea
          id="cat-desc"
          name="description"
          rows={2}
          className="w-full rounded border border-alterun-border bg-alterun-bg px-3 py-2 text-alterun-muted focus:border-alterun-gold/50 focus:outline-none"
        />
      </div>
      <div>
        <label htmlFor="cat-sort" className="block text-sm text-alterun-muted mb-1">
          Sort order
        </label>
        <input
          id="cat-sort"
          name="sort_order"
          type="number"
          defaultValue={0}
          className="w-24 rounded border border-alterun-border bg-alterun-bg px-3 py-2 text-alterun-muted focus:border-alterun-gold/50 focus:outline-none"
        />
      </div>
      <button
        type="submit"
        className="btn-hover rounded border border-alterun-gold/40 bg-alterun-gold/10 px-4 py-2 text-base text-alterun-gold hover:bg-alterun-gold/20 hover:border-alterun-gold/50 hover:shadow-md"
      >
        Add category
      </button>
    </form>
  );
}
