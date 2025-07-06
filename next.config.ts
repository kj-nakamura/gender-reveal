import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  turbopack: {
    resolveAlias: {
      "@": "./",
      "~": "./",
    },
  },
};

export default nextConfig;
