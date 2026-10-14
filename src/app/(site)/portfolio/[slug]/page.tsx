import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { absoluteUrl, breadcrumbLd, site } from "@/lib/site";
import { StatusBadge } from "@/components/sites/daemon-agency-framer-ai-5ff2d604/root-8a5edab2/BuildCard";
import { formatBuildPrice, getBuild, works } from "@/components/sites/daemon-agency-framer-ai-5ff2d604/root-8a5edab2/content";
import { Column, InnerShell, RelatedLinks } from "@/components/sites/daemon-agency-framer-ai-5ff2d604/root-8a5edab2/InnerPage";
import { PageHero } from "@/components/sites/daemon-agency-framer-ai-5ff2d604/root-8a5edab2/PageHero";
import { JsonLd } from "@/components/sites/daemon-agency-framer-ai-5ff2d604/shared/JsonLd";
import { PhotoGrid } from "@/components/sites/daemon-agency-framer-ai-5ff2d604/shared/PhotoGrid";
import { KeyButton, ShardBullet } from "@/components/sites/daemon-agency-framer-ai-5ff2d604/shared/primitives";
import { Prose } from "@/components/sites/daemon-agency-framer-ai-5ff2d604/shared/Prose";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return works.projects.map((b) => ({ slug: b.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const build = getBuild((await params).slug);
  if (!build) return {};
  const path = `/portfolio/${build.slug}`;
  const title = `${build.title} — ${build.price.usd}$`;
  return {
    title,
    description: build.summary,
    alternates: { canonical: path },
    openGraph: { title, description: build.summary, url: path, images: [{ url: build.photos[0] }] },
  };
}

export default async function BuildPage({ params }: Props) {
  const build = getBuild((await params).slug);
  if (!build) notFound();

  const path = `/portfolio/${build.slug}`;
  const trail = [
    { name: "Главная", path: "/" },
    { name: "Портфолио", path: "/portfolio" },
    { name: build.name, path },
  ];
  const others = works.projects.filter((b) => b.slug !== build.slug);
  const onSale = build.status === "sale";
  const { price } = build;

  return (
    <InnerShell>
      <JsonLd
        data={[
          breadcrumbLd(trail),
          {
            "@context": "https://schema.org",
            "@type": "Product",
            name: build.title,
            description: build.summary,
            image: build.photos.map((p) => absoluteUrl(p)),
            brand: { "@type": "Brand", name: site.name },
            category: "Игровой компьютер",
            offers: {
              "@type": "Offer",
              price: price.usd,
              priceCurrency: "USD",
              availability: onSale ? "https://schema.org/InStock" : "https://schema.org/SoldOut",
              url: absoluteUrl(path),
              seller: { "@id": `${site.url}/#business` },
            },
          },
        ]}
      />
      <PageHero
        trail={trail}
        title={build.title}
        lead={build.summary}
        bullets={build.highlights}
        meta={
          <div className="flex flex-wrap items-center gap-3">
            <StatusBadge status={build.status} />
            <p className="font-pixel text-[15px] leading-[23px] text-[#4ade80] [text-shadow:0_0_8px_rgba(74,222,128,0.6)]">{formatBuildPrice(price)}</p>
            {price.oldUsd && price.oldUzs && (
              <p className="font-pixel text-[12px] leading-[19px] text-muted line-through">{formatBuildPrice({ usd: price.oldUsd, uzs: price.oldUzs })}</p>
            )}
          </div>
        }
      />

      <Column wide className="pt-10">
        <PhotoGrid title={build.title} photos={build.photos} />
      </Column>

      <Column wide className="pt-[100px]">
        <div className="grid grid-cols-[minmax(0,1fr)] gap-10 lg:grid-cols-[minmax(0,7fr)_minmax(0,4fr)] lg:gap-14 xl:gap-20">
          <Prose
            blocks={[
              { type: "h2", text: "О сборке" },
              ...build.description.map((text) => ({ type: "p" as const, text })),
              { type: "h2", text: "Конфигурация" },
              { type: "table", head: ["Комплектующее", "Модель"], rows: build.specs.map((s) => [s.part, s.value]) },
              ...(build.extras ?? []).flatMap((e) => [
                { type: "h3" as const, text: e.title },
                { type: "ul" as const, items: e.items },
              ]),
            ]}
          />

          {/* Summary: stays in view on desktop while the description and the specs scroll */}
          <aside className="flex flex-col gap-6 border border-line bg-panel p-6 md:p-8 lg:sticky lg:top-24 lg:self-start">
            <div className="flex flex-col gap-3">
              <StatusBadge status={build.status} className="w-fit" />
              <p className="font-pixel text-[17px] leading-[30px] text-[#4ade80] [text-shadow:0_0_8px_rgba(74,222,128,0.6)]">{formatBuildPrice(price)}</p>
            </div>
            <div className="flex flex-col gap-4 border-t border-line pt-6">
              <h2 className="font-pixel text-[13px] leading-[23px] uppercase">Что вы получаете</h2>
              <ul className="flex flex-col gap-2.5">
                {build.notes.map((n) => (
                  <li key={n} className="flex items-start gap-3 text-[17px] leading-[1.45] text-white/85">
                    <ShardBullet className="mt-[5px] h-[14px]" />
                    {n}
                  </li>
                ))}
              </ul>
            </div>
            <p className="border-l-2 border-violet bg-violet/[0.08] px-4 py-3 text-[17px] leading-[1.5] text-white/85">
              {onSale
                ? "Сборка в наличии. Напишите или позвоните — забронируем и покажем компьютер в работе перед покупкой."
                : "Эта сборка уже продана. Соберём такую же или подстроим под ваш бюджет и игры — пришлём смету с актуальными ценами."}
            </p>
            <div data-service={onSale ? undefined : "Сборка ПК на заказ"}>
              <KeyButton href="#contact" tone="accent">
                {onSale ? "Купить эту сборку" : "Хочу похожую"}
              </KeyButton>
            </div>
          </aside>
        </div>
      </Column>

      <Column wide className="pt-[120px]">
        <RelatedLinks title="Другие работы" items={others.map((b) => ({ label: b.name, href: `/portfolio/${b.slug}` }))} />
      </Column>
    </InnerShell>
  );
}
