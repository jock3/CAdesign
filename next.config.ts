import type { NextConfig } from "next";
const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
  basePath: "/CAdesign",
  assetPrefix: "/CAdesign/",
  trailingSlash: true,
};
export default nextConfig;
