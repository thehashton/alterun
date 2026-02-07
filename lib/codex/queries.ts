import { createClient } from "@/lib/supabase/server";
import type {
  CodexCategory,
  CodexEntry,
  CodexEntryImage,
  CodexEntryWithRelations,
  CodexExport,
  CodexLink,
} from "./types";

const BUCKET = "images";

export async function getCodexCategories(): Promise<CodexCategory[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("codex_categories")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("name");
  if (error) throw error;
  return data ?? [];
}

const DEFAULT_PAGE_SIZE = 12;

export type GetCodexEntriesResult = {
  entries: CodexEntry[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
};

export async function getCodexEntries(options?: {
  categorySlug?: string;
  search?: string;
  page?: number;
  pageSize?: number;
}): Promise<GetCodexEntriesResult> {
  const supabase = await createClient();
  const page = Math.max(1, options?.page ?? 1);
  const pageSize = Math.min(50, Math.max(1, options?.pageSize ?? DEFAULT_PAGE_SIZE));

  let q = supabase
    .from("codex_entries")
    .select("*", { count: "exact" })
    .order("pinned", { ascending: false })
    .order("title", { ascending: true });

  if (options?.categorySlug) {
    const { data: cat } = await supabase
      .from("codex_categories")
      .select("id")
      .eq("slug", options.categorySlug)
      .single();
    if (cat) q = q.eq("category_id", cat.id);
  }

  if (options?.search?.trim()) {
    const raw = options.search.trim().replace(/,/g, " ").replace(/%/g, "");
    const term = `%${raw}%`;
    q = q.or(
      `title.ilike.${term},excerpt.ilike.${term},body.ilike.${term}`
    );
  }

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;
  const { data, error, count } = await q.range(from, to);
  if (error) throw error;

  const entries = (data ?? []) as CodexEntry[];
  const total = count ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return {
    entries,
    total,
    page,
    pageSize,
    totalPages,
  };
}

/** Decode and normalize slug from URL so lookup matches DB (encoding, unicode, case). */
function normalizeSlugForLookup(slug: string): string[] {
  try {
    const decoded = decodeURIComponent(slug.replace(/\+/g, " "));
    const normalized = decoded.normalize("NFC");
    const lower = normalized.toLowerCase();
    return [normalized, lower].filter((s, i, a) => a.indexOf(s) === i);
  } catch {
    return [slug];
  }
}

export async function getCodexEntryBySlug(
  slug: string
): Promise<CodexEntryWithRelations | null> {
  const supabase = await createClient();
  const candidates = normalizeSlugForLookup(slug);

  for (const candidate of candidates) {
    const { data: entry, error: eErr } = await supabase
      .from("codex_entries")
      .select("*")
      .eq("slug", candidate)
      .single();
    if (!eErr && entry) return await hydrateEntryWithRelations(supabase, entry);
  }
  return null;
}

async function hydrateEntryWithRelations(
  supabase: Awaited<ReturnType<typeof createClient>>,
  entry: CodexEntry
): Promise<CodexEntryWithRelations | null> {
  const [categories, links, images] = await Promise.all([
    entry.category_id
      ? supabase
          .from("codex_categories")
          .select("*")
          .eq("id", entry.category_id)
          .single()
      : Promise.resolve({ data: null }),
    supabase
      .from("codex_links")
      .select("id, target_entry_id")
      .eq("source_entry_id", entry.id),
    supabase
      .from("codex_entry_images")
      .select("*")
      .eq("entry_id", entry.id)
      .order("sort_order"),
  ]);

  const category = categories.data ?? null;
  let linkedEntries: (CodexEntry & { link_id: string })[] = [];
  if (links.data?.length) {
    const ids = links.data.map((l) => l.target_entry_id);
    const { data: entries } = await supabase
      .from("codex_entries")
      .select("*")
      .in("id", ids);
    const byId = new Map((entries ?? []).map((e) => [e.id, e]));
    linkedEntries = links.data
      .map((l) => {
        const e = byId.get(l.target_entry_id);
        return e ? { ...e, link_id: l.id } : null;
      })
      .filter(Boolean) as (CodexEntry & { link_id: string })[];
  }

  return {
    ...entry,
    category,
    linked_entries: linkedEntries,
    images: (images.data ?? []) as CodexEntryImage[],
  };
}

export async function getCodexEntryById(id: string): Promise<CodexEntry | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("codex_entries")
    .select("*")
    .eq("id", id)
    .single();
  if (error || !data) return null;
  return data;
}

/** Entry with category, linked entries, and images (for admin edit). */
export async function getCodexEntryWithRelationsForAdmin(
  id: string
): Promise<CodexEntryWithRelations | null> {
  const entry = await getCodexEntryById(id);
  if (!entry) return null;
  return getCodexEntryBySlug(entry.slug);
}

export async function getCodexLinksForEntry(entryId: string): Promise<CodexLink[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("codex_links")
    .select("*")
    .eq("source_entry_id", entryId);
  if (error) throw error;
  return data ?? [];
}

export async function getCodexEntryImages(entryId: string): Promise<CodexEntryImage[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("codex_entry_images")
    .select("*")
    .eq("entry_id", entryId)
    .order("sort_order");
  if (error) throw error;
  return data ?? [];
}

/** All codex data for export (authenticated). */
export async function getCodexExport(): Promise<CodexExport> {
  const supabase = await createClient();
  const [catRes, entriesRes, linksRes, imagesRes] = await Promise.all([
    supabase.from("codex_categories").select("*").order("sort_order"),
    supabase.from("codex_entries").select("*").order("title"),
    supabase.from("codex_links").select("*"),
    supabase.from("codex_entry_images").select("*").order("sort_order"),
  ]);
  if (catRes.error) throw catRes.error;
  if (entriesRes.error) throw entriesRes.error;
  if (linksRes.error) throw linksRes.error;
  if (imagesRes.error) throw imagesRes.error;
  return {
    exported_at: new Date().toISOString(),
    categories: catRes.data ?? [],
    entries: entriesRes.data ?? [],
    links: linksRes.data ?? [],
    entry_images: imagesRes.data ?? [],
  };
}

export function getPublicImageUrl(path: string): string {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const bucket = BUCKET;
  if (!url) return path;
  return `${url}/storage/v1/object/public/${bucket}/${path}`;
}
