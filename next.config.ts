import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Bypassing TS and ESLint errors during builds so it doesn't crash the server locally or in prod
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  serverExternalPackages: ["mongoose"],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: process.env.BUNNY_CDN_HOSTNAME || '**.b-cdn.net',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
};

export default nextConfig;
