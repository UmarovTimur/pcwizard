import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { absoluteUrl, breadcrumbLd, site } from "@/lib/site";
import { StatusBadge } from "@/components/sites/daemon-agency-framer-ai-5ff2d604/root-8a5edab2/BuildCard";
import { formatBuildPrice, getBuild, works } from "@/components/sites/daemon-agency-framer-ai-5ff2d604/root-8a5edab2/content";
import { Column, InnerShell, RelatedLinks } from "@/components/sites/daemon-agency-framer-ai-5ff2d604/root-8a5edab2/InnerPage";
import { PageHero } from "@/components/sites/daemon-agency-framer-ai-5ff2d604/root-8a5edab2/PageHero";
import { JsonLd } from "@/components/sites/daemon-agency-framer-ai-5ff2d604/shared/JsonLd";
import { PhotoGrid } from "@/components/sites/daemon-agency-framer-ai-5ff2d604/shared/PhotoGrid";
import { KeyButton } from "@/components/sites/daemon-agency-framer-ai-5ff2d604/shared/primitives";
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
            <p className="font-pixel text-[13px] leading-[20px] text-[#4ade80] [text-shadow:0_0_8px_rgba(74,222,128,0.6)]">{formatBuildPrice(price)}</p>
            {price.oldUsd && price.oldUzs && (
              <p className="font-pixel text-[10px] leading-[16px] text-muted line-through">{formatBuildPrice({ usd: price.oldUsd, uzs: price.oldUzs })}</p>
            )}
          </div>
        }
      />

      <Column wide className="pt-10">
        <PhotoGrid title={build.title} photos={build.photos} />
      </Column>

      <Column className="pt-[100px]">
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
            { type: "h2", text: "Что вы получаете" },
            { type: "ul", items: build.notes },
            {
              type: "note",
              text: onSale
                ? "Сборка в наличии. Напишите или позвоните — забронируем и покажем компьютер в работе перед покупкой."
                : "Эта сборка уже продана. Соберём такую же или подстроим под ваш бюджет и игры — пришлём смету с актуальными ценами.",
            },
          ]}
        />
        <div className="mt-8">
          <KeyButton href="#contact" tone="accent">
            {onSale ? "Купить эту сборку" : "Хочу похожую"}
          </KeyButton>
        </div>
      </Column>

      <Column wide className="pt-[120px]">
        <RelatedLinks title="Другие работы" items={others.map((b) => ({ label: b.name, href: `/portfolio/${b.slug}` }))} />
      </Column>
    </InnerShell>
  );
}
