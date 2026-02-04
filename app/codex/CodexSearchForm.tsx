"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import type { CodexCategory } from "@/lib/codex/types";

type Props = {
  categories: CodexCategory[];
  initialCategory?: string;
  initialSearch?: string;
  className?: string;
};

export function CodexSearchForm({
  categories,
  initialCategory,
  initialSearch,
  className = "",
}: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const q = (form.elements.namedItem("q") as HTMLInputElement)?.value?.trim() ?? "";
    const category = (form.elements.namedItem("category") as HTMLSelectElement)?.value ?? "";
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (category) params.set("category", category);
    startTransition(() => {
      router.push(`/codex?${params.toString()}`);
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={`flex flex-wrap items-center gap-3 ${className}`}
      role="search"
    >
      <label htmlFor="codex-q" className="sr-only">
        Search codex
      </label>
      <input
        id="codex-q"
        name="q"
        type="search"
        defaultValue={initialSearch}
        placeholder="Search the lore…"
        className="min-w-[12rem] flex-1 rounded border border-alterun-border bg-alterun-bg px-3 py-2.5 text-alterun-muted placeholder-alterun-muted/60 focus:border-alterun-gold/50 focus:outline-none focus:ring-1 focus:ring-inset focus:ring-alterun-gold/30 focus:border-l-2 focus:border-l-alterun-gold/50"
        aria-label="Search codex"
      />
      {categories.length > 0 && (
        <>
          <label htmlFor="codex-category" className="sr-only">
            Realm
          </label>
          <select
            id="codex-category"
            name="category"
            className="rounded border border-alterun-border bg-alterun-bg px-3 py-2.5 text-alterun-muted focus:border-alterun-gold/50 focus:outline-none focus:ring-1 focus:ring-inset focus:ring-alterun-gold/30"
            aria-label="Filter by realm"
            defaultValue={initialCategory ?? ""}
          >
            <option value="">All realms</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.slug}>
                {cat.name}
              </option>
            ))}
          </select>
        </>
      )}
      <button
        type="submit"
        disabled={isPending}
        className="btn-hover rounded border border-alterun-gold/50 bg-alterun-gold/15 px-4 py-2.5 font-display text-base uppercase tracking-wider text-alterun-gold hover:bg-alterun-gold/25 hover:shadow-[0_0_12px_rgba(201,162,39,0.12)] hover:border-alterun-gold/60 disabled:opacity-60 disabled:shadow-none"
      >
        {isPending ? "Searching…" : "Search"}
      </button>
    </form>
  );
}
