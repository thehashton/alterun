import Link from "next/link";
import Image from "next/image";
import logo from "@/images/Alterun-logo.png";
import headerBgImg from "@/images/alterun-header-bg.png";
import headerBorderImg from "@/images/alterun-header-border.png";
import headerTopBorderImg from "@/images/alterun-top-border.png";
import { SignOutButton } from "@/components/SignOutButton";
import type { User } from "@supabase/supabase-js";

const navLeft = [
  { href: "/", label: "Home" },
  { href: "/blog", label: "Blog" },
];

const navLinkClass =
  "text-lg sm:text-xl uppercase tracking-wider text-alterun-muted hover:text-alterun-gold transition-colors duration-200 whitespace-nowrap";

type Props = {
  user?: User | null;
};

export function Header({ user = null }: Props) {
  return (
    <header className="relative -top-8 -mb-12 backdrop-blur-sm pt-0 mt-0 bg-alterun-header-top overflow-visible">
      <div
        className="w-full h-14 sm:h-14 bg-repeat-x overflow-hidden bg-alterun-header-top [box-shadow:inset_0_1px_0_0_var(--color-bg-header-top)]"
        style={{
          backgroundImage: `url(${headerBorderImg.src})`,
          backgroundSize: "auto 280%",
          backgroundPosition: "center 24%",
        }}
        aria-hidden
      />
      <div className="relative w-full min-h-[5rem] sm:min-h-[6rem] flex items-center justify-center overflow-hidden pb-0">
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
        <div className="relative z-10 max-w-5xl w-full mx-auto px-3 sm:px-6 flex items-center min-h-[5rem] sm:min-h-[6rem] py-3 sm:py-4 gap-2 sm:gap-0 min-w-0">
        <nav className="flex-1 min-w-0 flex items-center justify-start gap-3 sm:gap-8">
          {navLeft.map(({ href, label }) => (
            <Link key={href} href={href} className={navLinkClass}>
              {label}
            </Link>
          ))}
        </nav>
        <Link
          href="/"
          aria-label="Alterun – Home"
          className="relative h-[2.75rem] w-28 sm:h-20 sm:w-64 hover:opacity-90 transition-opacity flex-shrink-0 flex items-center justify-center mx-2 sm:mx-4 overflow-hidden"
        >
          <Image
            src={logo}
            alt="Alterun"
            fill
            sizes="(max-width: 640px) 7rem, 16rem"
            className="object-contain object-center"
            priority
          />
          <div
            className="header-logo-shine absolute inset-0 pointer-events-none"
            style={{
              maskImage: `url(${logo.src})`,
              WebkitMaskImage: `url(${logo.src})`,
              maskSize: "contain",
              WebkitMaskSize: "contain",
              maskPosition: "center",
              WebkitMaskPosition: "center",
              maskRepeat: "no-repeat",
              WebkitMaskRepeat: "no-repeat",
            }}
            aria-hidden
          />
        </Link>
        <nav className="flex-1 min-w-0 flex items-center justify-end gap-3 sm:gap-8">
          {user ? (
            <SignOutButton label="Logout" className={navLinkClass} />
          ) : (
            <Link href="/admin/login" className={navLinkClass}>
              Login
            </Link>
          )}
        </nav>
        </div>
      </div>
      <div className="relative w-full h-10 sm:h-14 -mt-3 sm:-mt-4 overflow-visible">
        <div
          className="absolute inset-0 z-0 w-full h-full bg-repeat-x bg-bottom"
          style={{
            backgroundImage: `url(${headerTopBorderImg.src})`,
            backgroundSize: "auto 100%",
            backgroundPositionX: "center",
          }}
          aria-hidden
        />
      </div>
    </header>
  );
}
