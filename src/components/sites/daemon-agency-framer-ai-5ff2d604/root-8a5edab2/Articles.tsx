import Link from "next/link";
import { ArrowRight, CalendarDays, Clock3 } from "lucide-react";
import { BigMarquee } from "../shared/BigMarquee";
import { KeyButton, Section } from "../shared/primitives";
import { formatDate, getPost, type Post } from "./blog";
import { articles } from "./content";

const featured = articles.slugs.map(getPost).filter((p): p is Post => Boolean(p));

/** Article card: title, excerpt, date and reading time; the whole card is the link. */
export function ArticleCard({ a }: { a: Post }) {
  return (
    <Link href={`/blog/${a.slug}`} className="group flex h-full flex-col border border-line bg-panel p-6 transition-colors hover:border-violet/60 md:p-8">
      <h3 className="text-[22px] leading-[1.25] font-medium text-balance">{a.title}</h3>
      <p className="mt-3 mb-8 line-clamp-3 text-[17px] leading-[1.55] text-white/70">{a.excerpt}</p>
      <div className="mt-auto flex items-center justify-between gap-4 border-t border-line pt-5 font-mono text-[14px] leading-[21px] text-muted">
        <span className="flex flex-wrap gap-x-5 gap-y-1">
          <span className="flex items-center gap-1.5">
            <CalendarDays className="size-3.5" strokeWidth={1.25} aria-hidden="true" />
            <time dateTime={a.published}>{formatDate(a.published)}</time>
          </span>
          <span className="flex items-center gap-1.5">
            <Clock3 className="size-3.5" strokeWidth={1.25} aria-hidden="true" />
            {a.read} чтения
          </span>
        </span>
        <ArrowRight className="size-4 shrink-0 text-white transition-transform duration-300 group-hover:translate-x-1" strokeWidth={1.5} aria-hidden="true" />
      </div>
    </Link>
  );
}

/** Home: the "articles" marquee, three featured posts and a link to the blog. */
export function Articles() {
  return (
    <Section id="articles" className="pt-[60px]">
      <BigMarquee text={articles.marquee} heading={articles.heading} duration={20} size="md" />
      <div className="wrap relative mt-12 md:mt-16">
        <ul className="grid gap-4 md:grid-cols-3 lg:gap-5">
          {featured.map((a) => (
            <li key={a.slug}>
              <ArticleCard a={a} />
            </li>
          ))}
        </ul>
        <KeyButton href={articles.all.href} tone="black" className="mt-10">
          {articles.all.label}
        </KeyButton>
      </div>
    </Section>
  );
}
