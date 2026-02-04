import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "./Button";
import { IconPlus, IconNewEntry, IconDownload } from "./icons";

const meta: Meta<typeof Button> = {
  title: "Components/Button",
  component: Button,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: [
        "primary",
        "secondary",
        "danger",
        "ghost",
        "search",
        "login",
        "codex",
        "stoneVines",
        "stoneVinesCrown",
      ],
      description: "Button style or image-backed variant",
    },
    children: { control: "text" },
    disabled: { control: "boolean" },
  },
};

export default meta;

type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: { variant: "primary", children: "Add entry" },
};

export const PrimaryWithIcon: Story = {
  render: (args) => (
    <Button {...args} variant="primary">
      <IconPlus className="h-5 w-5 flex-shrink-0" />
      Add entry
    </Button>
  ),
  args: { variant: "primary" },
};

export const Secondary: Story = {
  args: { variant: "secondary", children: "Categories" },
};

export const SecondaryWithIcon: Story = {
  render: (args) => (
    <Button {...args} variant="secondary">
      <IconNewEntry className="h-5 w-5 flex-shrink-0" />
      New entry
    </Button>
  ),
  args: { variant: "secondary" },
};

export const Danger: Story = {
  args: { variant: "danger", children: "Delete" },
};

export const Ghost: Story = {
  args: { variant: "ghost", children: "Cancel" },
};

export const Search: Story = {
  args: { variant: "search", children: "Search" },
};

export const Login: Story = {
  args: { variant: "login", children: "Sign in" },
};

export const CodexImage: Story = {
  args: { variant: "codex", children: "Codex" },
};

export const StoneVinesImage: Story = {
  args: { variant: "stoneVines", children: "Enter" },
};

export const StoneVinesCrownImage: Story = {
  args: { variant: "stoneVinesCrown", children: "Chronicle" },
};

export const AllStyleVariants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="danger">Danger</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="search">Search</Button>
      <Button variant="login">Login</Button>
    </div>
  ),
};

export const AllImageVariants: Story = {
  render: () => (
    <div className="flex flex-col items-center gap-8">
      <Button variant="codex">Codex</Button>
      <Button variant="stoneVines">Stone Vines</Button>
      <Button variant="stoneVinesCrown">Stone Vines Crown</Button>
    </div>
  ),
};

export const ImageVariantsLongText: Story = {
  render: () => (
    <div className="flex flex-col items-center gap-8">
      <Button variant="stoneVines">
        The Ancient Stone Vines of the Forgotten Grove
      </Button>
      <Button variant="stoneVinesCrown">
        Stone Vines Crown of the Elder King
      </Button>
      <Button variant="codex">Codex of the Realm and All Its Lore</Button>
    </div>
  ),
};

export const ImageVariantsEmptyOrBad: Story = {
  render: () => (
    <div className="flex flex-col items-center gap-8">
      <Button variant="stoneVines">{""}</Button>
      <Button variant="stoneVinesCrown">   </Button>
      <Button variant="stoneVines">A</Button>
    </div>
  ),
};
