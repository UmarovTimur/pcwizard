import { Section, SectionHead } from "../shared/primitives";
import { testimonials } from "./content";

/** Client reviews: three cards, each with what it was about, the review and who wrote it. */
export function Testimonials() {
  // Hidden until the examples in content.ts are replaced with real reviews
  if (!testimonials.show) return null;
  return (
    <Section id="reviews">
      <div className="wrap relative">
        <SectionHead title={testimonials.heading} />
        <ul className="grid gap-4 md:grid-cols-3 lg:gap-5">
          {testimonials.items.map((t, i) => (
            <li key={i} className="flex flex-col border border-line bg-panel p-6 md:p-8">
              <h3 className="text-[21px] leading-[1.3] font-medium">{t.title}</h3>
              <p className="mt-3 mb-8 text-[17px] leading-[1.6] text-white/70">{t.text}</p>
              <p className="mt-auto flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-t border-line pt-5">
                <span className="font-pixel text-[13px] leading-[23px] uppercase">{t.name}</span>
                <span className="font-mono text-[14px] text-muted">{t.role}</span>
              </p>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}
