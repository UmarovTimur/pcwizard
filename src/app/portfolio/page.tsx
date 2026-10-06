import type { Metadata } from "next";
import { breadcrumbLd } from "@/lib/site";
import { BuildCard } from "@/components/sites/daemon-agency-framer-ai-5ff2d604/root-8a5edab2/BuildCard";
import { works } from "@/components/sites/daemon-agency-framer-ai-5ff2d604/root-8a5edab2/content";
import { Column, InnerShell } from "@/components/sites/daemon-agency-framer-ai-5ff2d604/root-8a5edab2/InnerPage";
import { PageHero } from "@/components/sites/daemon-agency-framer-ai-5ff2d604/root-8a5edab2/PageHero";
import { JsonLd } from "@/components/sites/daemon-agency-framer-ai-5ff2d604/shared/JsonLd";

const title = "Портфолио: игровые ПК, которые мы собрали — PcWizard_uz";
const description = "Реальные сборки PcWizard_uz: фото, конфигурации и цены игровых компьютеров, которые мы собрали и продали. Гарантия 30 дней.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/portfolio" },
  openGraph: { title, description, url: "/portfolio" },
};

export default function PortfolioPage() {
  const trail = [
    { name: "Главная", path: "/" },
    { name: "Портфолио", path: "/portfolio" },
  ];
  return (
    <InnerShell>
      <JsonLd data={breadcrumbLd(trail)} />
      <PageHero trail={trail} title="Наши работы" lead="Компьютеры, которые мы собрали: готовые к покупке и уже проданные. Откройте сборку, чтобы посмотреть фото, конфигурацию и цену." />
      <Column wide>
        <ul className="grid gap-3 md:grid-cols-2">
          {works.projects.map((b, i) => (
            <li key={b.slug}>
              <BuildCard build={b} index={i} sizes="(min-width: 768px) 550px, 100vw" className="aspect-[4/5] md:aspect-[11/10]" />
            </li>
          ))}
        </ul>
      </Column>
    </InnerShell>
  );
}
