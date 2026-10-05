import type { Metadata } from "next";
import Link from "next/link";
import { breadcrumbLd } from "@/lib/site";
import { ArticleText } from "@/components/sites/daemon-agency-framer-ai-5ff2d604/root-8a5edab2/Articles";
import { posts } from "@/components/sites/daemon-agency-framer-ai-5ff2d604/root-8a5edab2/blog";
import { Column, InnerShell } from "@/components/sites/daemon-agency-framer-ai-5ff2d604/root-8a5edab2/InnerPage";
import { PageHero } from "@/components/sites/daemon-agency-framer-ai-5ff2d604/root-8a5edab2/PageHero";
import { JsonLd } from "@/components/sites/daemon-agency-framer-ai-5ff2d604/shared/JsonLd";
import { Cross } from "@/components/sites/daemon-agency-framer-ai-5ff2d604/shared/primitives";

const title = "Блог о сборке ПК и комплектующих — PcWizard_uz";
const description =
  "Сборки игровых ПК по бюджету, выбор и проверка видеокарт, компьютеры для учёбы. Практические статьи от сборщиков PcWizard_uz, обновляем каждый квартал.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/blog" },
  openGraph: { title, description, url: "/blog" },
};

export default function BlogIndex() {
  const trail = [
    { name: "Главная", path: "/" },
    { name: "Блог", path: "/blog" },
  ];
  return (
    <InnerShell>
      <JsonLd data={breadcrumbLd(trail)} />
      <PageHero
        trail={trail}
        title="Блог о сборке ПК"
        lead="Сборки по бюджету, выбор видеокарты, проверка б/у деталей. Пишем о том, что спрашивают наши клиенты, и обновляем цены каждый квартал."
      />
      <Column wide>
        <ul className="relative grid border-t border-line md:grid-cols-3">
          <Cross className="top-0 left-0" />
          <Cross className="top-0 left-full" />
          {posts.map((p) => (
            <li key={p.slug} className="border-b border-line md:border-l md:[&:nth-child(3n+1)]:border-l-0">
              <Link href={`/blog/${p.slug}`} className="group block bg-ink transition-colors hover:bg-white/[0.03]">
                <ArticleText a={p} />
              </Link>
            </li>
          ))}
        </ul>
      </Column>
    </InnerShell>
  );
}
