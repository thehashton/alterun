import type { Meta, StoryObj } from "@storybook/react";
import { ContentDivider } from "./ContentDivider";

const meta: Meta<typeof ContentDivider> = {
  title: "Components/ContentDivider",
  component: ContentDivider,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
  argTypes: {
    variant: {
      options: ["default", "crowned", "stone"],
      control: "select",
    },
  },
};

export default meta;

type Story = StoryObj<typeof ContentDivider>;

export const Default: Story = {
  args: { variant: "default" },
};

export const Crowned: Story = {
  args: { variant: "crowned" },
};

export const Stone: Story = {
  args: { variant: "stone" },
};

export const WithSpacing: Story = {
  args: { className: "my-12" },
};

export const BetweenSections: Story = {
  render: () => (
    <div className="min-h-screen bg-alterun-bg py-8">
      <div className="max-w-2xl mx-auto px-4 text-center">
        <p className="text-alterun-muted text-xl">
          First section of content above the divider.
        </p>
      </div>
      <ContentDivider className="my-10" />
      <div className="max-w-2xl mx-auto px-4 text-center">
        <p className="text-alterun-muted text-xl">
          Second section below the divider.
        </p>
      </div>
    </div>
  ),
};
