export type CodexCategory = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type FeaturedImagePosition = "top" | "center" | "bottom";

export type CodexEntry = {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  body: string;
  category_id: string | null;
  featured_image_url: string | null;
  featured_image_caption: string | null;
  featured_image_position: FeaturedImagePosition | null;
  created_at: string;
  updated_at: string;
  author_id: string | null;
};

export type CodexLink = {
  id: string;
  source_entry_id: string;
  target_entry_id: string;
  created_at: string;
};

export type CodexEntryImage = {
  id: string;
  entry_id: string;
  url: string;
  caption: string | null;
  sort_order: number;
  created_at: string;
};

export type CodexEntryWithRelations = CodexEntry & {
  category: CodexCategory | null;
  linked_entries: (CodexEntry & { link_id: string })[];
  images: CodexEntryImage[];
};

export type CodexExport = {
  exported_at: string;
  categories: CodexCategory[];
  entries: CodexEntry[];
  links: CodexLink[];
  entry_images: CodexEntryImage[];
};
