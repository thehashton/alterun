import type { Meta, StoryObj } from "@storybook/react";
import {
  IconNewEntry,
  IconCategories,
  IconPlus,
  IconDownload,
} from "./icons";

const meta: Meta = {
  title: "Components/Icons",
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
};

export default meta;

export const AllIcons: StoryObj = {
  render: () => (
    <div className="flex flex-wrap gap-8">
      <div className="flex flex-col items-center gap-2 text-alterun-gold">
        <IconNewEntry className="h-8 w-8" />
        <span className="text-xl font-display">New entry</span>
      </div>
      <div className="flex flex-col items-center gap-2 text-alterun-gold">
        <IconCategories className="h-8 w-8" />
        <span className="text-xl font-display">Categories</span>
      </div>
      <div className="flex flex-col items-center gap-2 text-alterun-gold">
        <IconPlus className="h-8 w-8" />
        <span className="text-xl font-display">Plus</span>
      </div>
      <div className="flex flex-col items-center gap-2 text-alterun-gold">
        <IconDownload className="h-8 w-8" />
        <span className="text-xl font-display">Download</span>
      </div>
    </div>
  ),
};

export const NewEntry: StoryObj = {
  render: () => <IconNewEntry className="h-10 w-10 text-alterun-gold" />,
};

export const Categories: StoryObj = {
  render: () => <IconCategories className="h-10 w-10 text-alterun-gold" />,
};

export const Plus: StoryObj = {
  render: () => <IconPlus className="h-10 w-10 text-alterun-gold" />,
};

export const Download: StoryObj = {
  render: () => <IconDownload className="h-10 w-10 text-alterun-gold" />,
};
