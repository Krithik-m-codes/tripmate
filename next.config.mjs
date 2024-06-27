/** @type {import('next').NextConfig} */
const nextConfig = {
  exportPathMap: function (
    defaultPathMap,
    { dev, dir, outDir, distDir, buildId }
  ) {
    return {
      ...defaultPathMap,
      "/api/check-username-unique": { page: "/_error" },
      "/api/profile": { page: "/_error" },
      "/api/weather-report": { page: "/_error" },
    };
  },
};

export default nextConfig;
