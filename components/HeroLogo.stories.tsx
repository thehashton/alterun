import type { Meta, StoryObj } from "@storybook/react";
import { HeroLogo } from "./HeroLogo";

const meta: Meta<typeof HeroLogo> = {
  title: "Components/HeroLogo",
  component: HeroLogo,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
};

export default meta;

type Story = StoryObj<typeof HeroLogo>;

export const Default: Story = {};
