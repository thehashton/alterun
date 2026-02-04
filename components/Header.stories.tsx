import type { Meta, StoryObj } from "@storybook/react";
import { Header } from "./Header";

const meta: Meta<typeof Header> = {
  title: "Components/Header",
  component: Header,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
  decorators: [
    (Story) => (
      <div className="bg-alterun-bg min-h-screen">
        <Story />
        <div className="p-6 text-alterun-muted">Page content below header.</div>
      </div>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof Header>;

export const LoggedOut: Story = {
  args: { user: null },
};

export const LoggedIn: Story = {
  args: {
    user: {
      id: "story-user-1",
      email: "chronicler@alterun.example",
      aud: "authenticated",
      role: "authenticated",
      created_at: "",
      updated_at: "",
      app_metadata: {},
      user_metadata: {},
    } as any,
  },
};
