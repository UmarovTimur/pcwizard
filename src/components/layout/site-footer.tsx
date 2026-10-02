import { useTranslations } from "next-intl";

export function SiteFooter() {
  const t = useTranslations("footer");

  return (
    <footer className="border-t">
      <div className="mx-auto flex max-w-6xl flex-wrap justify-between gap-2 px-4 py-6 text-muted-foreground text-sm">
        <span>{t("tagline")}</span>
        <span>{t("rights", { year: new Date().getFullYear() })}</span>
      </div>
    </footer>
  );
}
