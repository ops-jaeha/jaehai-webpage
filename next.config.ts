import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      "avatars.githubusercontent.com",
      "raw.githubusercontent.com",
      "www.notion.so",
      "notion.so",
      "images.unsplash.com",
      "abs.twimg.com",
      "pbs.twimg.com",
      "s3.us-west-2.amazonaws.com",
    ],
    // formats: ["image/avif", "image/webp"],
  },
  staticPageGenerationTimeout: 300,
};

export default nextConfig;
