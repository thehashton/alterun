import Link from "next/link";
import { HeroLogo } from "@/components/HeroLogo";
import { ContentDivider } from "@/components/ContentDivider";

export default function HomePage() {
  return (
    <>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-4">
        <section className="text-center">
          <HeroLogo />
        </section>
      </div>
      <ContentDivider variant="stone" className="my-6 sm:my-8" />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 pb-8 sm:pb-12">
      <section className="text-center mb-6">
        <p className="text-alterun-muted text-lg max-w-xl mx-auto">
          Welcome to the world of Alterun — a chronicle of tales, lore, and the
          Codex of its peoples and places.
        </p>
      </section>

      <section className="grid sm:grid-cols-2 gap-6">
        <Link
          href="/blog"
          className="ornament-border rounded-lg p-6 bg-alterun-bg-card hover:border-alterun-gold/30 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg group"
        >
          <h2 className="font-display text-xl text-alterun-gold uppercase tracking-wider mb-2 group-hover:text-alterun-gold-muted transition-colors duration-200">
            Blog
          </h2>
          <p className="text-alterun-muted text-xl">
            News, updates, and musings from the world of Alterun.
          </p>
        </Link>
        <Link
          href="/codex"
          className="ornament-border rounded-lg p-6 bg-alterun-bg-card hover:border-alterun-gold/30 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg group"
        >
          <h2 className="font-display text-xl text-alterun-gold uppercase tracking-wider mb-2 group-hover:text-alterun-gold-muted transition-colors duration-200">
            Codex
          </h2>
          <p className="text-alterun-muted text-xl">
            The Codex — people, places, factions, and lore of Alterun.
          </p>
        </Link>
      </section>
      </div>
    </>
  );
}
