import type { NextConfig } from "next";
const isProd = process.env.NODE_ENV === "production";

const nextConfig: NextConfig = {
  /* config options here */
  basePath: isProd ? "/PO_Website" : "",
  assetPrefix: isProd ? "/PO_Website/" : "",
  // trailingSlash: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  compiler: {
    removeConsole: isProd ? { exclude: ["error", "warn"] } : false, // ❌ ปิดการลบ console ตอน dev
  },
};

export default nextConfig;
