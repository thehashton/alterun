import type { Preview } from "@storybook/react";
import React from "react";
import "../app/globals.css";
import "./preview.css";

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    layout: "centered",
    backgrounds: { disable: true },
    themes: {
      default: "Dark",
      list: [
        { name: "Dark", class: "", color: "#0d0c0b" },
        { name: "Light", class: "storybook-theme-light", color: "#f5f0e8" },
      ],
    },
  },
  decorators: [
    (Story) => (
      <div className="min-h-screen bg-alterun-bg p-6 font-body">
        <Story />
      </div>
    ),
  ],
};

export default preview;
