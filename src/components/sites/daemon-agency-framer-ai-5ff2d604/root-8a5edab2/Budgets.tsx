import { Cross, KeyButton, Noise, Tag } from "../shared/primitives";
import { Reveal } from "../shared/motion";
import { BuildCards } from "./BuildCards";
import { budgets } from "./content";

/** Home: typical gaming builds by budget, linking to the long-form articles. */
export function Budgets() {
  return (
    <section id="budgets" className="relative flex flex-col items-center overflow-hidden pt-[200px]">
      <Noise />
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 hidden md:block">
        <span className="absolute inset-y-0 left-[calc(50%-365px)] w-px bg-line" />
        <span className="absolute inset-y-0 left-1/2 w-px bg-line" />
        <span className="absolute inset-y-0 left-[calc(50%+365px)] w-px bg-line" />
      </div>

      <div className="relative z-[2] grid w-full gap-8 border-t border-line px-5 pt-[30px] pb-[50px] md:w-[1100px] md:grid-cols-2 md:items-end md:px-[30px]">
        <Cross className="top-0 left-0" />
        <Cross className="top-0 left-full" />
        <div className="flex flex-col gap-5">
          <Tag>{budgets.tag}</Tag>
          <Reveal as="h2" className="max-w-[520px] font-display text-[56px] leading-[58px] tracking-[-0.02em] uppercase max-md:text-[40px] max-md:leading-[44px]">
            {budgets.heading}
          </Reveal>
        </div>
        <div className="flex flex-col items-start gap-5 md:pl-[60px]">
          <p className="max-w-[340px] text-[15px] leading-6 font-light tracking-[0.02em]">{budgets.lead}</p>
          <KeyButton href={budgets.cta.href} tone="black">
            {budgets.cta.label}
          </KeyButton>
        </div>
      </div>

      <div className="relative z-[2] w-full px-5 md:w-[1100px] md:px-0">
        <BuildCards />
      </div>
    </section>
  );
}
