"use client";

import { Cube } from "../shared/Cube";
import { LogoMark, Noise, Placeholder, Tag } from "../shared/primitives";
import { useScrollProgress } from "../shared/motion";
import { brand, capabilities } from "./content";

/**
 * Scroll-driven: a sticky 800px stage stays pinned while the section scrolls;
 * capability items slide in from the right one after another.
 */
export function Capabilities() {
  const [ref, progress] = useScrollProgress<HTMLElement>();
  const n = capabilities.items.length;

  return (
    <section ref={ref} id="capabilities" className="relative px-5 py-[100px] md:h-[2510px] md:px-10">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 hidden md:block">
        <span className="absolute inset-y-0 left-1/2 w-px bg-[rgba(168,85,247,0.3)]" />
      </div>
      <Noise />

      <div className="relative z-[3] mx-auto flex h-[800px] w-full max-w-[1100px] flex-col items-center justify-end overflow-hidden pb-10 md:sticky md:top-[calc(50vh-400px)] max-md:h-auto max-md:gap-12 max-md:pt-16">
        {/* Background illustration (cave + landscape layers in the original) */}
        <div className="absolute inset-0 -z-10 bg-ink">
          <Placeholder label="Иллюстрация 1100×675" tone="mid" className="absolute inset-x-0 top-0 h-[675px] [mask-image:radial-gradient(60%_55%_at_50%_45%,#000_55%,transparent_100%)]" />
          <div className="absolute inset-x-0 bottom-0 h-[133px] bg-ink" />
        </div>

        <div className="absolute inset-x-0 top-[233px] flex flex-col items-center gap-[100px] max-md:static">
          <Tag tone="light" className="mix-blend-difference">
            {capabilities.tag}
          </Tag>
          <div className="flex flex-col items-center gap-[60px]">
            <Cube size={100} />
            <span className="flex items-center gap-2 font-logo text-[18.56px] font-extrabold tracking-[-0.04em]">
              <LogoMark className="size-4" />
              {brand.name}
            </span>
          </div>
        </div>

        <ul className="relative grid w-full grid-cols-2 gap-x-6 gap-y-6 md:grid-cols-4">
          {capabilities.items.map((item, i) => {
            // Each item gets its own slice of the scroll progress.
            const start = i / (n + 2);
            const local = Math.min(1, Math.max(0, (progress - start) * (n + 2) * 0.9));
            const eased = 1 - Math.pow(1 - local, 3);
            return (
              <li
                key={item}
                className="flex gap-2.5 mix-blend-difference max-md:!transform-none"
                style={{ transform: `translateX(${(1 - eased) * 1320}px)` }}
              >
                <span aria-hidden="true" className="mt-1 size-[7px] shrink-0 bg-white" />
                <span className="max-w-[160px] font-mono text-[15px] leading-[22.5px] tracking-[-0.03em]">{item}</span>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
