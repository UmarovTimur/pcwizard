import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  // Let phones on the local network open the dev server (http://192.168.x.x:3000):
  // without this Next blocks /_next dev resources and the page loads with no JS.
  allowedDevOrigins: ["192.168.0.122", "192.168.*.*"],
};

export default nextConfig;
