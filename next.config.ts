import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  swcMinify: true,
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: []
  }
};

export default nextConfig;
