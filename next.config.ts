import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  turbopack: {
    root: path.resolve(__dirname),
  },
  typescript: {
    // Ignore type errors during build due to parent folder lockfile pollution
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
