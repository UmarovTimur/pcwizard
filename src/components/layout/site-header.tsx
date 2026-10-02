import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { LocaleSwitcher } from "./locale-switcher";

const NAV = ["catalog", "reviews", "about", "contacts"] as const;

export function SiteHeader() {
  const t = useTranslations("nav");

  return (
    <header className="border-b">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-4">
        <Link href="/" className="font-semibold">
          PC Wizard
        </Link>
        <nav>
          <ul className="flex flex-wrap gap-4">
            {NAV.map((key) => (
              <li key={key}>
                <a href={`#${key}`}>{t(key)}</a>
              </li>
            ))}
          </ul>
        </nav>
        <LocaleSwitcher />
      </div>
    </header>
  );
}
