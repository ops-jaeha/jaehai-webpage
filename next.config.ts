import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      'avatars.githubusercontent.com',
      'raw.githubusercontent.com',
      'api.github.com',
      'www.notion.so',
      'notion.so',
      'images.unsplash.com',
      'abs.twimg.com',
      'pbs.twimg.com',
      's3.us-west-2.amazonaws.com',
      'prod-files-secure.s3.us-west-2.amazonaws.com',
      'file.notion.so',
    ],
    formats: ['image/avif', 'image/webp'],
  },
  staticPageGenerationTimeout: 300,
};

export default nextConfig;
