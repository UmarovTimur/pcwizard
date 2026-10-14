import { BigMarquee } from "../shared/BigMarquee";
import { KeyButton, Section, SectionHead } from "../shared/primitives";
import { BuildCards } from "./BuildCards";
import { budgets, hero } from "./content";

/**
 * Home, right under the first screen: the price claim as a marquee, then typical gaming builds
 * by budget, each linking to its long-form article.
 */
export function Budgets() {
  const [lead, figures] = budgets.heading.split(": ");
  return (
    <Section id="budgets" className="border-t-0 pt-[60px]">
      <BigMarquee text={budgets.marquee} duration={30} size="md" />
      <div className="wrap relative mt-14 md:mt-20">
        <SectionHead
          tag={budgets.tag}
          lead={budgets.lead}
          title={
            <>
              {lead}
              <span className="sr-only">: </span>
              {/* The figures repeat as the big numbers on the cards, so here they run as a quieter second line */}
              <span className="mt-2 block text-[0.5em] leading-[1.2]">{figures}</span>
            </>
          }
        >
          {/* The order button right where the prices are; it opens the request form with the service chosen */}
          <div className="flex flex-wrap gap-3" data-service="Сборка ПК на заказ">
            <KeyButton href={hero.cta.href} tone="accent">
              {hero.cta.label}
            </KeyButton>
            <KeyButton href={budgets.cta.href} tone="black">
              {budgets.cta.label}
            </KeyButton>
          </div>
        </SectionHead>
        <BuildCards />
      </div>
    </Section>
  );
}
