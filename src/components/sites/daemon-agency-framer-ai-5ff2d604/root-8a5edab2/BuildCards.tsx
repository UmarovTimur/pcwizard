import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { absoluteUrl, site } from "@/lib/site";
import { Cross } from "../shared/primitives";
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

/** Four budget tiers (7 / 10 / 15 / 25 млн сум), each linking to its article. */
export function BuildCards() {
  return (
    <>
      <JsonLd data={buildsLd()} />
      <ul className="relative grid border-y border-line md:grid-cols-4">
        <Cross className="top-0 left-0" />
        <Cross className="top-0 left-full" />
        <Cross className="top-full left-0" />
        <Cross className="top-full left-full" />
        {builds.map((b) => (
          <li key={b.slug} className="border-line max-md:border-b max-md:last:border-b-0 md:border-l md:first:border-l-0">
            <Link href={`/blog/${b.slug}`} className="group flex h-full flex-col gap-5 bg-ink p-[26px] transition-colors hover:bg-white/[0.03]">
              <h3 className="flex flex-col gap-1">
                <span className="neon-fill w-fit font-pixel text-[26px] leading-[34px]" data-text={b.budget}>{b.budget}</span>
                <span className="font-pixel text-[11px] leading-[22px] text-muted uppercase">млн сум</span>
              </h3>
              <p className="font-mono text-[15px] leading-[23px] uppercase">{b.target}</p>
              <dl className="flex flex-col gap-2 text-[15px] leading-[22px] font-light">
                {b.parts.slice(0, 2).map((p) => (
                  <div key={p.part}>
                    <dt className="text-muted">{p.part}</dt>
                    <dd>{p.pick}</dd>
                  </div>
                ))}
              </dl>
              <span className="mt-auto flex items-center gap-2 font-pixel text-[11px] leading-[22px] uppercase">
                Вся сборка
                <ArrowRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-1" strokeWidth={1.25} aria-hidden="true" />
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
