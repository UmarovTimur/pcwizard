import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["ru", "uz"],
  defaultLocale: "ru",
  // Префикс всегда в URL (/ru/..., /uz/...) — у каждой языковой версии
  // свой стабильный адрес, что проще для hreflang и статической генерации.
  localePrefix: "always",
});

export type Locale = (typeof routing.locales)[number];
