import Link from "next/link";
import { site } from "@/lib/site";
import { Cross, KeyButton, Noise } from "../shared/primitives";
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
}: {
  trail: Crumb[];
  title: string;
  lead: string;
  bullets?: string[];
  /** Extra line under the lead (e.g. article date). */
  meta?: React.ReactNode;
}) {
  return (
    <section className="relative flex justify-center overflow-hidden pt-[150px] pb-[80px] max-md:pt-32">
      <div className="absolute inset-0 bg-ink" />
      <PixelField className="absolute inset-0 z-[1] opacity-70" density={0.8} fade={0.3} />
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-[1] bg-[radial-gradient(60%_50%_at_50%_100%,rgba(124,58,237,0.25),transparent)]" />
      <Noise className="z-[1]" />

      <div className="relative z-[2] flex w-full flex-col gap-8 border-t border-line px-5 pt-[30px] md:w-full md:max-w-[1100px] md:px-[30px]">
        <Cross className="top-0 left-0" />
        <Cross className="top-0 left-full" />
        <Breadcrumbs trail={trail} />
        <h1 className="max-w-[900px] text-balance font-display text-[clamp(30px,6vw,80px)] leading-[1.02] uppercase">{title}</h1>
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div className="flex max-w-[520px] flex-col gap-5">
            <p className="text-[17px] leading-7 font-light tracking-[0.01em] text-white/90">{lead}</p>
            {meta}
            {bullets && (
              <ul className="flex flex-wrap gap-2">
                {bullets.map((b) => (
                  <li key={b} className="bg-line px-3 py-2 font-pixel text-[11px] leading-[19.5px] uppercase">
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
