import type { NextConfig } from "next";

const path = require("path");

const nextConfig: NextConfig = {
  /* config options here */
  /** WebPack の設定を追加 */
  webpack: config => {
    // => モジュールのパス解決とエイリアスを設定している。
    config.resolve.alias["@"] = path.resolve(__dirname, "./");
    config.resolve.alias["~"] = path.join(__dirname, "./");
    return config;
  },
};

export default nextConfig;
