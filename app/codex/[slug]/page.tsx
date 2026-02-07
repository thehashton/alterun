import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getCodexEntryBySlug } from "@/lib/codex/queries";
import { CodexEntryImageBlock } from "@/components/CodexEntryImageBlock";
import { FeaturedImageWithLightbox } from "@/components/FeaturedImageWithLightbox";
import { Button } from "@/components/Button";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const entry = await getCodexEntryBySlug(slug);
  if (!entry) return { title: "Codex | Alterun" };
  return {
    title: `${entry.title} | Codex | Alterun`,
    description: entry.excerpt ?? undefined,
  };
}

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function CodexEntryPage({ params }: Props) {
  const { slug } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const entry = await getCodexEntryBySlug(slug);
  if (!entry) notFound();

  return (
    <article className="max-w-3xl mx-auto px-10 sm:px-16 py-12 sm:py-16">
      <nav className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <Link
          href="/codex"
          className="text-alterun-gold/80 hover:text-alterun-gold text-xl uppercase tracking-wider"
        >
          ← Codex
        </Link>
        {user && (
          <Button
            href={`/admin/codex/entries/${entry.id}`}
            variant="stoneVines"
            size="compact"
          >
            Edit
          </Button>
        )}
      </nav>

      {entry.category && (
        <p className="text-alterun-muted text-xl uppercase tracking-wider mb-2">
          {entry.category.name}
        </p>
      )}
      <h1 className="font-display text-3xl sm:text-4xl text-alterun-gold uppercase tracking-widest mb-4">
        {entry.title}
      </h1>
      {entry.excerpt && (
        <p className="text-alterun-muted text-lg mb-6">{entry.excerpt}</p>
      )}

      {entry.featured_image_url && (
        <FeaturedImageWithLightbox
          src={entry.featured_image_url}
          alt={entry.featured_image_caption ?? undefined}
          caption={entry.featured_image_caption}
          objectPosition={
            entry.featured_image_position === "bottom"
              ? "bottom"
              : entry.featured_image_position === "center"
                ? "center"
                : "top"
          }
        />
      )}

      <div
        className="codex-body text-alterun-muted leading-relaxed [&_p]:text-xl [&_p]:mb-4 [&_a]:text-alterun-gold [&_a]:underline hover:[&_a]:text-alterun-gold/90 [&_strong]:text-alterun-gold/90 [&_em]:italic [&_u]:underline"
        dangerouslySetInnerHTML={{ __html: entry.body ?? "" }}
      />

      {entry.images && entry.images.length > 0 && (
        <section className="mt-10 pt-8 border-t border-alterun-border">
          <h2 className="font-display text-lg text-alterun-gold uppercase tracking-wider mb-4">
            Images
          </h2>
          <ul className="grid gap-8 sm:grid-cols-2">
            {entry.images.map((img) => (
              <li key={img.id}>
                <CodexEntryImageBlock
                  src={img.url}
                  caption={img.caption}
                  alt={img.caption ?? undefined}
                />
              </li>
            ))}
          </ul>
        </section>
      )}

      {entry.linked_entries && entry.linked_entries.length > 0 && (
        <section className="mt-10 pt-8 border-t border-alterun-border">
          <h2 className="font-display text-lg text-alterun-gold uppercase tracking-wider mb-4">
            Related entries
          </h2>
          <ul className="flex flex-wrap gap-2">
            {entry.linked_entries.map((linked) => (
              <li key={linked.link_id}>
                <Link
                  href={`/codex/${encodeURIComponent(linked.slug)}`}
                  className="ornament-border rounded px-3 py-2 bg-alterun-bg-card text-alterun-gold/90 hover:border-alterun-gold/40 hover:text-alterun-gold transition-colors"
                >
                  {linked.title}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </article>
  );
}
