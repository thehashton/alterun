"use client";

import Link from "next/link";
import Image from "next/image";
import borderBottomCentralImg from "@/images/border-bottom-central.png";

/**
 * Rendered in layout with position:fixed and z-[9999]. Uses the central
 * border image and is sized to fit the middle of the bottom border strip.
 */
export function HeaderBorderButton() {
  return (
    <Link
      href="/codex"
      aria-label="Codex"
      className="border-button-press-fixed fixed left-1/2 z-[9999] flex h-24 w-[28rem] max-w-[95vw] items-center justify-center overflow-hidden rounded-sm bg-alterun-bg-card/50 shadow-[0_2px_8px_rgba(0,0,0,0.4)] sm:h-28 sm:w-[40rem] sm:max-w-[95vw]"
      style={{ top: "9.6rem" }}
    >
      <Image
        src={borderBottomCentralImg}
        alt=""
        fill
        className="object-contain object-center"
        sizes="(max-width: 640px) 28rem, 40rem"
        priority={false}
      />
      <span
        className="relative z-10 pt-2.5 font-display text-xl font-semibold uppercase tracking-widest text-alterun-gold sm:text-2xl"
        style={{
          textShadow:
            "0 0 12px rgba(201,162,39,0.6), 0 0 4px rgba(0,0,0,1), 0 1px 4px rgba(0,0,0,0.95), 0 2px 8px rgba(0,0,0,0.7)",
        }}
      >
        Codex
      </span>
    </Link>
  );
}
