import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { absoluteUrl, site } from "@/lib/site";
import { JsonLd } from "../shared/JsonLd";
import { builds, formatMln } from "./builds";

/** schema.org Product + Offer for each budget build. */
function buildsLd() {
  return builds.map((b) => ({
    "@context": "https://schema.org",
    "@type": "Product",
    name: `Игровой ПК за ${formatMln(b.budget)}`,
    description: `${b.target}. ${b.parts.map((p) => `${p.part}: ${p.pick}`).join("; ")}.`,
    image: absoluteUrl(site.logo),
    brand: { "@type": "Brand", name: site.name },
    category: "Игровой компьютер",
    offers: {
      "@type": "Offer",
      price: b.budget * 1_000_000,
      priceCurrency: "UZS",
      availability: "https://schema.org/PreOrder",
      url: absoluteUrl(`/blog/${b.slug}`),
      seller: { "@id": `${site.url}/#business` },
    },
  }));
}

/** Four budget tiers (7 / 10 / 15 / 25 млн сум): what each one runs and its key parts; a card links to its article. */
export function BuildCards() {
  return (
    <>
      <JsonLd data={buildsLd()} />
      <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4 xl:gap-5">
        {builds.map((b) => (
          <li key={b.slug}>
            <Link href={`/blog/${b.slug}`} className="group flex h-full flex-col border border-line bg-panel p-6 transition-colors hover:border-violet/60 md:p-7">
              <h3 className="flex items-baseline gap-3">
                <span className="neon-fill font-pixel text-[38px] leading-[1.3] md:text-[44px]" data-text={b.budget}>
                  {b.budget}
                </span>
                <span className="font-pixel text-[12px] leading-[22px] text-muted uppercase">млн сум</span>
              </h3>
              <p className="mt-4 font-display text-[22px] leading-[1.15] uppercase">{b.target}</p>
              <p className="mt-2.5 mb-6 text-[16px] leading-[1.5] text-white/70">{b.games}</p>
              {/* Pinned to the bottom, so the part rows line up across the four cards */}
              <dl className="mt-auto flex flex-col border-t border-line">
                {b.parts.slice(0, 4).map((p) => (
                  <div key={p.part} className="border-b border-line py-2.5">
                    <dt className="font-mono text-[13px] leading-[20px] text-muted">{p.part}</dt>
                    <dd className="text-[16px] leading-[1.4]">{p.pick}</dd>
                  </div>
                ))}
              </dl>
              <span className="mt-7 flex items-center gap-2 font-pixel text-[12px] leading-[22px] uppercase transition-colors group-hover:text-lavender">
                Вся сборка
                <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" strokeWidth={1.5} aria-hidden="true" />
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
