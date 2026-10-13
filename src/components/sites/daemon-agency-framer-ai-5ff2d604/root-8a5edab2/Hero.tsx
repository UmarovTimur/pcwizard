import Image from "next/image";
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
 * First screen as a centred poster: an oversized two-line headline over the dark field, then
 * promises, price and CTAs (stacked, in one row from xl), with pixel crystals along the bottom.
 */
export function Hero() {
  return (
    <section id="hero" className="relative flex min-h-[100svh] flex-col overflow-hidden md:min-h-[max(100svh,760px)]">
      <div aria-hidden="true" className="absolute inset-0 bg-ink" />
      {/* Photo: SDL Sanjaya, Unsplash (Unsplash License) — unsplash.com/photos/2rQoMZLVXHc */}
      {/* Full-screen backdrop, dimmed hard so the headline and crystals stay on top */}
      <div aria-hidden="true" className="absolute inset-0">
        <Image
          src="/images/sdl-sanjaya-2rQoMZLVXHc-unsplash.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-[72%_50%] brightness-[0.32] md:object-center"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(11,6,20,0.7)_0%,rgba(11,6,20,0.6)_45%,rgba(11,6,20,0.92)_100%)]" />
      </div>
      {/* Pixel crystals along the bottom: a dim, quiet back row, and a front row that surges on
          scroll and shatters on click */}
      {/* Light the crystals cast: a violet wash rising from the bottom, strongest in the corners
          where they grow tallest; it breathes slowly */}
      <div
        aria-hidden="true"
        className="crystal-glow pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-[70%] bg-[radial-gradient(40%_70%_at_0%_100%,rgba(192,132,252,0.5),transparent_70%),radial-gradient(40%_70%_at_100%_100%,rgba(192,132,252,0.5),transparent_70%),radial-gradient(80%_55%_at_50%_100%,rgba(147,51,234,0.45),transparent_75%)] mix-blend-screen"
      />
      <PixelField className="absolute inset-0 z-[1]" reach={0.5} back />
      {/* The front row glows: a tight halo around every shard and a wider soft one */}
      <PixelField className="absolute inset-0 z-[1]" glow />
      <PixelStars className="z-[1]" />

      <div className="relative z-[2] mx-auto flex w-full max-w-[1180px] flex-1 flex-col items-center justify-center px-5 py-24 text-center md:px-10 lg:py-28">
        <h1 className="metal-text font-headline text-[15vw] leading-[0.9] font-[850] tracking-[-0.01em] uppercase [font-variation-settings:'wdth'_55] sm:text-[13vw] lg:text-[min(10.4vw,134px)] lg:[font-variation-settings:'wdth'_100]">
          {hero.h1Lines.map((line, i) => (
            <span key={line} className="block">
              {line}
              {i < hero.h1Lines.length - 1 && " "}
            </span>
          ))}
        </h1>

        <div className="mt-8 flex flex-col items-center gap-7 md:mt-10 lg:mt-12 xl:flex-row xl:items-center xl:gap-12">
          {/* Key promises as a pixel bullet list */}
          <ul className="flex flex-col gap-3.5 text-left">
            {hero.trust.map((t) => (
              <li key={t} className="flex items-start gap-3 font-pixel text-[13px] leading-[23.5px] [word-spacing:-0.3em] uppercase md:text-[14px] md:leading-[25.5px] xl:whitespace-nowrap">
                <ShardBullet className="mt-[3px] h-[15px] md:mt-1" />
                {t}
              </li>
            ))}
          </ul>

          <p className="flex items-baseline gap-3 xl:flex-col xl:items-start xl:gap-1 xl:text-left">
            <span className="font-pixel text-[13px] leading-[23.5px] whitespace-nowrap text-white/60 md:text-[14px] md:leading-[25.5px]">{hero.priceFrom.label}</span>
            <span className="font-pixel text-[20px] leading-[28px] whitespace-nowrap text-[#4ade80] [text-shadow:0_0_10px_rgba(74,222,128,0.6)] md:text-[24px] md:leading-[32px]">
              {hero.priceFrom.value}
            </span>
          </p>

          <div className="flex items-center gap-3">
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
