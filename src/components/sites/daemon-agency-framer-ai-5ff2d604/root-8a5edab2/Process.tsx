import { BigMarquee } from "../shared/BigMarquee";
import { KeyButton, Noise } from "../shared/primitives";
import { process } from "./content";
import { ProcessSteps } from "./ProcessSteps";

/** How an order goes: section title with the CTA beside it, then the four steps on a pixel progress bar. */
export function Process() {
  return (
    <section id="process" className="relative flex flex-col items-center gap-14 overflow-hidden pt-[60px] md:gap-20">
      <Noise />
      <BigMarquee text={process.marquee} duration={30} size="md" />

      <div className="relative w-full max-w-[1180px] px-5 md:px-10">
        <div className="mb-10 flex flex-col gap-6 md:mb-14 lg:flex-row lg:items-end lg:justify-between lg:gap-12">
          <h2 className="max-w-[20ch] font-display text-[36px] leading-[1.02] uppercase md:text-[52px] xl:text-[60px]">
            {process.heading}
          </h2>
          <div className="flex flex-col gap-4 max-lg:hidden lg:items-end">
            <p className="text-[17px] whitespace-nowrap text-white/70">{process.cta.text}</p>
            <KeyButton href={process.cta.href} tone="accent">
              {process.cta.label}
            </KeyButton>
          </div>
        </div>

        <ProcessSteps steps={process.steps} />

        {/* On phones and tablets the CTA follows the steps */}
        <div className="mt-10 flex flex-col gap-4 lg:hidden">
          <p className="text-[17px] text-white/70">{process.cta.text}</p>
          <KeyButton href={process.cta.href} tone="accent">
            {process.cta.label}
          </KeyButton>
        </div>
      </div>
    </section>
  );
}
