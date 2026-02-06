import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./.storybook/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontSize: {
        xs: ["1rem", { lineHeight: "1.5rem" }],
        sm: ["1rem", { lineHeight: "1.5rem" }],
      },
      colors: {
        alterun: {
          bg: "var(--color-bg)",
          "bg-elevated": "var(--color-bg-elevated)",
          "bg-header-top": "var(--color-bg-header-top)",
          "bg-card": "var(--color-bg-card)",
          border: "var(--color-border)",
          "border-muted": "var(--color-border-muted)",
          gold: "var(--color-gold)",
          "gold-muted": "var(--color-gold-muted)",
          accent: "var(--color-accent)",
          muted: "var(--color-muted)",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "serif"],
        body: ["var(--font-body)", "serif"],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
      },
      keyframes: {
        "lightbox-overlay": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "lightbox-overlay-out": {
          "0%": { opacity: "1" },
          "100%": { opacity: "0" },
        },
        "lightbox-content": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "lightbox-content-out": {
          "0%": { opacity: "1" },
          "100%": { opacity: "0" },
        },
      },
      animation: {
        "lightbox-overlay": "lightbox-overlay 0.25s ease-out forwards",
        "lightbox-overlay-out": "lightbox-overlay-out 0.2s ease-in forwards",
        "lightbox-content": "lightbox-content 0.3s ease-out 0.05s both",
        "lightbox-content-out": "lightbox-content-out 0.2s ease-in forwards",
      },
    },
  },
  plugins: [],
};
export default config;
