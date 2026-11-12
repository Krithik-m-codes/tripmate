import type { MetadataRoute } from "next";
import { statSync } from "node:fs";
import { join } from "node:path";
import { SITE_URL } from "@/lib/site";

/**
 * Uses real source mtimes at build time so `lastModified` is honest.
 * Falls back to the build date if a file is unavailable.
 */
function latestMtime(paths: string[]): Date {
  const newest = paths.reduce((latest, path) => {
    try {
      return Math.max(latest, statSync(join(process.cwd(), path)).mtimeMs);
    } catch {
      return latest;
    }
  }, 0);

  return new Date(newest || Date.now());
}

export default function sitemap(): MetadataRoute.Sitemap {
  const home = latestMtime([
    "src/app/page.tsx",
    "src/components/marketing/Hero.tsx",
    "src/lib/faq.ts",
    "src/lib/site.ts",
  ]);

  return [
    {
      url: `${SITE_URL}/`,
      lastModified: home,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${SITE_URL}/mcp-server`,
      lastModified: latestMtime([
        "src/app/(marketing)/mcp-server/page.tsx",
        "mcp/server.mjs",
        "mcp/lib/travel.mjs",
        "mcp/lib/plan.mjs",
      ]),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/self-hosting`,
      lastModified: latestMtime([
        "src/app/(marketing)/self-hosting/page.tsx",
        "package.json",
        ".env.example",
      ]),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/about`,
      lastModified: latestMtime(["src/app/(marketing)/about/page.tsx"]),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${SITE_URL}/services`,
      lastModified: latestMtime(["src/app/(marketing)/services/page.tsx"]),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${SITE_URL}/request-feature`,
      lastModified: latestMtime(["src/app/(marketing)/request-feature/page.tsx"]),
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];
}
