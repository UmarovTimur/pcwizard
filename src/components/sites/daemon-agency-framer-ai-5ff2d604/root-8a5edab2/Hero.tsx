import Image from "next/image";
import { site } from "@/lib/site";
import { PixelField } from "../shared/PixelField";
import { PixelStars } from "../shared/PixelStars";
import { KeyButton } from "../shared/primitives";
import { PixelDissolve } from "../shared/PixelDissolve";
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

// Where the photo breaks into pixels: on phones it sits on top and dissolves downward,
// on desktop it fills the right side and dissolves toward the text on the left.
const DISSOLVE = { top: 0.12, bottom: 0.5 };
const DISSOLVE_LG = { left: 0.5, top: 0.14, bottom: 0.3 };

/**
 * First screen as a poster: a real RGB build photo on the right breaking into pixels,
 * an oversized two-line headline running across it, then promises, price and CTAs in one row.
 */
export function Hero() {
  return (
    <section id="hero" className="relative flex min-h-[100svh] flex-col overflow-hidden md:min-h-[820px]">
      <div aria-hidden="true" className="absolute inset-0 bg-ink" />
      <PixelField className="absolute inset-0 z-[1]" start={0.2} density={0.45} fade={0.3} />

      {/* Photo: Sebastian Ramirez, Unsplash (Unsplash License) — unsplash.com/photos/lErhwnuav_I */}
      <div className="absolute inset-x-0 top-0 z-[1] h-[62svh] lg:inset-y-0 lg:right-0 lg:left-auto lg:h-auto lg:w-[60%]">
        <Image
          src="/images/hero-build.webp"
          alt=""
          fill
          priority
          sizes="(min-width: 1024px) 60vw, 100vw"
          className="object-cover object-[60%_30%] lg:object-[50%_40%]"
        />
        <PixelDissolve edges={DISSOLVE} edgesLg={DISSOLVE_LG} className="absolute inset-0 size-full" />
      </div>
      <PixelStars className="z-[1]" />

      <div className="relative z-[2] mx-auto flex w-full max-w-[1180px] flex-1 flex-col justify-end px-5 pt-[44svh] pb-10 md:px-10 lg:pt-36 lg:pb-14">
        <h1 className="metal-text font-headline text-[15vw] leading-[0.9] font-[850] tracking-[-0.01em] uppercase [font-variation-settings:'wdth'_55] sm:text-[13vw] lg:text-[min(10.4vw,134px)] lg:[font-variation-settings:'wdth'_100]">
          {hero.h1Lines.map((line, i) => (
            <span key={line} className={i ? "block lg:pl-[0.6em]" : "block"}>
              {line}
              {i < hero.h1Lines.length - 1 && " "}
            </span>
          ))}
        </h1>

        <div className="mt-8 grid gap-8 md:grid-cols-[minmax(0,1fr)_auto] md:items-end lg:mt-12 xl:grid-cols-[minmax(0,1fr)_auto_auto] xl:gap-14">
          {/* Key promises as a pixel bullet list */}
          <ul className="flex flex-col gap-3.5">
            {hero.trust.map((t) => (
              <li key={t} className="flex items-start gap-3 font-pixel text-[11px] leading-[20px] [word-spacing:-0.3em] uppercase md:text-[12px] md:leading-[22px]">
                <span aria-hidden="true" className="mt-[7px] size-[7px] shrink-0 bg-violet md:mt-2" />
                {t}
              </li>
            ))}
          </ul>

          <p className="flex flex-col gap-1">
            <span className="text-[15px] text-white/60">{hero.priceFrom.label}</span>
            <span className="font-headline text-[40px] leading-none font-[800] text-[#4ade80] uppercase [font-variation-settings:'wdth'_80] md:text-[48px]">
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
