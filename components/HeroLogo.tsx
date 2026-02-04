"use client";

import Image from "next/image";
import logoDetailed from "@/images/alterun-logo-detailed-no-bg.png";
import { useMemo, useState, useCallback } from "react";
import { playGemSound } from "@/lib/gemSound";

/* Beam angles in different directions — irregular spread like fire */
const BEAM_ANGLES = [0, 42, 78, 115, 155, 198, 235, 272, 310, 348];

export function HeroLogo() {
  const [gemOn, setGemOn] = useState(true);
  const delay = useMemo(() => `${Math.random() * 20}s`, []);
  const beamsDelay = useMemo(() => `${4 + Math.random() * 10}s`, []);

  const handleGemClick = useCallback(() => {
    playGemSound();
    setGemOn((on) => !on);
  }, []);

  const shineMaskStyle = useMemo(
    () => ({
      animationDelay: delay,
      maskImage: `url(${logoDetailed.src})`,
      WebkitMaskImage: `url(${logoDetailed.src})`,
      maskSize: "contain",
      WebkitMaskSize: "contain",
      maskPosition: "center",
      WebkitMaskPosition: "center",
      maskRepeat: "no-repeat",
      WebkitMaskRepeat: "no-repeat",
    }),
    [delay]
  );

  const logoMaskStyle = useMemo(
    () => ({
      maskImage: `url(${logoDetailed.src})`,
      WebkitMaskImage: `url(${logoDetailed.src})`,
      maskSize: "contain",
      WebkitMaskSize: "contain",
      maskPosition: "center",
      WebkitMaskPosition: "center",
      maskRepeat: "no-repeat",
      WebkitMaskRepeat: "no-repeat",
    }),
    []
  );

  return (
    <div className="relative mx-auto mb-2 w-full max-w-[52rem] aspect-[2/1] min-h-[16rem] overflow-hidden">
      <Image
        src={logoDetailed}
        alt="Alterun"
        fill
        sizes="95vw"
        className="object-contain object-center"
        priority
      />
      <div
        className="hero-logo-shine absolute inset-0 pointer-events-none"
        style={shineMaskStyle}
      />
      <div
        className="hero-green-glow absolute inset-0 pointer-events-none"
        style={logoMaskStyle}
        aria-hidden
      />
      <div
        className={`hero-gem-dark absolute pointer-events-none transition-opacity duration-300 ${!gemOn ? "hero-gem-dark-visible" : ""}`}
        aria-hidden
      />
      <div
        className={`hero-gem-glow absolute pointer-events-none transition-opacity duration-300 ${!gemOn ? "hero-gem-off" : ""}`}
        aria-hidden
      />
      <div
        className={`hero-gem-beams absolute pointer-events-none transition-opacity duration-300 ${!gemOn ? "hero-gem-off" : ""}`}
        aria-hidden
        style={{ animationDelay: beamsDelay }}
      >
        {BEAM_ANGLES.map((angle, i) => (
          <div
            key={i}
            className="hero-gem-beam"
            style={{ ["--beam-rot" as string]: `${angle}deg` }}
          />
        ))}
      </div>
      <button
        type="button"
        onClick={handleGemClick}
        className="hero-gem-hit absolute rounded-full cursor-pointer"
        aria-label={gemOn ? "Turn gem off" : "Turn gem on"}
      />
    </div>
  );
}
