import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { breadcrumbLd, faqLd, site } from "@/lib/site";
import type { Block } from "@/components/sites/daemon-agency-framer-ai-5ff2d604/root-8a5edab2/blocks";
import { BuildCards } from "@/components/sites/daemon-agency-framer-ai-5ff2d604/root-8a5edab2/BuildCards";
import { Column, InnerShell, RelatedLinks } from "@/components/sites/daemon-agency-framer-ai-5ff2d604/root-8a5edab2/InnerPage";
import { getLanding, landings } from "@/components/sites/daemon-agency-framer-ai-5ff2d604/root-8a5edab2/landings";
import { PageHero } from "@/components/sites/daemon-agency-framer-ai-5ff2d604/root-8a5edab2/PageHero";
import { JsonLd } from "@/components/sites/daemon-agency-framer-ai-5ff2d604/shared/JsonLd";
import { FaqList, Prose } from "@/components/sites/daemon-agency-framer-ai-5ff2d604/shared/Prose";

type Props = { params: Promise<{ slug: string }> };

// Only the landing pages listed in landings.ts exist; anything else is a 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return landings.map((l) => ({ slug: l.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const landing = getLanding((await params).slug);
  if (!landing) return {};
  const path = `/${landing.slug}`;
  return {
    title: landing.title,
    description: landing.description,
    alternates: { canonical: path },
    openGraph: { title: landing.title, description: landing.description, url: path },
  };
}

/** Splits the body around the { type: "builds" } slot. */
function splitBody(body: Block[]) {
  const at = body.findIndex((b) => b.type === "builds");
  return at === -1 ? { before: body, after: [], builds: false } : { before: body.slice(0, at), after: body.slice(at + 1), builds: true };
}

export default async function LandingPage({ params }: Props) {
  const landing = getLanding((await params).slug);
  if (!landing) notFound();

  const trail = [
    { name: "Главная", path: "/" },
    { name: landing.name, path: `/${landing.slug}` },
  ];
  const { before, after, builds } = splitBody(landing.body);

  return (
    <InnerShell>
      <JsonLd
        data={[
          breadcrumbLd(trail),
          faqLd(landing.faq),
          {
            "@context": "https://schema.org",
            "@type": "Service",
            name: landing.h1,
            description: landing.description,
            provider: { "@id": `${site.url}/#business` },
            areaServed: { "@type": "Country", name: "Узбекистан" },
          },
        ]}
      />
      <PageHero trail={trail} title={landing.h1} lead={landing.lead} bullets={landing.bullets} />
      <Column>
        <Prose blocks={before} />
      </Column>
      {builds && (
        <Column wide className="pt-10">
          <BuildCards />
        </Column>
      )}
      {after.length > 0 && (
        <Column className={builds ? "pt-16" : "pt-10"}>
          <Prose blocks={after} />
        </Column>
      )}
      <Column className="pt-[120px]">
        <div className="flex flex-col gap-6">
          <h2 className="font-display text-[32px] leading-[36px] tracking-[-0.02em] uppercase md:text-[40px] md:leading-[44px]">Частые вопросы</h2>
          <FaqList items={landing.faq} />
        </div>
      </Column>
      <Column wide className="pt-[120px]">
        <RelatedLinks items={landing.related} />
      </Column>
    </InnerShell>
  );
}
