// Данные компании для метаданных, sitemap и разметки schema.org.
// Офис в Ташкенте, работаем по всему Узбекистану.
// ЗАМЕНИТЬ: домен (или задайте NEXT_PUBLIC_SITE_URL). Контакты на сайте — только телефон, Telegram и Instagram.

export const site = {
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "https://pcwizard.uz").replace(/\/$/, ""),
  name: "PcWizard_uz",
  locale: "ru_RU",
  phone: "+998903492884",
  city: "Ташкент",
  country: "UZ",
  logo: "/brand/logo.png",
  socials: ["https://t.me/PcWizard_uz", "https://instagram.com/PcWizard_uz"],
  telegram: "https://t.me/PcWizard_uz",
};

export const absoluteUrl = (path = "/") => `${site.url}${path === "/" ? "" : path}`;

/** Serialises JSON-LD for a <script> tag, escaping "<" so the payload can't close the tag. */
export const toJsonLd = (data: object) => JSON.stringify(data).replace(/</g, "\\u003c");

/** schema.org ComputerStore (a LocalBusiness subtype) for the whole site. */
export function localBusinessLd() {
  return {
    "@context": "https://schema.org",
    "@type": "ComputerStore",
    "@id": `${site.url}/#business`,
    name: site.name,
    url: site.url,
    logo: absoluteUrl(site.logo),
    image: absoluteUrl(site.logo),
    telephone: site.phone,
    description: "Сборка компьютеров на заказ, продажа комплектующих, апгрейд, ремонт и диагностика ПК. Работаем по всему Узбекистану.",
    address: { "@type": "PostalAddress", addressLocality: site.city, addressCountry: site.country },
    areaServed: { "@type": "Country", name: "Узбекистан" },
    sameAs: site.socials,
    priceRange: "$$",
  };
}

export function faqLd(items: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((i) => ({
      "@type": "Question",
      name: i.q,
      acceptedAnswer: { "@type": "Answer", text: i.a },
    })),
  };
}

export function breadcrumbLd(trail: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((t, i) => ({ "@type": "ListItem", position: i + 1, name: t.name, item: absoluteUrl(t.path) })),
  };
}
