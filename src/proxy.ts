import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  // Всё, кроме API, служебных путей Next.js и файлов с расширением
  // (robots.txt, sitemap.xml, картинки и т.д.)
  matcher: "/((?!api|_next|_vercel|.*\\..*).*)",
};
