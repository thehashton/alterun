import type { Meta, StoryObj } from "@storybook/react";
import Image from "next/image";
import headerLogo from "@/images/Alterun-logo.png";
import logoShort from "@/images/alterun-a-short-logo.png";
import logoDetailed from "@/images/alterun-logo-detailed-no-bg.png";

const meta: Meta = {
  title: "Components/Logos",
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
};

export default meta;

export const HeaderLogo: StoryObj = {
  render: () => (
    <div className="relative h-20 w-32 bg-alterun-bg-card p-4 flex items-center justify-center">
      <Image
        src={headerLogo}
        alt="Alterun"
        width={128}
        height={80}
        className="object-contain"
      />
    </div>
  ),
};

export const ShortLogo: StoryObj = {
  render: () => (
    <div className="relative h-24 w-24 bg-alterun-bg-card p-4 flex items-center justify-center">
      <Image
        src={logoShort}
        alt="Alterun"
        width={96}
        height={96}
        className="object-contain"
      />
    </div>
  ),
};

export const DetailedLogo: StoryObj = {
  render: () => (
    <div className="relative max-w-md aspect-[2/1] bg-alterun-bg p-6 flex items-center justify-center">
      <Image
        src={logoDetailed}
        alt="Alterun"
        fill
        className="object-contain"
        sizes="(max-width: 28rem) 100vw, 28rem"
      />
    </div>
  ),
};

export const AllLogos: StoryObj = {
  render: () => (
    <div className="flex flex-col gap-12 items-center">
      <div className="flex flex-col items-center gap-2">
        <span className="text-sm font-display text-alterun-gold uppercase tracking-wider">Header logo</span>
        <div className="relative h-20 w-32 bg-alterun-bg-card p-4 flex items-center justify-center ornament-border rounded">
          <Image src={headerLogo} alt="Alterun" width={128} height={80} className="object-contain" />
        </div>
      </div>
      <div className="flex flex-col items-center gap-2">
        <span className="text-sm font-display text-alterun-gold uppercase tracking-wider">Short (A)</span>
        <div className="relative h-24 w-24 bg-alterun-bg-card p-4 flex items-center justify-center ornament-border rounded">
          <Image src={logoShort} alt="Alterun" width={96} height={96} className="object-contain" />
        </div>
      </div>
      <div className="flex flex-col items-center gap-2">
        <span className="text-sm font-display text-alterun-gold uppercase tracking-wider">Detailed (hero)</span>
        <div className="relative w-72 aspect-[2/1] bg-alterun-bg p-4 flex items-center justify-center ornament-border rounded">
          <Image src={logoDetailed} alt="Alterun" fill className="object-contain" sizes="18rem" />
        </div>
      </div>
    </div>
  ),
};
