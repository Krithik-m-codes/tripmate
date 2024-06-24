import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "verify-code-bg":
          "url('https://res.cloudinary.com/krithik/image/upload/v1719166705/view-3d-airplane-with-travel-destination-landscape_qz7kfb.jpg')",
        "verify-code-bg-mobile": "url('https://res.cloudinary.com/krithik/image/upload/v1719166704/2150849207_soncsu.jpg')"
      },
    },
  },
  plugins: [],
};
export default config;
