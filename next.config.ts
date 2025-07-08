import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  turbopack: {
    resolveAlias: {
      "@": "./",
      "~": "./",
    },
  },
  // 開発時はTypeScriptエラーを無視
  typescript: {
    ignoreBuildErrors: process.env.NODE_ENV === 'development',
  },
  // 開発時はESLintエラーを無視
  eslint: {
    ignoreDuringBuilds: process.env.NODE_ENV === 'development',
  },
};

export default nextConfig;
