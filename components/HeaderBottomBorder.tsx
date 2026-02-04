import headerTopBorderImg from "@/images/alterun-top-border.png";

/**
 * Rendered outside the header so the hero logo (in main) can sit above it via z-index.
 * Layout: bottom border (z-30) < main/hero (z-40) < header (z-50).
 */
export function HeaderBottomBorder() {
  return (
    <div
      className="w-full h-10 sm:h-14 bg-repeat-x bg-bottom -mt-3 sm:-mt-4 relative z-30"
      style={{
        backgroundImage: `url(${headerTopBorderImg.src})`,
        backgroundSize: "auto 100%",
        backgroundPositionX: "center",
      }}
      aria-hidden
    />
  );
}
