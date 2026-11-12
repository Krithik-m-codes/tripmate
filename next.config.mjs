import withSerwistInit from "@serwist/next";

const withSerwist = withSerwistInit({
  swSrc: "src/app/sw.ts",
  swDest: "public/sw.js",
  disable: process.env.NODE_ENV === "development",
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "pixabay.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "cdn.pixabay.com",
      },
      {
        protocol: "https",
        hostname: "eu.ui-avatars.com",
      },
      {
        protocol: "https",
        hostname: "api.mapbox.com",
      },
      {
        protocol: "https",
        hostname: "source.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "i.pinimg.com",
      },
      {
        protocol: "https",
        hostname: "img.icons8.com",
      },
    ],
  },
  env: {
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
  },
  transpilePackages: ["@react-pdf/renderer"],
  serverExternalPackages: ["@react-email/render", "@react-email/components", "prettier"],
  async redirects() {
    return [
      { source: "/map", destination: "/explore/map", permanent: true },
      { source: "/directions", destination: "/explore/directions", permanent: true },
      { source: "/saved-places", destination: "/explore/saved", permanent: true },
      {
        source: "/recent-generated-itineraries",
        destination: "/planner/recent",
        permanent: true,
      },
      { source: "/recents-history", destination: "/history/search", permanent: true },
      {
        source: "/ai-trip-planner",
        destination: "/planner/ai-generator",
        permanent: true,
      },
      { source: "/profile", destination: "/settings/profile", permanent: true },
    ];
  },
};

export default withSerwist(nextConfig);
