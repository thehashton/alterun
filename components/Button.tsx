"use client";

import Link from "next/link";
import Image from "next/image";
import borderBottomCentralImg from "@/images/border-bottom-central.png";
import buttonStoneVinesImg from "@/images/button-stone-vines.png";
import buttonStoneVinesCrownImg from "@/images/button-stone-vines-crown.png";

const IMAGE_VARIANTS = ["codex", "stoneVines", "stoneVinesCrown"] as const;
type ImageVariant = (typeof IMAGE_VARIANTS)[number];

const STYLE_VARIANTS = ["primary", "secondary", "danger", "ghost", "search", "login"] as const;
type StyleVariant = (typeof STYLE_VARIANTS)[number];

export type ButtonVariant = StyleVariant | ImageVariant;

const styleVariantClasses: Record<StyleVariant, string> = {
  primary:
    "btn-hover rounded border border-alterun-gold/40 bg-alterun-gold/10 px-4 py-2 text-base font-display uppercase tracking-wider text-alterun-gold transition-[border-color,background-color,color] duration-200 hover:border-alterun-gold hover:bg-alterun-gold/25",
  secondary:
    "btn-hover rounded border border-alterun-border bg-alterun-bg-card px-4 py-2 text-base text-alterun-muted transition-[border-color,background-color,color] duration-200 hover:border-alterun-gold/50 hover:bg-alterun-gold/10 hover:text-alterun-gold",
  danger:
    "btn-hover rounded border border-red-500/50 bg-red-500/10 px-4 py-2 text-base text-red-400 hover:bg-red-500/20 hover:border-red-500/70 hover:shadow-md",
  ghost:
    "btn-hover rounded border border-alterun-border px-4 py-2 text-base text-alterun-muted hover:border-alterun-gold/30 hover:text-alterun-gold/90",
  search:
    "btn-hover rounded border border-alterun-gold/50 bg-alterun-gold/15 px-4 py-2.5 font-display text-base uppercase tracking-wider text-alterun-gold hover:bg-alterun-gold/25 hover:shadow-[0_0_12px_rgba(201,162,39,0.12)] hover:border-alterun-gold/60",
  login:
    "btn-hover w-full py-2.5 px-4 bg-alterun-gold/20 border border-alterun-gold/50 text-base text-alterun-gold uppercase tracking-wider rounded hover:bg-alterun-gold/30 hover:border-alterun-gold/60 hover:shadow-md",
};

const imageVariantAssets: Record<
  ImageVariant,
  { src: typeof borderBottomCentralImg; wrapperClass: string; sizes: string }
> = {
  codex: {
    src: borderBottomCentralImg,
    wrapperClass:
      "border-button-press-inline relative flex h-24 w-[28rem] max-w-[95vw] items-center justify-center overflow-hidden rounded-sm bg-alterun-bg-card/50 shadow-[0_2px_8px_rgba(0,0,0,0.4)] sm:h-28 sm:w-[40rem] sm:max-w-[95vw]",
    sizes: "min(28rem, 95vw)",
  },
  stoneVines: {
    src: buttonStoneVinesImg,
    wrapperClass:
      "border-button-press-inline relative flex h-[4.5rem] w-56 min-w-[12rem] items-center justify-center overflow-hidden rounded-sm bg-alterun-bg-card/50 shadow-[0_2px_8px_rgba(0,0,0,0.4)] sm:h-20 sm:w-64",
    sizes: "16rem",
  },
  stoneVinesCrown: {
    src: buttonStoneVinesCrownImg,
    wrapperClass:
      "border-button-press-inline relative flex h-[4.5rem] w-56 min-w-[12rem] items-center justify-center overflow-hidden rounded-sm bg-alterun-bg-card/50 shadow-[0_2px_8px_rgba(0,0,0,0.4)] sm:h-20 sm:w-64",
    sizes: "16rem",
  },
};

/** Normalize label for image buttons: handle empty, whitespace, or non-string children. */
function getImageButtonLabel(children: React.ReactNode): string {
  if (children == null) return "Button";
  if (typeof children === "string") {
    const t = children.trim();
    return t.length > 0 ? t : "Button";
  }
  if (typeof children === "number") return String(children);
  return "Button";
}

type BaseProps = {
  variant?: ButtonVariant;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
};

type ButtonAsButton = BaseProps & {
  href?: undefined;
  type?: "button" | "submit";
  onClick?: () => void;
};

type ButtonAsLink = BaseProps & {
  href: string;
  type?: undefined;
  onClick?: undefined;
};

export type ButtonProps = ButtonAsButton | ButtonAsLink;

export function Button({
  variant = "primary",
  children,
  className = "",
  disabled = false,
  href,
  type = "button",
  onClick,
}: ButtonProps) {
  const isImageVariant = IMAGE_VARIANTS.includes(variant as ImageVariant);
  const imageVariant = isImageVariant ? (variant as ImageVariant) : null;

  if (imageVariant) {
    const asset = imageVariantAssets[imageVariant];
    const label = getImageButtonLabel(children);
    const textShadow =
      "0 0 12px rgba(201,162,39,0.6), 0 0 4px rgba(0,0,0,1), 0 1px 4px rgba(0,0,0,0.95), 0 2px 8px rgba(0,0,0,0.7)";

    const isStoneVariant = imageVariant === "stoneVines" || imageVariant === "stoneVinesCrown";
    const textWrapperClass =
      "absolute inset-0 z-10 flex items-center justify-center p-3 sm:p-4";
    const textClass = isStoneVariant
      ? "font-display text-sm font-semibold uppercase tracking-widest text-alterun-gold sm:text-base leading-tight text-center break-words line-clamp-2 max-w-full"
      : "font-display text-xl font-semibold uppercase tracking-widest text-alterun-gold sm:text-2xl text-center truncate max-w-full";

    const content = (
      <>
        <Image
          src={asset.src}
          alt=""
          fill
          className="object-contain object-center"
          sizes={asset.sizes}
          priority={false}
        />
        <div className={textWrapperClass}>
          <span className={textClass} style={{ textShadow }} title={label.length > 20 ? label : undefined}>
            {label}
          </span>
        </div>
      </>
    );

    if (href) {
      return (
        <Link href={href} className={`${asset.wrapperClass} ${className}`} aria-label={label}>
          {content}
        </Link>
      );
    }
    return (
      <button type={type} className={`${asset.wrapperClass} ${className}`} onClick={onClick} disabled={disabled} aria-label={label}>
        {content}
      </button>
    );
  }

  const styleClass = styleVariantClasses[variant as StyleVariant];
  const combinedClass = `inline-flex items-center justify-center gap-2 ${styleClass} ${className}`.trim();

  if (href) {
    return (
      <Link href={href} className={combinedClass}>
        {children}
      </Link>
    );
  }
  return (
    <button type={type} className={combinedClass} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
}
