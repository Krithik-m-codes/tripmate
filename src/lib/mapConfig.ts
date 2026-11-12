import type { UserPlan } from "@/lib/plan";

export interface MapStyleOption {
  id: string;
  label: string;
  description: string;
  url: string;
  emoji: string;
}

export const OPEN_MAP_STYLES: MapStyleOption[] = [
  {
    id: "liberty",
    label: "Standard Liberty",
    description: "Full-featured OpenStreetMap vector style",
    url: "https://tiles.openfreemap.org/styles/liberty",
    emoji: "🗺️",
  },
  {
    id: "bright",
    label: "Vibrant Bright",
    description: "Colorful, high-contrast streets & parks",
    url: "https://tiles.openfreemap.org/styles/bright",
    emoji: "✨",
  },
  {
    id: "positron",
    label: "Minimal Light",
    description: "Clean grey & white CartoDB Positron style",
    url: "https://tiles.openfreemap.org/styles/positron",
    emoji: "☀️",
  },
  {
    id: "dark",
    label: "Dark Matter",
    description: "Sleek night-time map for low-light environments",
    url: "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json",
    emoji: "🌙",
  },
  {
    id: "voyager",
    label: "Voyager",
    description: "CartoDB Voyager exploration style",
    url: "https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json",
    emoji: "🧭",
  },
];

export const FREE_STYLES = OPEN_MAP_STYLES;
export const PRO_STYLES = OPEN_MAP_STYLES;

export function getStylesForPlan(_plan?: UserPlan | string): MapStyleOption[] {
  // All open-source high-performance styles available to all users without API keys
  return OPEN_MAP_STYLES;
}

export function getDefaultStyleUrl(_plan?: UserPlan | string): string {
  return OPEN_MAP_STYLES[0].url;
}
