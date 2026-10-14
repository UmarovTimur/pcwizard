import { PixelSky } from "../shared/PixelSky";
import { KeyButton, Section, ShardBullet } from "../shared/primitives";
import { hero, whyUs } from "./content";

/** Why us: the promise and four concrete reasons on the left, the pixel-sky poster on the right. */
export function WhyUs() {
  return (
    <Section>
      <div className="wrap relative">
        <div className="grid border border-line bg-panel lg:grid-cols-2">
          <div className="flex flex-col justify-center gap-8 p-6 md:p-10 xl:p-14">
            <h2 className="metal-text font-display text-[clamp(34px,3.6vw,54px)] leading-[1.03] text-balance uppercase">{whyUs.heading}</h2>
            <p className="max-w-[52ch] text-[18px] leading-[1.55] text-white/80">{whyUs.text}</p>
            <ul className="grid gap-x-10 gap-y-7 border-t border-line pt-8 sm:grid-cols-2 lg:max-xl:grid-cols-1">
              {whyUs.reasons.map((r) => (
                <li key={r.title} className="flex flex-col gap-2">
                  <h3 className="flex items-start gap-3 font-pixel text-[13px] leading-[23px] uppercase [word-spacing:-0.3em]">
                    <ShardBullet className="mt-[3px] h-[15px]" />
                    {r.title}
                  </h3>
                  <p className="text-[17px] leading-[1.5] text-white/70">{r.text}</p>
                </li>
              ))}
            </ul>
            <div data-service="Сборка ПК на заказ">
              <KeyButton href={hero.cta.href} tone="accent">
                {hero.cta.label}
              </KeyButton>
            </div>
          </div>

          <div className="relative min-h-[360px] overflow-hidden lg:min-h-[620px]">
            {/* Pixel-art sky: deep violet in the corner behind the words, glowing pink from the
                bottom right, with dithered steps between the shades and a few stars. The still
                picture shows until the animated canvas draws over it */}
            <div aria-hidden="true" className="absolute inset-0 bg-[url(/images/whyus-pixel-sky.png)] bg-cover bg-center [image-rendering:pixelated]" />
            <PixelSky />
            <p aria-hidden="true" className="relative p-6 font-display text-[clamp(60px,7.4vw,128px)] leading-[0.95] text-white uppercase md:p-10">
              {whyUs.bigWord.map((w) => (
                <span key={w} className="block">
                  {w}
                </span>
              ))}
            </p>
          </div>
        </div>
      </div>
    </Section>
  );
}
