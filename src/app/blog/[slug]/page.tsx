import type { Metadata } from "next";
import { CalendarDays, Clock3 } from "lucide-react";
import { notFound } from "next/navigation";
import { absoluteUrl, breadcrumbLd, site } from "@/lib/site";
import { formatDate, getPost, posts } from "@/components/sites/daemon-agency-framer-ai-5ff2d604/root-8a5edab2/blog";
import { Column, InnerShell, RelatedLinks } from "@/components/sites/daemon-agency-framer-ai-5ff2d604/root-8a5edab2/InnerPage";
import { PageHero } from "@/components/sites/daemon-agency-framer-ai-5ff2d604/root-8a5edab2/PageHero";
import { JsonLd } from "@/components/sites/daemon-agency-framer-ai-5ff2d604/shared/JsonLd";
import { Prose } from "@/components/sites/daemon-agency-framer-ai-5ff2d604/shared/Prose";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = getPost((await params).slug);
  if (!post) return {};
  const path = `/blog/${post.slug}`;
  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: path },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.description,
      url: path,
      publishedTime: post.published,
      modifiedTime: post.updated,
    },
  };
}

export default async function PostPage({ params }: Props) {
  const post = getPost((await params).slug);
  if (!post) notFound();

  const path = `/blog/${post.slug}`;
  const trail = [
    { name: "Главная", path: "/" },
    { name: "Блог", path: "/blog" },
    { name: post.title, path },
  ];
  const more = posts.filter((p) => p.slug !== post.slug).slice(0, 3);

  return (
    <InnerShell>
      <JsonLd
        data={[
          breadcrumbLd(trail),
          {
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: post.title,
            description: post.description,
            datePublished: post.published,
            dateModified: post.updated,
            inLanguage: "ru",
            mainEntityOfPage: absoluteUrl(path),
            image: absoluteUrl(site.logo),
            author: { "@type": "Organization", name: site.name, url: site.url },
            publisher: { "@id": `${site.url}/#business` },
          },
        ]}
      />
      <PageHero
        trail={trail}
        title={post.title}
        lead={post.excerpt}
        meta={
          <p className="flex gap-5 font-mono text-xs leading-[18px] tracking-[-0.03em] text-muted">
            <span className="flex items-center gap-[5px]">
              <CalendarDays className="size-3.5" strokeWidth={1.25} aria-hidden="true" />
              {post.updated !== post.published ? "Обновлено " : ""}
              <time dateTime={post.updated}>{formatDate(post.updated)}</time>
            </span>
            <span className="flex items-center gap-[5px]">
              <Clock3 className="size-3.5" strokeWidth={1.25} aria-hidden="true" />
              {post.read} чтения
            </span>
          </p>
        }
      />
      <Column>
        <article>
          <Prose blocks={post.body} />
        </article>
      </Column>
      <Column wide className="pt-[120px]">
        <RelatedLinks title="Читайте также" items={more.map((p) => ({ label: p.title, href: `/blog/${p.slug}` }))} />
      </Column>
    </InnerShell>
  );
}
