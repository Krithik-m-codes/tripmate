import type { Config } from "tailwindcss";

// Tailwind v4 — minimal config. Theme tokens live in globals.css @theme block.
const config: Config = {
  // dark mode removed — light-only design
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
};

export default config;
