import { KeyButton, Section, SectionHead } from "../shared/primitives";
import { process } from "./content";
import { ProcessSteps } from "./ProcessSteps";

/** How an order goes: section title with the CTA beside it, then the four steps on a pixel progress bar. */
export function Process() {
  const cta = (
    <KeyButton href={process.cta.href} tone="accent">
      {process.cta.label}
    </KeyButton>
  );
  return (
    <Section id="process">
      <div className="wrap relative">
        <SectionHead title={process.heading} lead={process.cta.text} asideClassName="max-xl:hidden">
          {cta}
        </SectionHead>

        <ProcessSteps steps={process.steps} />

        {/* On phones and tablets the CTA follows the steps */}
        <div className="mt-10 flex flex-col items-start gap-4 xl:hidden">
          <p className="text-[18px] leading-[1.55] text-white/80">{process.cta.text}</p>
          {cta}
        </div>
      </div>
    </Section>
  );
}
