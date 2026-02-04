"use client";

import { useState, useRef, useEffect } from "react";

export type Option = { id: string; label: string };

type Props = {
  options: Option[];
  value: Set<string>;
  onChange: (value: Set<string>) => void;
  placeholder?: string;
  label?: string;
  excludeIds?: Set<string>;
  id?: string;
  "aria-label"?: string;
};

export function MultiSelectPills({
  options,
  value,
  onChange,
  placeholder = "Search…",
  label,
  excludeIds = new Set(),
  id: idProp,
  "aria-label": ariaLabel,
}: Props) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  const filtered = options.filter(
    (o) =>
      !excludeIds.has(o.id) &&
      !value.has(o.id) &&
      (query.trim() === "" ||
        o.label.toLowerCase().includes(query.trim().toLowerCase()))
  );
  const selected = options.filter((o) => value.has(o.id));

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function add(id: string) {
    onChange(new Set(Array.from(value).concat(id)));
    setQuery("");
  }

  function remove(id: string) {
    const next = new Set(Array.from(value).filter((x) => x !== id));
    onChange(next);
  }

  const inputId = idProp ?? "multiselect-pills";

  return (
    <div ref={containerRef} className="relative w-full">
      {label && (
        <label htmlFor={inputId} className="block text-base text-alterun-muted mb-1">
          {label}
        </label>
      )}
      <div
        id={inputId}
        role="combobox"
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-controls={open ? `${inputId}-listbox` : undefined}
        aria-label={ariaLabel ?? label ?? undefined}
        className="min-h-[2.75rem] w-full rounded border border-alterun-border bg-alterun-bg px-3 py-2 focus-within:border-alterun-gold/50 focus-within:outline-none focus-within:ring-1 focus-within:ring-alterun-gold/30"
        onClick={() => setOpen(true)}
      >
        <div className="flex flex-wrap items-center gap-2">
          {selected.map((o) => (
            <span
              key={o.id}
              className="inline-flex items-center gap-1 rounded-full border border-alterun-gold/40 bg-alterun-gold/15 px-2.5 py-0.5 text-base text-alterun-gold"
            >
              <span className="truncate max-w-[12rem] sm:max-w-[16rem]">{o.label}</span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  remove(o.id);
                }}
                className="rounded-full p-0.5 hover:bg-alterun-gold/30 focus:outline-none focus:ring-1 focus:ring-alterun-gold"
                aria-label={`Remove ${o.label}`}
              >
                <span aria-hidden>×</span>
              </button>
            </span>
          ))}
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setOpen(true)}
            placeholder={selected.length === 0 ? placeholder : ""}
            className="min-w-[8rem] flex-1 border-0 bg-transparent py-0.5 text-base text-alterun-muted placeholder-alterun-muted/60 focus:outline-none focus:ring-0"
            aria-autocomplete="list"
            aria-controls={open ? `${inputId}-listbox` : undefined}
          />
        </div>
      </div>
      {open && (
        <ul
          id={`${inputId}-listbox`}
          role="listbox"
          className="absolute z-10 mt-1 max-h-48 w-full overflow-auto rounded border border-alterun-border bg-alterun-bg-card py-1 shadow-lg"
        >
          {filtered.length === 0 ? (
            <li className="px-3 py-2 text-base text-alterun-muted">No matches</li>
          ) : (
            filtered.map((o) => (
              <li
                key={o.id}
                role="option"
                aria-selected={value.has(o.id)}
                className={`cursor-pointer px-3 py-2 text-base transition-colors ${
                  value.has(o.id)
                    ? "bg-alterun-gold/15 text-alterun-gold"
                    : "text-alterun-muted hover:bg-alterun-bg-elevated hover:text-alterun-gold/90"
                }`}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  add(o.id);
                }}
              >
                {o.label}
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}
