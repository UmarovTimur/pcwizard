import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  experimental: {
    // app/[locale]/layout.tsx — корневой layout, поэтому 404 для адресов
    // без языка рендерит app/global-not-found.tsx
    globalNotFound: true,
  },
};

export default withNextIntl(nextConfig);
