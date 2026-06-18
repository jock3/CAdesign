import type { NextConfig } from "next";
const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
  basePath: "/CAdesign",
  assetPrefix: "/CAdesign/",
};
export default nextConfig;
