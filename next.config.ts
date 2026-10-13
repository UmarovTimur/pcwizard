import type { NextConfig } from "next";
import { withPayload } from "@payloadcms/next/withPayload";

const nextConfig: NextConfig = {
  output: "standalone",
  // Let phones on the local network open the dev server (http://192.168.x.x:3000):
  // without this Next blocks /_next dev resources and the page loads with no JS.
  allowedDevOrigins: ["192.168.0.122", "192.168.*.*"],
};

// Payload CMS (admin panel at /admin) runs inside this Next app.
export default withPayload(nextConfig, { devBundleServerPackages: false });
