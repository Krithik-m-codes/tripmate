export const SITE_URL = "https://tripmate.xride-labs.in";
export const SITE_NAME = "TripMate";
export const SITE_TITLE =
  "TripMate — Open-source, MCP-native AI trip planner";
export const SITE_DESCRIPTION =
  "Open-source, MCP-native AI trip planner. Give Claude Desktop, Cursor, or Claude Code live travel tools and get structured, editable itineraries.";

export const GITHUB_REPO = "Krithik-m-codes/tripmate";
export const GITHUB_URL = `https://github.com/${GITHUB_REPO}`;
export const LICENSE_URL = `${GITHUB_URL}/blob/main/LICENSE`;
export const MCP_DOCS_URL = `${GITHUB_URL}/blob/main/mcp/README.md`;
export const ROADMAP_URL = `${GITHUB_URL}/blob/main/ROADMAP.md`;
export const ISSUES_URL = `${GITHUB_URL}/issues`;
export const RELEASES_URL = `${GITHUB_URL}/releases`;

export const OG_ALT =
  "TripMate — open-source, MCP-native trip planning for AI agents";

export const NAV_LINKS = [
  { label: "How it works", href: "/#how-it-works" },
  { label: "Features", href: "/#features" },
  { label: "Proof", href: "/#proof" },
  { label: "FAQ", href: "/#faq" },
] as const;

export const FOOTER_LINKS = {
  product: [
    { label: "How it works", href: "/#how-it-works" },
    { label: "Features", href: "/#features" },
    { label: "FAQ", href: "/#faq" },
    { label: "Start free", href: "/sign-up" },
  ],
  developers: [
    { label: "GitHub", href: GITHUB_URL, external: true },
    { label: "MCP server", href: MCP_DOCS_URL, external: true },
    { label: "MIT license", href: LICENSE_URL, external: true },
    { label: "Roadmap", href: ROADMAP_URL, external: true },
  ],
  company: [
    { label: "About", href: "/about" },
    { label: "Services", href: "/services" },
    { label: "Request a feature", href: "/request-feature" },
    { label: "llms.txt", href: "/llms.txt" },
  ],
} as const;
