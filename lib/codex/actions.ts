"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { getCodexExport, getCodexEntryById } from "./queries";
import type { CodexCategory, CodexEntry, CodexEntryImage, CodexLink } from "./types";

const BUCKET = "images";

function slugify(s: string): string {
  return s
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export async function ensureAuth() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");
  return { supabase, user };
}

// ——— Categories ———
export async function createCategory(formData: FormData) {
  const { supabase } = await ensureAuth();
  const name = (formData.get("name") as string)?.trim();
  const description = (formData.get("description") as string)?.trim() || null;
  const slug = formData.get("slug") ? (formData.get("slug") as string).trim() : slugify(name || "");
  if (!name || !slug) return { error: "Name is required" };
  const sortOrder = Number(formData.get("sort_order")) || 0;
  const { data, error } = await supabase
    .from("codex_categories")
    .insert({ slug, name, description, sort_order: sortOrder })
    .select()
    .single();
  if (error) return { error: error.message };
  revalidatePath("/codex");
  revalidatePath("/admin/codex");
  return { data };
}

export async function updateCategory(id: string, formData: FormData) {
  const { supabase } = await ensureAuth();
  const name = (formData.get("name") as string)?.trim();
  const description = (formData.get("description") as string)?.trim() || null;
  const slug = (formData.get("slug") as string)?.trim();
  const sortOrder = Number(formData.get("sort_order")) || 0;
  if (!name || !slug) return { error: "Name and slug are required" };
  const { data, error } = await supabase
    .from("codex_categories")
    .update({ slug, name, description, sort_order: sortOrder, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();
  if (error) return { error: error.message };
  revalidatePath("/codex");
  revalidatePath("/admin/codex");
  return { data };
}

export async function deleteCategory(id: string) {
  const { supabase } = await ensureAuth();
  const { error } = await supabase.from("codex_categories").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/codex");
  revalidatePath("/admin/codex");
  return {};
}

// ——— Entries ———
export async function createEntry(formData: FormData) {
  const { supabase, user } = await ensureAuth();
  const title = (formData.get("title") as string)?.trim();
  const slug = formData.get("slug") ? (formData.get("slug") as string).trim() : slugify(title || "");
  const excerpt = (formData.get("excerpt") as string)?.trim() || null;
  const body = (formData.get("body") as string)?.trim() || "";
  const categoryId = (formData.get("category_id") as string)?.trim() || null;
  const featuredImageUrl = (formData.get("featured_image_url") as string)?.trim() || null;
  const featuredImageCaption = (formData.get("featured_image_caption") as string)?.trim() || null;
  const featuredImagePosition = (formData.get("featured_image_position") as string)?.trim() || null;
  const position = featuredImagePosition && ["top", "center", "bottom"].includes(featuredImagePosition) ? featuredImagePosition : "top";
  const pinned = formData.get("pinned") === "on" || formData.get("pinned") === "true";
  if (!title || !slug) return { error: "Title is required" };
  const { data, error } = await supabase
    .from("codex_entries")
    .insert({
      slug,
      title,
      excerpt,
      body,
      category_id: categoryId || null,
      featured_image_url: featuredImageUrl || null,
      featured_image_caption: featuredImageCaption || null,
      featured_image_position: position,
      pinned,
      author_id: user.id,
    })
    .select()
    .single();
  if (error) return { error: error.message };
  const linkIds = (formData.get("linked_entry_ids") as string)?.trim();
  if (linkIds && data?.id) {
    const ids = linkIds.split(",").map((id) => id.trim()).filter(Boolean);
    if (ids.length)
      await supabase.from("codex_links").insert(
        ids.map((target_entry_id) => ({ source_entry_id: data.id, target_entry_id }))
      );
  }
  revalidatePath("/codex");
  revalidatePath("/admin/codex");
  revalidatePath(`/codex/${slug}`);
  return { data };
}

export async function updateEntry(id: string, formData: FormData) {
  const { supabase } = await ensureAuth();
  const title = (formData.get("title") as string)?.trim();
  const slug = (formData.get("slug") as string)?.trim();
  const excerpt = (formData.get("excerpt") as string)?.trim() || null;
  const body = (formData.get("body") as string)?.trim() || "";
  const categoryId = (formData.get("category_id") as string)?.trim() || null;
  const featuredImageUrl = (formData.get("featured_image_url") as string)?.trim() || null;
  const featuredImageCaption = (formData.get("featured_image_caption") as string)?.trim() || null;
  const featuredImagePosition = (formData.get("featured_image_position") as string)?.trim() || null;
  const position = featuredImagePosition && ["top", "center", "bottom"].includes(featuredImagePosition) ? featuredImagePosition : null;
  const pinned = formData.get("pinned") === "on" || formData.get("pinned") === "true";
  if (!title || !slug) return { error: "Title and slug are required" };
  const { data, error } = await supabase
    .from("codex_entries")
    .update({
      slug,
      title,
      excerpt,
      body,
      category_id: categoryId || null,
      featured_image_url: featuredImageUrl || null,
      featured_image_caption: featuredImageCaption || null,
      featured_image_position: position,
      pinned,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single();
  if (error) return { error: error.message };
  const linkIds = (formData.get("linked_entry_ids") as string)?.trim();
  if (data?.id) {
    await supabase.from("codex_links").delete().eq("source_entry_id", data.id);
    if (linkIds) {
      const ids = linkIds.split(",").map((id) => id.trim()).filter(Boolean);
      if (ids.length)
        await supabase.from("codex_links").insert(
          ids.map((target_entry_id) => ({ source_entry_id: data.id, target_entry_id }))
        );
    }
  }
  revalidatePath("/codex");
  revalidatePath("/admin/codex");
  revalidatePath(`/codex/${slug}`);
  return { data };
}

export async function deleteEntry(id: string) {
  const { supabase } = await ensureAuth();
  const { error } = await supabase.from("codex_entries").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/codex");
  revalidatePath("/admin/codex");
  return {};
}

// ——— Entry images (extra images, not featured) ———
export async function addEntryImage(entryId: string, url: string, caption: string | null, sortOrder: number) {
  const { supabase } = await ensureAuth();
  const { data, error } = await supabase
    .from("codex_entry_images")
    .insert({ entry_id: entryId, url, caption: caption || null, sort_order: sortOrder })
    .select()
    .single();
  if (error) return { error: error.message };
  revalidatePath("/codex");
  revalidatePath("/admin/codex");
  const entry = await getCodexEntryById(entryId);
  if (entry?.slug) revalidatePath(`/codex/${entry.slug}`);
  return { data };
}

export async function updateEntryImage(id: string, payload: { url?: string; caption?: string | null; sort_order?: number }) {
  const { supabase } = await ensureAuth();
  const { data: img } = await supabase.from("codex_entry_images").select("entry_id").eq("id", id).single();
  const { error } = await supabase.from("codex_entry_images").update(payload).eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/codex");
  revalidatePath("/admin/codex");
  if (img?.entry_id) {
    const entry = await getCodexEntryById(img.entry_id);
    if (entry?.slug) revalidatePath(`/codex/${entry.slug}`);
  }
  return {};
}

export async function deleteEntryImage(id: string) {
  const { supabase } = await ensureAuth();
  const { data: img } = await supabase.from("codex_entry_images").select("entry_id").eq("id", id).single();
  const { error } = await supabase.from("codex_entry_images").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/codex");
  revalidatePath("/admin/codex");
  if (img?.entry_id) {
    const entry = await getCodexEntryById(img.entry_id);
    if (entry?.slug) revalidatePath(`/codex/${entry.slug}`);
  }
  return {};
}

// ——— Upload image to Storage; returns public path for DB ———
export async function uploadCodexImage(file: File, pathPrefix: string): Promise<{ path?: string; error?: string }> {
  const { supabase } = await ensureAuth();
  const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const name = `${pathPrefix}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const { data, error } = await supabase.storage.from(BUCKET).upload(name, file, {
    cacheControl: "3600",
    upsert: false,
  });
  if (error) return { error: error.message };
  const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(data.path);
  return { path: urlData.publicUrl };
}

/** Accept FormData with 'file' and 'pathPrefix'; returns public URL for use in forms. */
export async function uploadCodexImageForm(formData: FormData): Promise<{ path?: string; error?: string }> {
  const file = formData.get("file") as File | null;
  const pathPrefix = (formData.get("pathPrefix") as string) || "codex";
  const isFile =
    file &&
    typeof file === "object" &&
    typeof (file as File).size === "number" &&
    (file as File).size > 0;
  if (!isFile) return { error: "No file" };
  return uploadCodexImage(file as File, pathPrefix);
}

/** Export full codex data (categories, entries, links, images). Call from authenticated client. */
export async function exportCodex() {
  await ensureAuth();
  return getCodexExport();
}
