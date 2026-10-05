import Image from "next/image";
import { Cross, KeyButton } from "../shared/primitives";
import { PixelField } from "../shared/PixelField";
import { PixelStars } from "../shared/PixelStars";
import { ScrambleText } from "../shared/ScrambleText";
import { ClaimList, ServiceMenu } from "./HeroHud";
import { hero } from "./content";

// Horizontal guide-line positions (px from section top, desktop) and the crosses on them.
const H_LINES = [41, 312, 488, 888];

export function Hero() {
  return (
    <section id="hero" className="relative flex min-h-[1047px] flex-col items-center overflow-hidden pb-[60px] max-md:min-h-[100svh]">
      {/* Dark backdrop + interactive pixel field: sparse from the top, densest low down, fading out softly at the bottom edge */}
      <div aria-hidden="true" className="absolute inset-0 bg-ink" />
      <PixelField className="absolute inset-0 z-[1]" start={0} density={0.6} fade={0.3} />
      {/* Violet neon glow behind the headline */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(55%_45%_at_50%_40%,rgba(168,85,247,0.35)_0%,rgba(124,58,237,0.12)_45%,transparent_75%)]" />
      <PixelStars className="z-[1]" />

      {/* Guide grid (exclusion blend so it reads on light and dark) */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-[3] hidden mix-blend-exclusion md:block">
        <span className="absolute inset-y-0 left-[calc(50%-365px)] w-px bg-line" />
        <span className="absolute inset-y-0 left-1/2 w-px bg-line" />
        <span className="absolute inset-y-0 left-[calc(50%+365px)] w-px bg-line" />
        {H_LINES.map((y) => (
          <span key={y} className="absolute inset-x-0 h-px bg-line" style={{ top: y }}>
            <Cross className="top-0 left-[calc(50%-365px)]" />
            <Cross className="top-0 left-[calc(50%+365px)]" />
          </span>
        ))}
      </div>

      <div className="relative z-[2] flex w-full max-w-[1180px] flex-col gap-4 px-5 pt-[170px] text-white md:px-10 max-md:pt-32">
        {/* Headline, centred under the centred logo */}
        <div className="flex justify-center">
          <h1 className="sr-only">{hero.h1}</h1>
          {/* No fade/slide: the lines appear at once as scrambling glyphs */}
          <div className="font-pixel text-[10.2vw] leading-[1.25] md:text-[clamp(26px,7.5vw,108px)] [word-spacing:-0.6em] whitespace-nowrap">
            <ScrambleText text={hero.lines[0]} />
          </div>
        </div>

        <div className="flex justify-center">
          <div className="font-pixel text-[10.2vw] leading-[1.25] md:text-[clamp(26px,7.5vw,108px)] [word-spacing:-0.6em] whitespace-nowrap">
            <ScrambleText text={hero.lines[1]} delay={200} />
          </div>
        </div>

        {/* Bottom row, "character select" layout: claims | the build | service menu.
            Equal side columns keep it symmetric around the PC. */}
        <div className="grid gap-8 max-md:order-4 max-md:mt-2 md:mt-8 md:grid-cols-[1fr_320px_1fr] md:items-start md:gap-[30px]">
          <div className="flex flex-col items-start gap-8 md:pt-6">
            <ClaimList />
            <div className="flex items-center gap-5">
              <KeyButton href={hero.cta.href} tone="accent">
                {hero.cta.label}
              </KeyButton>
              <span aria-hidden="true" className="pixel-cursor font-pixel text-[9px] leading-[14px] text-lavender uppercase md:text-[10px]">
                ▶ {hero.pressStart}
              </span>
            </div>
          </div>

          {/* Featured build on a violet glow, floating gently */}
          <div className="relative mx-auto w-[75%] max-w-[300px] md:w-full md:max-w-none">
            <div aria-hidden="true" className="absolute inset-x-[-25%] bottom-[-12%] h-[45%] bg-[radial-gradient(50%_50%_at_50%_50%,rgba(168,85,247,0.55),rgba(124,58,237,0.18)_55%,transparent_75%)] blur-md" />
            <Image
              src="/images/hero-pc.png"
              alt="Игровой ПК в корпусе с фиолетовой подсветкой и видеокартой GeForce RTX"
              width={513}
              height={590}
              priority
              sizes="(min-width: 768px) 320px, 75vw"
              className="pc-float relative h-auto w-full drop-shadow-[0_0_40px_rgba(168,85,247,0.45)]"
            />
          </div>

          <ServiceMenu className="md:pt-6" />
        </div>
      </div>

    </section>
  );
}
