"use client";

import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

export function LocaleSwitcher() {
  const t = useTranslations("nav");
  const locale = useLocale();
  const pathname = usePathname();

  return (
    <nav aria-label={t("language")}>
      <ul className="flex gap-2 uppercase">
        {routing.locales.map((l) => (
          <li key={l}>
            <Link
              href={pathname}
              locale={l}
              aria-current={l === locale ? "true" : undefined}
              className={
                l === locale ? "font-semibold" : "text-muted-foreground"
              }
            >
              {l}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
