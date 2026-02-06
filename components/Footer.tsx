import Link from "next/link";
import headerBgImg from "@/images/alterun-header-bg.png";
import headerTopBorderImg from "@/images/alterun-top-border.png";

const footerLinks = [
  { href: "/", label: "Home" },
  { href: "/blog", label: "Blog" },
  { href: "/codex", label: "Codex" },
  { href: "/admin", label: "Admin" },
];

const linkClass =
  "text-xl uppercase tracking-wider text-alterun-muted hover:text-alterun-gold transition-colors duration-200";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative mt-auto overflow-visible">
      {/* Ornate border at top — separates footer from content above */}
      <div className="relative w-full h-10 sm:h-14 overflow-visible">
        <div
          className="absolute inset-0 z-0 w-full h-full bg-repeat-x bg-bottom bg-alterun-header-top"
          style={{
            backgroundImage: `url(${headerTopBorderImg.src})`,
            backgroundSize: "auto 100%",
            backgroundPositionX: "center",
          }}
          aria-hidden
        />
      </div>
      {/* Marble dark band below — links and copyright */}
      <div className="relative w-full min-h-[4rem] sm:min-h-[5rem] flex items-center justify-center overflow-hidden bg-alterun-header-top">
        <div
          className="absolute inset-0 z-0 bg-alterun-bg-elevated"
          style={{
            backgroundImage: `url(${headerBgImg.src})`,
            backgroundSize: "cover",
            backgroundPosition: "center center",
          }}
        />
        <div
          className="header-space-bg absolute inset-0 z-[1] pointer-events-none"
          aria-hidden
        />
        <div className="relative z-10 max-w-5xl w-full mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 py-8 sm:py-10">
          <nav className="flex flex-wrap items-center justify-center gap-4 sm:gap-8" aria-label="Footer navigation">
            {footerLinks.map(({ href, label }) => (
              <Link key={href} href={href} className={linkClass}>
                {label}
              </Link>
            ))}
          </nav>
          <p className="text-alterun-muted/90 text-xl font-display uppercase tracking-wider">
            © {year} Alterun
          </p>
        </div>
      </div>
    </footer>
  );
}
