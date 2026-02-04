import type { Meta, StoryObj } from "@storybook/react";
import { HeaderBorderButton } from "./HeaderBorderButton";

const meta: Meta<typeof HeaderBorderButton> = {
  title: "Components/HeaderBorderButton",
  component: HeaderBorderButton,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
};

export default meta;

type Story = StoryObj<typeof HeaderBorderButton>;

export const Default: Story = {};
