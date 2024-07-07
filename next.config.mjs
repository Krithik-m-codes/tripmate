/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "pixabay.com",
      "images.unsplash.com",
      "cdn.pixabay.com",
      "cdn.pixabay.com",
      "eu.ui-avatars.com",
      "api.mapbox.com",
      "source.unsplash.com",
      "www.holidify.com",
      "i.pinimg.com",
    ],
  },
  env: {
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
  },
};

export default nextConfig;
