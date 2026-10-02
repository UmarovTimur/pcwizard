import type { Metadata } from "next";
import { useTranslations } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { use } from "react";
import type { Locale } from "@/i18n/routing";

const OFFER = ["ready", "custom", "consult"] as const;
const CONTACTS = ["phone", "telegram", "address", "hours"] as const;

export async function generateMetadata({
  params,
}: PageProps<"/[locale]">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({
    locale: locale as Locale,
    namespace: "home",
  });
  return { title: { absolute: t("metaTitle") } };
}

export default function HomePage({ params }: PageProps<"/[locale]">) {
  const { locale } = use(params);
  setRequestLocale(locale as Locale);
  const t = useTranslations("home");

  return (
    <div className="space-y-16">
      <section className="space-y-4">
        <h1 className="font-semibold text-4xl">{t("title")}</h1>
        <p className="text-lg text-muted-foreground">{t("lead")}</p>
        <a href="#catalog" className="underline">
          {t("cta")}
        </a>
      </section>

      <section className="space-y-6">
        <h2 className="font-semibold text-2xl">{t("offer.title")}</h2>
        <ul className="grid gap-6 md:grid-cols-3">
          {OFFER.map((key) => (
            <li key={key} className="space-y-2">
              <h3 className="font-medium text-lg">
                {t(`offer.items.${key}.title`)}
              </h3>
              <p className="text-muted-foreground">
                {t(`offer.items.${key}.text`)}
              </p>
            </li>
          ))}
        </ul>
      </section>

      <section id="catalog" className="scroll-mt-6 space-y-4">
        <h2 className="font-semibold text-2xl">{t("catalog.title")}</h2>
        <p className="text-muted-foreground">{t("catalog.lead")}</p>
        <p>{t("catalog.empty")}</p>
      </section>

      <section id="reviews" className="scroll-mt-6 space-y-4">
        <h2 className="font-semibold text-2xl">{t("reviews.title")}</h2>
        <p className="text-muted-foreground">{t("reviews.lead")}</p>
        <p>{t("reviews.empty")}</p>
      </section>

      <section id="about" className="scroll-mt-6 space-y-4">
        <h2 className="font-semibold text-2xl">{t("about.title")}</h2>
        <p>{t("about.text")}</p>
      </section>

      <section id="contacts" className="scroll-mt-6 space-y-4">
        <h2 className="font-semibold text-2xl">{t("contacts.title")}</h2>
        <p className="text-muted-foreground">{t("contacts.lead")}</p>
        <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-2">
          {CONTACTS.map((key) => (
            <div key={key} className="contents">
              <dt className="font-medium">{t(`contacts.${key}`)}</dt>
              <dd className="text-muted-foreground">{t("contacts.tbd")}</dd>
            </div>
          ))}
        </dl>
      </section>
    </div>
  );
}
