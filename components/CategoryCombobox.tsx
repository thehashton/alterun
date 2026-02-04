"use client";

import { useState, useRef, useEffect } from "react";

export type CategoryOption = { id: string; name: string; slug: string };

const NEW_PREFIX = "new:";

/** value is either a category id (uuid) or "new:CategoryName" for a temporary new category */
type Props = {
  categories: CategoryOption[];
  value: string | null;
  onChange: (value: string | null) => void;
  name: string;
  label?: string;
  id?: string;
};

export function CategoryCombobox({
  categories,
  value,
  onChange,
  name,
  label = "Category",
  id: idProp = "entry-category",
}: Props) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  const isNewCategory = value?.startsWith(NEW_PREFIX) ?? false;
  const newCategoryName = isNewCategory ? value!.slice(NEW_PREFIX.length) : null;
  const selectedExisting = value && !isNewCategory ? categories.find((c) => c.id === value) : null;
  const displayLabel = selectedExisting?.name ?? newCategoryName ?? null;

  const filtered =
    query.trim() === ""
      ? categories
      : categories.filter((c) =>
          c.name.toLowerCase().includes(query.trim().toLowerCase()) ||
          c.slug.toLowerCase().includes(query.trim().toLowerCase())
        );

  function commitInput(text: string) {
    const trimmed = text.trim();
    if (!trimmed) return;
    const match = categories.find(
      (c) =>
        c.name.toLowerCase() === trimmed.toLowerCase() ||
        c.slug.toLowerCase() === trimmed.toLowerCase()
    );
    if (match) {
      onChange(match.id);
    } else {
      onChange(NEW_PREFIX + trimmed);
    }
    setQuery("");
    setOpen(false);
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const v = e.target.value;
    if (v.includes(",")) {
      const [before] = v.split(",");
      commitInput(before);
      const after = v.slice(v.indexOf(",") + 1).trim();
      setQuery(after);
      return;
    }
    setQuery(v);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && query.trim()) {
      e.preventDefault();
      commitInput(query);
    }
  }

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="relative w-full">
      {label && (
        <label htmlFor={idProp} className="block text-base text-alterun-muted mb-1">
          {label}
        </label>
      )}
      <input type="hidden" name={name} value={value ?? ""} readOnly />
      <div
        id={idProp}
        role="combobox"
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-label={label}
        className="min-h-[2.75rem] w-full rounded border border-alterun-border bg-alterun-bg px-3 py-2 focus-within:border-alterun-gold/50 focus-within:outline-none focus-within:ring-1 focus-within:ring-alterun-gold/30"
        onClick={() => setOpen(true)}
      >
        <div className="flex flex-wrap items-center gap-2">
          {displayLabel && !open && (
            <span
              className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-base ${
                isNewCategory
                  ? "border-amber-500/50 bg-amber-500/15 text-amber-200"
                  : "border-alterun-gold/40 bg-alterun-gold/15 text-alterun-gold"
              }`}
            >
              {isNewCategory && (
                <span className="text-xs uppercase tracking-wider text-amber-400/90">New</span>
              )}
              <span>{displayLabel}</span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onChange(null);
                }}
                className="rounded-full p-0.5 hover:bg-alterun-gold/30 focus:outline-none focus:ring-1 focus:ring-alterun-gold"
                aria-label="Clear category"
              >
                <span aria-hidden>×</span>
              </button>
            </span>
          )}
          {(open || !displayLabel) && (
            <input
              type="text"
              value={query}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              onFocus={() => setOpen(true)}
              placeholder={displayLabel && !open ? "" : "Search or type a category, then comma…"}
              className="min-w-[8rem] flex-1 border-0 bg-transparent py-0.5 text-base text-alterun-muted placeholder-alterun-muted/60 focus:outline-none focus:ring-0"
              aria-autocomplete="list"
              aria-controls={open ? `${idProp}-listbox` : undefined}
            />
          )}
        </div>
      </div>
      {open && (
        <ul
          id={`${idProp}-listbox`}
          role="listbox"
          className="absolute z-10 mt-1 max-h-48 w-full overflow-auto rounded border border-alterun-border bg-alterun-bg-card py-1 shadow-lg"
        >
          {filtered.length === 0 ? (
            <li className="px-3 py-2 text-base text-alterun-muted">No categories match</li>
          ) : (
            filtered.map((c) => (
              <li
                key={c.id}
                role="option"
                aria-selected={value === c.id}
                className={`cursor-pointer px-3 py-2 text-base transition-colors ${
                  value === c.id
                    ? "bg-alterun-gold/15 text-alterun-gold"
                    : "text-alterun-muted hover:bg-alterun-bg-elevated hover:text-alterun-gold/90"
                }`}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onChange(c.id);
                  setOpen(false);
                  setQuery("");
                }}
              >
                {c.name}
                <span className="ml-2 text-alterun-muted/80">/{c.slug}</span>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}
