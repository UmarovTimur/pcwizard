import Link from "next/link";
import { site } from "@/lib/site";
import { KeyButton, Noise } from "../shared/primitives";
import { PixelField } from "../shared/PixelField";

export interface Crumb {
  name: string;
  path: string;
}

/** Breadcrumb trail; the last item is the current page. */
function Breadcrumbs({ trail }: { trail: Crumb[] }) {
  return (
    <nav aria-label="Хлебные крошки">
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 font-pixel text-[11px] leading-[22px] uppercase text-muted">
        {trail.map((c, i) => {
          const last = i === trail.length - 1;
          return (
            <li key={c.path} className="flex items-center gap-2">
              {last ? (
                <span aria-current="page" className="text-white">
                  {c.name}
                </span>
              ) : (
                <>
                  <Link href={c.path} className="hover:text-white">
                    {c.name}
                  </Link>
                  <span aria-hidden="true">/</span>
                </>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

/** Dark intro block for inner pages: breadcrumbs, H1, lead, key facts and CTAs. */
export function PageHero({
  trail,
  title,
  lead,
  bullets,
  meta,
  art,
}: {
  trail: Crumb[];
  title: string;
  lead: string;
  bullets?: string[];
  /** Extra line under the lead (e.g. article date). */
  meta?: React.ReactNode;
  /** Decoration behind the content (positions itself). */
  art?: React.ReactNode;
}) {
  return (
    <section className="relative overflow-hidden pt-[150px] pb-[140px] max-md:pt-32 max-md:pb-[100px]">
      <div className="absolute inset-0 bg-ink" />
      <PixelField className="absolute inset-0 z-[1] opacity-70" density={0.8} fade={0.3} />
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-[1] bg-[radial-gradient(60%_50%_at_50%_100%,rgba(124,58,237,0.25),transparent)]" />
      <Noise className="z-[1]" />
      {art}

      <div className="wrap relative z-[2] flex flex-col gap-8">
        <Breadcrumbs trail={trail} />
        {/* Titles come from data (articles, catalog items), so a very long word may break rather than overflow */}
        <h1 className="metal-text max-w-[1200px] font-display text-[clamp(30px,4.6vw,68px)] leading-[1.03] text-balance [overflow-wrap:anywhere] uppercase">{title}</h1>
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div className="flex max-w-[640px] flex-col gap-5">
            <p className="text-[19px] leading-[1.55] text-white/90">{lead}</p>
            {meta}
            {bullets && (
              <ul className="flex flex-wrap gap-2">
                {bullets.map((b) => (
                  <li key={b} className="bg-line px-3 py-2 font-pixel text-[12px] leading-[19.5px] uppercase">
                    {b}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-5">
            <KeyButton href="#contact">Оставить заявку</KeyButton>
            <a href={site.telegram} target="_blank" rel="noopener noreferrer" className="font-mono text-[15px] underline decoration-white/60 underline-offset-[6px] hover:text-white/70">
              Написать в Telegram
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
