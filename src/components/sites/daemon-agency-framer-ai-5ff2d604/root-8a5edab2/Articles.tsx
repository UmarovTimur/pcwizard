import Link from "next/link";
import { ArrowRight, CalendarDays, Clock3 } from "lucide-react";
import { BigMarquee } from "../shared/BigMarquee";
import { Cross, KeyButton, Noise, Placeholder } from "../shared/primitives";
import { formatDate, getPost, type Post } from "./blog";
import { articles } from "./content";

const featured = articles.slugs.map(getPost).filter((p): p is Post => Boolean(p));

export function ArticleText({ a }: { a: Post }) {
  return (
    <div className="flex h-[231px] border-line">
      <div className="flex flex-1 flex-col justify-between pt-5 pr-[30px] pb-[30px] pl-5">
        <div className="flex flex-col gap-3">
          <h3 className="font-mono text-[13px] leading-[20.8px] uppercase">{a.title}</h3>
          <p className="line-clamp-3 text-sm leading-[22.4px] font-light tracking-[0.02em] text-muted">{a.excerpt}</p>
        </div>
        <div className="flex gap-5 font-mono text-xs leading-[18px] tracking-[-0.03em] text-muted">
          <span className="flex items-center gap-[5px]">
            <CalendarDays className="size-3.5" strokeWidth={1.25} aria-hidden="true" />
            <time dateTime={a.published}>{formatDate(a.published)}</time>
          </span>
          <span className="flex items-center gap-[5px]">
            <Clock3 className="size-3.5" strokeWidth={1.25} aria-hidden="true" />
            {a.read} чтения
          </span>
        </div>
      </div>
      <div className="flex w-[73px] items-center justify-center border-l border-line">
        <ArrowRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-1" strokeWidth={1.25} aria-hidden="true" />
      </div>
    </div>
  );
}

export function Articles() {
  return (
    <section id="articles" className="relative flex flex-col items-center gap-[70px] overflow-hidden pt-[200px]">
      <Noise />
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 hidden md:block">
        <span className="absolute inset-y-0 left-[calc(50%-365px)] w-px bg-line" />
        <span className="absolute inset-y-0 left-1/2 w-px bg-line" />
        <span className="absolute inset-y-0 left-[calc(50%+365px)] w-px bg-line" />
      </div>
      <div className="w-full pt-[70px]">
        <BigMarquee text={articles.marquee} heading={articles.heading} duration={20} size="md" />
      </div>

      <ul className="relative z-[2] grid w-full border-t border-line px-5 md:w-[1100px] md:grid-cols-3 md:px-0">
        <Cross className="top-0 left-0" />
        <Cross className="top-0 left-1/3" />
        <Cross className="top-0 left-2/3" />
        <Cross className="top-0 left-full" />
        {featured.map((a, i) => (
          <li key={a.slug} className="border-line md:border-l md:first:border-l-0">
            {/* Middle card is flipped: text on top, image below */}
            <Link href={`/blog/${a.slug}`} className="group flex h-[555px] flex-col bg-ink">
              {i === 1 ? (
                <>
                  <ArticleText a={a} />
                  <Placeholder label="Фото статьи 367×324" tone="light" className="h-[324px] shrink-0" />
                </>
              ) : (
                <>
                  <Placeholder label="Фото статьи 367×324" tone={i === 0 ? "dark" : "mid"} className="h-[324px] shrink-0" />
                  <ArticleText a={a} />
                </>
              )}
            </Link>
          </li>
        ))}
      </ul>
      <KeyButton href={articles.all.href} tone="black" className="relative z-[2]">
        {articles.all.label}
      </KeyButton>
    </section>
  );
}
