import Link from "next/link";
import { notFound } from "next/navigation";
import Image from "next/image";
import { getCodexEntryBySlug } from "@/lib/codex/queries";

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
  const entry = await getCodexEntryBySlug(slug);
  if (!entry) notFound();

  return (
    <article className="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
      <nav className="mb-6">
        <Link
          href="/codex"
          className="text-alterun-gold/80 hover:text-alterun-gold text-sm uppercase tracking-wider"
        >
          ← Codex
        </Link>
      </nav>

      {entry.category && (
        <p className="text-alterun-muted text-sm uppercase tracking-wider mb-2">
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
        <div className="relative aspect-video rounded-lg overflow-hidden mb-8 ornament-border">
          <Image
            src={entry.featured_image_url}
            alt=""
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 672px"
          />
        </div>
      )}

      <div className="codex-body text-alterun-muted leading-relaxed whitespace-pre-wrap">
        {entry.body}
      </div>

      {entry.images && entry.images.length > 0 && (
        <section className="mt-10 pt-8 border-t border-alterun-border">
          <h2 className="font-display text-lg text-alterun-gold uppercase tracking-wider mb-4">
            Images
          </h2>
          <ul className="grid gap-6 sm:grid-cols-2">
            {entry.images.map((img) => (
              <li key={img.id}>
                <div className="relative aspect-[4/3] rounded-lg overflow-hidden ornament-border">
                  <Image
                    src={img.url}
                    alt={img.caption ?? ""}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, 50vw"
                  />
                </div>
                {img.caption && (
                  <p className="mt-2 text-sm text-alterun-muted">{img.caption}</p>
                )}
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
                  href={`/codex/${linked.slug}`}
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
