"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import {
  createEntry,
  updateEntry,
  createCategory,
  uploadCodexImageForm,
  addEntryImage,
  deleteEntryImage,
} from "@/lib/codex/actions";
import { CategoryCombobox } from "@/components/CategoryCombobox";
import { MultiSelectPills } from "@/components/MultiSelectPills";
import { RichTextEditor } from "@/components/RichTextEditor";
import type { CodexCategory, CodexEntry, CodexEntryImage, CodexEntryWithRelations } from "@/lib/codex/types";

type TabId = "write" | "details" | "media" | "related";

const TABS: { id: TabId; label: string }[] = [
  { id: "write", label: "Write" },
  { id: "details", label: "Details" },
  { id: "media", label: "Media" },
  { id: "related", label: "Related" },
];

type Props = {
  categories: CodexCategory[];
  allEntries: CodexEntry[];
  entry?: CodexEntryWithRelations | null;
};

export function EntryForm({
  categories,
  allEntries,
  entry = null,
}: Props) {
  const router = useRouter();
  const isEdit = !!entry;
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabId>("write");
  const [bodyHtml, setBodyHtml] = useState(entry?.body ?? "");
  const [featuredUrl, setFeaturedUrl] = useState(entry?.featured_image_url ?? "");
  const [featuredCaption, setFeaturedCaption] = useState(entry?.featured_image_caption ?? "");
  const [featuredPosition, setFeaturedPosition] = useState<"top" | "center" | "bottom">(
    (entry?.featured_image_position as "top" | "center" | "bottom") || "top"
  );
  const [uploadingFeatured, setUploadingFeatured] = useState(false);
  const [categoryId, setCategoryId] = useState<string | null>(entry?.category_id ?? null);
  const [slugValue, setSlugValue] = useState(entry?.slug ?? "");
  const [slugInput, setSlugInput] = useState("");
  const featuredFileRef = useRef<HTMLInputElement>(null);

  const linkedEntryIds = entry?.linked_entries?.map((e) => e.id) ?? [];
  const [selectedLinkIds, setSelectedLinkIds] = useState<Set<string>>(
    new Set(linkedEntryIds)
  );

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const trimmedBody = bodyHtml.replace(/<p><\/p>/g, "").trim();
    if (!trimmedBody || trimmedBody === "<p></p>") {
      setError("Body is required.");
      setActiveTab("write");
      toast.error("Body is required.");
      return;
    }
    const form = e.currentTarget;
    const fd = new FormData(form);
    fd.set("body", bodyHtml);
    fd.set("featured_image_url", featuredUrl);
    fd.set("featured_image_caption", featuredCaption);
    fd.set("featured_image_position", featuredPosition);
    let resolvedCategoryId = categoryId ?? "";
    if (categoryId?.startsWith("new:")) {
      const name = categoryId.slice(4).trim();
      if (!name) {
        setError("Category name is required.");
        toast.error("Category name is required.");
        return;
      }
      const createFd = new FormData();
      createFd.set("name", name);
      const catResult = await createCategory(createFd);
      if (catResult.error) {
        setError(catResult.error);
        toast.error(catResult.error);
        return;
      }
      resolvedCategoryId = catResult.data!.id;
    }
    fd.set("category_id", resolvedCategoryId);
    const slug = slugValue.trim();
    if (isEdit && entry && !slug) {
      setError("Slug is required.");
      toast.error("Slug is required.");
      return;
    }
    fd.set("slug", slug);
    fd.set(
      "linked_entry_ids",
      Array.from(selectedLinkIds).filter((id) => id !== entry?.id).join(",")
    );
    if (isEdit && entry) {
      const result = await updateEntry(entry.id, fd);
      if (result.error) {
        setError(result.error);
        toast.error(result.error);
        return;
      }
      toast.success("Entry saved.");
      router.refresh();
      router.push("/admin/codex");
      return;
    }
    const result = await createEntry(fd);
    if (result.error) {
      setError(result.error);
      toast.error(result.error);
      return;
    }
    toast.success("Entry added.");
    router.refresh();
    router.push("/admin/codex");
  }

  async function handleFeaturedUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingFeatured(true);
    setError(null);
    const formData = new FormData();
    formData.set("file", file);
    formData.set("pathPrefix", "codex");
    const result = await uploadCodexImageForm(formData);
    if (result.path) setFeaturedUrl(result.path);
    if (result.error) {
      setError(result.error);
      toast.error(result.error);
    }
    setUploadingFeatured(false);
    e.target.value = "";
  }

  const linkedOptions = allEntries
    .filter((e) => e.id !== entry?.id)
    .map((e) => ({ id: e.id, label: e.title }));

  function commitSlugInput(text: string) {
    const trimmed = text.trim();
    if (trimmed) setSlugValue(trimmed);
    setSlugInput("");
  }

  function handleSlugInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const v = e.target.value;
    if (v.includes(",")) {
      const [before] = v.split(",");
      commitSlugInput(before);
      setSlugInput(v.slice(v.indexOf(",") + 1).trim());
      return;
    }
    setSlugInput(v);
  }

  function handleSlugKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && (slugInput.trim() || slugValue)) {
      e.preventDefault();
      if (slugInput.trim()) commitSlugInput(slugInput);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 text-xl">
      {error && <p className="text-red-400 text-xl">{error}</p>}

      <input type="hidden" name="body" value={bodyHtml} readOnly />
      <input type="hidden" name="featured_image_url" value={featuredUrl} />
      <input type="hidden" name="featured_image_caption" value={featuredCaption} readOnly />
      <input type="hidden" name="featured_image_position" value={featuredPosition} readOnly />

      <div className="ornament-border rounded-lg border-l-2 border-l-alterun-gold/25 bg-alterun-bg-card overflow-hidden">
        <div
          className="flex border-b border-alterun-border bg-alterun-bg/80"
          role="tablist"
          aria-label="Entry sections"
        >
          {TABS.map(({ id, label }) => (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={activeTab === id}
              aria-controls={`panel-${id}`}
              id={`tab-${id}`}
              onClick={() => setActiveTab(id)}
              className={`min-w-0 flex-1 px-4 py-3 text-xl font-display uppercase tracking-wider transition-colors focus:outline-none focus:ring-2 focus:ring-inset focus:ring-alterun-gold/50 ${
                activeTab === id
                  ? "border-b-2 border-alterun-gold text-alterun-gold bg-alterun-bg-card"
                  : "text-alterun-muted hover:text-alterun-gold/90 hover:bg-alterun-bg/60"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div
          id="panel-write"
          role="tabpanel"
          aria-labelledby="tab-write"
          hidden={activeTab !== "write"}
          className="p-4 sm:p-6 space-y-4"
        >
          <div>
            <label htmlFor="entry-title" className="block text-xl text-alterun-muted mb-1">
              Title *
            </label>
            <input
              id="entry-title"
              name="title"
              type="text"
              required
              defaultValue={entry?.title}
              className="w-full rounded border border-alterun-border bg-alterun-bg px-3 py-2 text-xl text-alterun-muted focus:border-alterun-gold/50 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xl text-alterun-muted mb-1">Body *</label>
            <RichTextEditor
              defaultValue={entry?.body ?? ""}
              onChange={setBodyHtml}
              placeholder="Chronicle text…"
              minHeight="14rem"
            />
          </div>
          <div>
            <label htmlFor="entry-excerpt" className="block text-xl text-alterun-muted mb-1">
              Excerpt
            </label>
            <textarea
              id="entry-excerpt"
              name="excerpt"
              rows={2}
              defaultValue={entry?.excerpt ?? ""}
              className="w-full rounded border border-alterun-border bg-alterun-bg px-3 py-2 text-xl text-alterun-muted focus:border-alterun-gold/50 focus:outline-none"
            />
          </div>
        </div>

        <div
          id="panel-details"
          role="tabpanel"
          aria-labelledby="tab-details"
          hidden={activeTab !== "details"}
          className="p-4 sm:p-6 space-y-4"
        >
          <div>
            <label htmlFor="entry-slug" className="block text-xl text-alterun-muted mb-1">
              Slug * (type then comma or Enter to set; auto from title if empty on create)
            </label>
            <input type="hidden" name="slug" value={slugValue} readOnly />
            <div className="min-h-[2.75rem] w-full rounded border border-alterun-border bg-alterun-bg px-3 py-2 focus-within:border-alterun-gold/50 focus-within:outline-none focus-within:ring-1 focus-within:ring-alterun-gold/30">
              <div className="flex flex-wrap items-center gap-2">
                {slugValue && (
                  <span className="inline-flex items-center gap-1 rounded-full border border-alterun-gold/40 bg-alterun-gold/15 px-2.5 py-0.5 text-xl text-alterun-gold">
                    <span>{slugValue}</span>
                    <button
                      type="button"
                      onClick={() => setSlugValue("")}
                      className="rounded-full p-0.5 hover:bg-alterun-gold/30 focus:outline-none focus:ring-1 focus:ring-alterun-gold"
                      aria-label="Clear slug"
                    >
                      <span aria-hidden>×</span>
                    </button>
                  </span>
                )}
                <input
                  id="entry-slug"
                  type="text"
                  value={slugInput}
                  onChange={handleSlugInputChange}
                  onKeyDown={handleSlugKeyDown}
                  placeholder={slugValue ? "" : "e.g. the-crimson-king (type, then comma)"}
                  className="min-w-[8rem] flex-1 border-0 bg-transparent py-0.5 text-xl text-alterun-muted placeholder-alterun-muted/60 focus:outline-none focus:ring-0"
                />
              </div>
            </div>
          </div>
          <div>
            <CategoryCombobox
              categories={categories.map((c) => ({ id: c.id, name: c.name, slug: c.slug }))}
              value={categoryId}
              onChange={setCategoryId}
              name="category_id"
              label="Category"
            />
            <p className="mt-1.5 text-xl text-alterun-muted">
              Don&apos;t see a category?{" "}
              <Link
                href="/admin/codex/categories"
                className="text-alterun-gold/90 hover:text-alterun-gold underline"
              >
                Add one in Categories
              </Link>
            </p>
          </div>
        </div>

        <div
          id="panel-media"
          role="tabpanel"
          aria-labelledby="tab-media"
          hidden={activeTab !== "media"}
          className="p-4 sm:p-6 space-y-6"
        >
          <div className="space-y-4">
            <h2 className="font-display text-xl sm:text-2xl text-alterun-gold uppercase tracking-wider">
              Featured image
            </h2>
            <div>
              <label htmlFor="entry-featured-url" className="block text-xl text-alterun-muted mb-1">
                Image URL (or upload below)
              </label>
              <input
                id="entry-featured-url"
                type="url"
                value={featuredUrl}
                onChange={(e) => setFeaturedUrl(e.target.value)}
                placeholder="https://…"
                className="w-full rounded border border-alterun-border bg-alterun-bg px-3 py-2 text-xl text-alterun-muted focus:border-alterun-gold/50 focus:outline-none"
              />
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <input
                ref={featuredFileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFeaturedUpload}
              />
              <button
                type="button"
                onClick={() => featuredFileRef.current?.click()}
                disabled={uploadingFeatured}
                className="btn-hover rounded border border-alterun-border bg-alterun-bg px-4 py-2 text-xl text-alterun-muted hover:border-alterun-gold/30 hover:text-alterun-gold/90 disabled:opacity-60"
              >
                {uploadingFeatured ? "Uploading…" : "Upload image"}
              </button>
            </div>
            <div>
              <label htmlFor="entry-featured-position" className="block text-xl text-alterun-muted mb-1">
                Image position
              </label>
              <select
                id="entry-featured-position"
                value={featuredPosition}
                onChange={(e) => setFeaturedPosition(e.target.value as "top" | "center" | "bottom")}
                className="w-full rounded border border-alterun-border bg-alterun-bg px-3 pr-12 py-2 text-xl text-alterun-muted focus:border-alterun-gold/50 focus:outline-none appearance-none bg-[length:1.25rem_1.25rem] bg-[right_0.75rem_center] bg-no-repeat"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236b6560'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E")`,
                }}
              >
                <option value="top">↑ Top (show head/top of image)</option>
                <option value="center">● Center</option>
                <option value="bottom">↓ Bottom</option>
              </select>
              <p className="mt-1 text-alterun-muted/80 text-lg">
                Choose which part of the image is visible when it’s cropped to the frame.
              </p>
            </div>
            <div>
              <label htmlFor="entry-featured-caption" className="block text-xl text-alterun-muted mb-1">
                Description (below image)
              </label>
              <textarea
                id="entry-featured-caption"
                value={featuredCaption}
                onChange={(e) => setFeaturedCaption(e.target.value)}
                rows={3}
                placeholder="Optional caption or description for the featured image."
                className="w-full rounded border border-alterun-border bg-alterun-bg px-3 py-2 text-xl text-alterun-muted focus:border-alterun-gold/50 focus:outline-none"
              />
            </div>
          </div>
          {isEdit && entry && (
            <EntryImagesSection entryId={entry.id} images={entry.images ?? []} />
          )}
        </div>

        <div
          id="panel-related"
          role="tabpanel"
          aria-labelledby="tab-related"
          hidden={activeTab !== "related"}
          className="p-4 sm:p-6 space-y-4"
        >
          <h2 className="font-display text-xl sm:text-2xl text-alterun-gold uppercase tracking-wider">
            Link to other entries
          </h2>
            <p className="text-xl text-alterun-muted">
              Search and select entries to show as “Related entries” on this entry’s page.
            </p>
            <MultiSelectPills
              options={linkedOptions}
              value={selectedLinkIds}
              onChange={setSelectedLinkIds}
              placeholder="Search entries…"
              aria-label="Related entries"
            />
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          type="submit"
          className="btn-hover rounded border border-alterun-gold/40 bg-alterun-gold/10 px-4 py-2 text-xl text-alterun-gold hover:bg-alterun-gold/20 hover:border-alterun-gold/50 hover:shadow-md"
        >
          {isEdit ? "Save entry" : "Create entry"}
        </button>
        <Link
          href="/admin/codex"
          className="btn-hover rounded border border-alterun-border px-4 py-2 text-xl text-alterun-muted hover:border-alterun-gold/30 hover:text-alterun-gold/90"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}

function EntryImagesSection({
  entryId,
  images,
}: {
  entryId: string;
  images: CodexEntryImage[];
}) {
  const router = useRouter();
  const [uploading, setUploading] = useState(false);
  const [newCaption, setNewCaption] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  async function handleAddImage(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.set("file", file);
    formData.set("pathPrefix", "codex");
    const result = await uploadCodexImageForm(formData);
    if (result.path) {
      await addEntryImage(entryId, result.path, newCaption || null, images.length);
      router.refresh();
      setNewCaption("");
    }
    setUploading(false);
    e.target.value = "";
  }

  async function handleRemove(id: string) {
    await deleteEntryImage(id);
    router.refresh();
  }

  return (
    <div className="ornament-border rounded-lg border-l-2 border-l-alterun-gold/25 bg-alterun-bg-card p-4 sm:p-6 space-y-4">
      <h2 className="font-display text-xl sm:text-2xl text-alterun-gold uppercase tracking-wider">
        Entry images
      </h2>
      <p className="text-xl text-alterun-muted">
        Extra images shown on the entry page (with optional captions).
      </p>
      {images.length > 0 && (
        <ul className="space-y-3">
          {images.map((img) => (
            <li
              key={img.id}
              className="flex flex-col gap-3 rounded border border-alterun-border p-3 sm:flex-row sm:items-start sm:gap-4"
            >
              <img
                src={img.url}
                alt=""
                className="h-24 w-32 flex-shrink-0 rounded object-cover sm:h-16 sm:w-24"
              />
              <div className="min-w-0 flex-1">
                {img.caption && (
                  <p className="text-xl text-alterun-muted">{img.caption}</p>
                )}
              </div>
              <button
                type="button"
                onClick={() => handleRemove(img.id)}
                className="self-start text-xl text-red-400 hover:text-red-300 transition-colors duration-200"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}
      <div className="flex flex-wrap items-center gap-3">
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleAddImage}
        />
        <input
          type="text"
          placeholder="Caption for new image"
          value={newCaption}
          onChange={(e) => setNewCaption(e.target.value)}
          className="min-w-0 flex-1 rounded border border-alterun-border bg-alterun-bg px-3 py-2 text-xl text-alterun-muted focus:border-alterun-gold/50 focus:outline-none sm:max-w-xs"
        />
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className="btn-hover rounded border border-alterun-border bg-alterun-bg px-4 py-2 text-xl text-alterun-muted hover:border-alterun-gold/30 hover:text-alterun-gold/90 disabled:opacity-60"
        >
          {uploading ? "Uploading…" : "Add image"}
        </button>
      </div>
    </div>
  );
}
