/**
 * Full-width ornate divider (roots/vines/stone) used to separate content areas.
 * Variants: default (top border), crowned, stone.
 */
import headerTopBorderImg from "@/images/alterun-top-border.png";
import crownedDividerImg from "@/images/crowned-divider.png";
import stoneDividerImg from "@/images/stone-divider.png";

const DIVIDER_IMAGES = {
  default: headerTopBorderImg,
  crowned: crownedDividerImg,
  stone: stoneDividerImg,
} as const;

export type ContentDividerVariant = keyof typeof DIVIDER_IMAGES;

type Props = {
  /** Which divider image to use. */
  variant?: ContentDividerVariant;
  /** Optional extra spacing; e.g. "my-8" or "mt-6 mb-10" */
  className?: string;
};

export function ContentDivider({
  variant = "default",
  className = "",
}: Props) {
  const img = DIVIDER_IMAGES[variant];
  return (
    <div
      className={`relative w-full h-10 sm:h-14 overflow-visible ${className}`.trim()}
      role="presentation"
      aria-hidden
    >
      <div
        className="absolute inset-0 z-0 w-full h-full bg-repeat-x bg-bottom bg-alterun-header-top"
        style={{
          backgroundImage: `url(${img.src})`,
          backgroundSize: "auto 100%",
          backgroundPositionX: "center",
        }}
      />
    </div>
  );
}
