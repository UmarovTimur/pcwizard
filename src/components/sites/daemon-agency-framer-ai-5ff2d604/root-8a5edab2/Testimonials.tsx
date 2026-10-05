import { Cross, Noise } from "../shared/primitives";
import { Reveal } from "../shared/motion";
import { testimonials } from "./content";

// Simple geometric marks standing in for client logos.
const MARKS = [
  "M25 0 L30 20 L50 25 L30 30 L25 50 L20 30 L0 25 L20 20 Z",
  "M25 25 L25 0 A25 25 0 0 1 50 25 Z M25 25 L50 25 A25 25 0 0 1 25 50 Z M25 25 L25 50 A25 25 0 0 1 0 25 Z M25 25 L0 25 A25 25 0 0 1 25 0 Z",
  "M0 5 L50 5 L25 45 Z",
];

export function Testimonials() {
  return (
    <section aria-label="Отзывы" className="relative flex justify-center overflow-hidden px-5 md:px-10">
      <Noise />
      <ul className="relative z-[2] grid w-full md:w-[1100px] md:grid-cols-3">
        <Cross className="top-0 left-0" />
        <Cross className="top-0 left-1/3" />
        <Cross className="top-0 left-2/3" />
        <Cross className="top-0 left-full" />
        <Cross className="top-full left-0" />
        <Cross className="top-full left-1/3" />
        <Cross className="top-full left-2/3" />
        <Cross className="top-full left-full" />
        {testimonials.map((t, i) => (
          <li key={i} className="flex flex-col border-line bg-ink md:border-l md:first:border-l-0">
            <div className="flex flex-1 flex-col gap-[70px] px-[30px] pt-[30px] pb-9">
              <span className="font-pixel text-base leading-[28.8px] text-white/50">{String(i + 1).padStart(2, "0")}</span>
              <Reveal className="flex flex-col gap-5">
                <h3 className="font-mono text-[13px] leading-[20.8px] uppercase">{t.title}</h3>
                <p className="text-sm leading-[22.4px] font-light tracking-[0.02em] text-muted">{t.text}</p>
              </Reveal>
            </div>
            {/* The accent gradient shows through the 4px gap under the two blocks */}
            <div className="flex h-[99px] gap-0 bg-[radial-gradient(68%_150%_at_6%_87%,rgb(124,58,237)_0%,rgb(147,51,234)_45%,rgb(217,70,239)_100%)]">
              <div className="flex h-[95px] flex-1 flex-col justify-center gap-[5px] border-r border-line bg-ink px-[30px]">
                <span className="text-[15px] leading-6 font-light tracking-[0.02em]">{t.name}</span>
                <span className="font-mono text-[11px] leading-5 text-muted uppercase">— {t.role}</span>
              </div>
              <div className="flex h-[95px] w-[95px] items-center justify-center bg-ink">
                <svg viewBox="0 0 50 50" aria-hidden="true" className="size-[51px] text-white">
                  <path d={MARKS[i % MARKS.length]} fill="currentColor" />
                </svg>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
