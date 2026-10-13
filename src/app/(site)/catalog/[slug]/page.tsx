import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { absoluteUrl, breadcrumbLd, site } from "@/lib/site";
import { getProduct, photosOf } from "@/lib/catalog";
import { CONDITION_LABEL, formatPrice, STOCK_LABEL } from "@/lib/catalog-shared";
import { Column, InnerShell } from "@/components/sites/daemon-agency-framer-ai-5ff2d604/root-8a5edab2/InnerPage";
import { PageHero } from "@/components/sites/daemon-agency-framer-ai-5ff2d604/root-8a5edab2/PageHero";
import { JsonLd } from "@/components/sites/daemon-agency-framer-ai-5ff2d604/shared/JsonLd";
import { PhotoGrid } from "@/components/sites/daemon-agency-framer-ai-5ff2d604/shared/PhotoGrid";
import { KeyButton } from "@/components/sites/daemon-agency-framer-ai-5ff2d604/shared/primitives";
import { Prose } from "@/components/sites/daemon-agency-framer-ai-5ff2d604/shared/Prose";

type Props = { params: Promise<{ slug: string }> };

const AVAILABILITY = { in_stock: "InStock", on_order: "BackOrder", out: "OutOfStock" } as const;

const categoryOf = (p: { category: unknown }) => (p.category && typeof p.category === "object" && "title" in p.category ? String(p.category.title) : null);

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  await connection();
  const product = await getProduct((await params).slug);
  if (!product) return {};
  const path = `/catalog/${product.slug}`;
  const description = [product.summary, formatPrice(product.price), STOCK_LABEL[product.stock]].filter(Boolean).join(" · ");
  const cover = photosOf(product)[0];
  return {
    title: `${product.title} — купить в Ташкенте`,
    description,
    alternates: { canonical: path },
    openGraph: { title: product.title, description, url: path, images: cover?.url ? [{ url: cover.url }] : undefined },
  };
}

export default async function ProductPage({ params }: Props) {
  await connection();
  const product = await getProduct((await params).slug);
  if (!product) notFound();

  const path = `/catalog/${product.slug}`;
  const category = categoryOf(product);
  const trail = [
    { name: "Главная", path: "/" },
    { name: "Каталог", path: "/catalog" },
    { name: product.title, path },
  ];
  const photos = photosOf(product).map((m) => m.sizes?.large?.url ?? m.url!);
  const paragraphs = (product.description ?? "")
    .split(/\n\s*\n/)
    .map((t) => t.trim())
    .filter(Boolean);
  const specs = [
    ...(product.brand ? [["Бренд", product.brand]] : []),
    ...(category ? [["Категория", category]] : []),
    ["Состояние", CONDITION_LABEL[product.condition]],
    ...(product.specs ?? []).map((s) => [s.name, s.value]),
  ];

  return (
    <InnerShell>
      <JsonLd
        data={[
          breadcrumbLd(trail),
          {
            "@context": "https://schema.org",
            "@type": "Product",
            name: product.title,
            description: product.summary ?? paragraphs[0] ?? product.title,
            image: photos.map((p) => absoluteUrl(p)),
            ...(product.brand ? { brand: { "@type": "Brand", name: product.brand } } : {}),
            ...(category ? { category } : {}),
            itemCondition: product.condition === "used" ? "https://schema.org/UsedCondition" : "https://schema.org/NewCondition",
            ...(product.price != null
              ? {
                  offers: {
                    "@type": "Offer",
                    price: product.price,
                    priceCurrency: "UZS",
                    availability: `https://schema.org/${AVAILABILITY[product.stock]}`,
                    url: absoluteUrl(path),
                    seller: { "@id": `${site.url}/#business` },
                  },
                }
              : {}),
          },
        ]}
      />
      <PageHero
        trail={trail}
        title={product.title}
        lead={product.summary ?? category ?? "Комплектующие для ПК"}
        meta={
          <div className="flex flex-wrap items-center gap-3">
            <span className={product.stock === "in_stock" ? "bg-[#16a34a] px-2 py-1 font-pixel text-[11px] leading-[19.5px] uppercase" : "bg-violet px-2 py-1 font-pixel text-[11px] leading-[19.5px] uppercase"}>
              {STOCK_LABEL[product.stock]}
            </span>
            {product.condition === "used" && <span className="bg-white/10 px-2 py-1 font-pixel text-[11px] leading-[19.5px] uppercase">{CONDITION_LABEL.used}</span>}
            <p className="font-pixel text-[15px] leading-[23px] text-[#4ade80] [text-shadow:0_0_8px_rgba(74,222,128,0.6)]">{formatPrice(product.price)}</p>
          </div>
        }
      />

      {photos.length > 0 && (
        <Column wide className="pt-10">
          <PhotoGrid title={product.title} photos={photos} />
        </Column>
      )}

      <Column className="pt-[100px]">
        <Prose
          blocks={[
            ...(paragraphs.length ? [{ type: "h2" as const, text: "Описание" }, ...paragraphs.map((text) => ({ type: "p" as const, text }))] : []),
            { type: "h2", text: "Характеристики" },
            { type: "table", head: ["Параметр", "Значение"], rows: specs },
            {
              type: "note",
              text:
                product.stock === "out"
                  ? "Сейчас этой детали нет. Напишите — подскажем, когда появится, или подберём замену."
                  : "Напишите или позвоните — проверим наличие, ответим на вопросы и договоримся о доставке по всему Узбекистану.",
            },
          ]}
        />
        <div className="mt-8 flex flex-wrap items-center gap-5">
          <KeyButton href="#contact" tone="accent">
            {product.stock === "out" ? "Узнать о поступлении" : "Заказать"}
          </KeyButton>
          <a href={site.telegram} target="_blank" rel="noopener noreferrer" className="font-mono text-[15px] underline decoration-white/60 underline-offset-[6px] hover:text-white/70">
            Написать в Telegram
          </a>
        </div>
      </Column>
    </InnerShell>
  );
}
