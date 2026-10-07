import { site } from "@/lib/site";
import { PixelField } from "../shared/PixelField";
import { PixelStars } from "../shared/PixelStars";
import { KeyButton, ShardBullet } from "../shared/primitives";
import { hero } from "./content";

// 13×11 pixel Telegram plane (rasterised from the logo shape): body, fold line, lower flap.
const PLANE = [
  "...........##",
  ".........###.",
  "......###.##.",
  "....####.###.",
  "..#####.####.",
  "######.#####.",
  ".####.#####..",
  "...#.######..",
  "....#######..",
  ".....######..",
  ".....#...##..",
];
const PLANE_CELLS = PLANE.flatMap((row, y) => [...row].flatMap((c, x) => (c === "#" ? [{ x, y }] : [])));

/** Square key-style Telegram button with a pixel paper plane, sized to match the main CTA. */
function TelegramKey({ label }: { label: string }) {
  return (
    <a
      href={site.telegram}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      title={label}
      className="group grid size-14 place-items-center bg-[#229ed9] pr-0.5 pb-1.5 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.35),inset_0_-5px_0_0_rgb(14,94,138)] transition-transform duration-150 hover:-translate-y-0.5 active:translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
    >
      <svg viewBox="0 0 13 11" shapeRendering="crispEdges" aria-hidden="true" className="h-[22px] w-[26px] text-white">
        {PLANE_CELLS.map(({ x, y }) => (
          <rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" fill="currentColor" />
        ))}
      </svg>
    </a>
  );
}

/**
 * First screen as a poster: an oversized two-line headline over the dark field, then promises,
 * price and CTAs in one row, with pixel crystals growing along the bottom.
 */
export function Hero() {
  return (
    <section id="hero" className="relative flex min-h-[100svh] flex-col overflow-hidden md:min-h-[max(100svh,760px)]">
      <div aria-hidden="true" className="absolute inset-0 bg-ink" />
      {/* Pixel crystals along the bottom; they surge on scroll and shatter on click */}
      <PixelField className="absolute inset-0 z-[1]" />
      <PixelStars className="z-[1]" />

      <div className="relative z-[2] mx-auto flex w-full max-w-[1180px] flex-1 flex-col justify-end px-5 pt-24 pb-36 md:px-10 lg:pt-32 lg:pb-[clamp(150px,22vh,220px)]">
        <h1 className="crystal metal-text font-headline text-[15vw] leading-[0.9] font-[850] tracking-[-0.01em] uppercase [font-variation-settings:'wdth'_55] sm:text-[13vw] lg:text-[min(10.4vw,134px)] lg:[font-variation-settings:'wdth'_100]">
          {hero.h1Lines.map((line, i) => (
            <span key={line} className={i ? "block lg:pl-[0.6em]" : "block"}>
              {line}
              {i < hero.h1Lines.length - 1 && " "}
            </span>
          ))}
        </h1>

        <div className="mt-6 grid gap-6 md:mt-8 md:grid-cols-[minmax(0,1fr)_auto] md:items-end md:gap-8 lg:mt-12 xl:grid-cols-[minmax(0,1fr)_auto_auto] xl:gap-10">
          {/* Key promises as a pixel bullet list */}
          <ul className="flex flex-col gap-3.5">
            {hero.trust.map((t) => (
              <li key={t} className="flex items-start gap-3 font-pixel text-[13px] leading-[23.5px] [word-spacing:-0.3em] uppercase md:text-[14px] md:leading-[25.5px] xl:whitespace-nowrap">
                <ShardBullet className="mt-[3px] h-[15px] md:mt-1" />
                {t}
              </li>
            ))}
          </ul>

          <p className="flex items-baseline gap-3 md:flex-col md:items-start md:gap-1">
            <span className="text-[17px] text-white/60">{hero.priceFrom.label}</span>
            <span className="font-headline text-[34px] leading-none font-[800] text-[#4ade80] uppercase [filter:drop-shadow(0_0.06em_0_#15803d)_drop-shadow(0.04em_0.04em_0_#052e16)] [font-variation-settings:'wdth'_80] md:text-[44px] 2xl:text-[48px]">
              {hero.priceFrom.value}
            </span>
          </p>

          <div className="flex items-center gap-3 md:col-span-2 xl:col-span-1">
            <KeyButton href={hero.cta.href} tone="accent">
              {hero.cta.label}
            </KeyButton>
            <TelegramKey label={hero.telegram} />
          </div>
        </div>
      </div>
    </section>
  );
}
