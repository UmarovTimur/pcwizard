import type { Metadata } from "next";
import { connection } from "next/server";
import { breadcrumbLd } from "@/lib/site";
import { getCatalog } from "@/lib/catalog";
import { CatalogTable } from "@/components/sites/daemon-agency-framer-ai-5ff2d604/root-8a5edab2/CatalogTable";
import { Column, InnerShell } from "@/components/sites/daemon-agency-framer-ai-5ff2d604/root-8a5edab2/InnerPage";
import { PageHero } from "@/components/sites/daemon-agency-framer-ai-5ff2d604/root-8a5edab2/PageHero";
import { JsonLd } from "@/components/sites/daemon-agency-framer-ai-5ff2d604/shared/JsonLd";
import { MainboardArt } from "@/components/sites/daemon-agency-framer-ai-5ff2d604/shared/MainboardArt";

const title = "Каталог комплектующих: видеокарты, процессоры, память — PcWizard_uz";
const description =
  "Комплектующие для ПК в наличии и под заказ: видеокарты, процессоры, материнские платы, память, накопители, блоки питания. Цены в сумах, доставка по всему Узбекистану.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/catalog" },
  openGraph: { title, description, url: "/catalog" },
};

export default async function CatalogPage() {
  // Products change in the admin panel at any time: render on every request
  await connection();
  const groups = await getCatalog();
  const trail = [
    { name: "Главная", path: "/" },
    { name: "Каталог", path: "/catalog" },
  ];

  return (
    <InnerShell>
      <JsonLd data={breadcrumbLd(trail)} />
      <PageHero
        trail={trail}
        title="Каталог комплектующих"
        lead="Детали в наличии и под заказ с ценами в сумах. Нажмите на товар с фиолетовой меткой, чтобы посмотреть фото и характеристики. Нужной детали нет — напишите, найдём."
        art={<MainboardArt className="top-[90px] right-[-80px] z-[1] w-[clamp(360px,46vw,760px)] opacity-45 max-md:top-[70px] max-md:right-[-120px] max-md:opacity-25" />}
      />
      <Column wide className="pt-0">
        <CatalogTable groups={groups} />
      </Column>
    </InnerShell>
  );
}
