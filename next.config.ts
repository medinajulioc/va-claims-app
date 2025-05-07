import type { NextConfig } from "next";

import { config } from "dotenv";

config();

const isProduction = process.env.NODE_ENV === "production";

const nextConfig: NextConfig = {
  assetPrefix: isProduction ? process.env.DASHBOARD_BASE_URL : undefined,
  reactStrictMode: true,
  // This will suppress the hydration warning caused by browser extensions like LastPass
  // that inject HTML into the DOM, causing hydration mismatches
  onDemandEntries: {
    // Keep pages in memory longer to avoid hydration errors
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 4
  },
  // Configure React to suppress hydration warnings
  compiler: {
    styledComponents: true
  },
  // Runtime configuration to suppress certain React warnings
  webpack(config) {
    return {
      ...config,
      resolve: {
        ...config.resolve,
        fallback: {
          ...config.resolve?.fallback,
          fs: false,
          net: false,
          tls: false
        }
      }
    };
  },
  env: {
    // To use environment variables in the project without using the "NEXT_PUBLIC_" prefix
    BASE_URL: process.env.BASE_URL,
    DASHBOARD_BASE_URL: process.env.DASHBOARD_BASE_URL,
    ASSETS_URL: process.env.ASSETS_URL,
    GA_KEY: process.env.GA_KEY
  },
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost"
      },
      {
        protocol: "https",
        hostname: "dashboard.shadcnuikit.com"
      },
      {
        protocol: "https",
        hostname: "bundui-images.netlify.app"
      }
    ]
  },
  mcpServers: {
    context7: {
      command: "npx",
      args: ["-y", "@upstash/context7-mcp@latest"]
    }
  }
};

export default nextConfig;
