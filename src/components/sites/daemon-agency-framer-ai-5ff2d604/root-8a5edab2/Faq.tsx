"use client";

import { useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { KeyButton, Section } from "../shared/primitives";
import { StickerSwarm } from "../shared/StickerSwarm";
import { faq } from "./content";

/** Click-driven accordion in one centred column: one item open at a time, "+" rotates to "×". Stickers pop out under the cursor around it. */
export function Faq() {
  const [open, setOpen] = useState<number | null>(null);
  const content = useRef<HTMLDivElement>(null);

  return (
    <Section id="faq">
      <StickerSwarm avoid={content} className="z-[1]" />

      {/* One centred column; the free space either side is where the stickers live */}
      <div className="wrap relative z-[2]">
        <div ref={content} className="mx-auto flex max-w-[1040px] flex-col">
          <div className="mb-10 flex flex-col items-center gap-5 text-center md:mb-12">
            <h2 className="metal-text font-display text-[clamp(34px,4.4vw,64px)] leading-[1.02] uppercase">{faq.heading}</h2>
            <p className="max-w-[52ch] text-[18px] leading-[1.55] text-white/80">{faq.text}</p>
          </div>

          <ul className="flex flex-col gap-2.5">
            {faq.items.map((item, i) => {
              const isOpen = open === i;
              const id = `faq-${i}`;
              return (
                <li key={i} className="border border-line bg-panel transition-colors hover:border-violet/40">
                  <h3>
                    <button
                      type="button"
                      aria-expanded={isOpen}
                      aria-controls={id}
                      onClick={() => setOpen(isOpen ? null : i)}
                      className="flex w-full cursor-pointer items-center justify-between gap-6 px-5 py-5 text-left md:px-7 md:py-6"
                    >
                      <span className="text-[19px] leading-[1.35] font-medium md:text-[21px]">{item.q}</span>
                      <span aria-hidden="true" className={cn("relative size-6 shrink-0 transition-transform duration-300", isOpen && "rotate-45")}>
                        <span className="absolute top-1/2 left-1/2 h-0.5 w-4 -translate-x-1/2 -translate-y-1/2 bg-violet" />
                        <span className="absolute top-1/2 left-1/2 h-4 w-0.5 -translate-x-1/2 -translate-y-1/2 bg-violet" />
                      </span>
                    </button>
                  </h3>
                  <div
                    id={id}
                    role="region"
                    className="grid transition-[grid-template-rows] duration-400 ease-out"
                    style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
                  >
                    <p className="overflow-hidden px-5 text-[18px] leading-[1.6] text-white/75 md:px-7">
                      <span className="block max-w-[70ch] pb-6">{item.a}</span>
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-5">
            <p className="font-display text-[24px] leading-[1.1] uppercase md:text-[28px]">{faq.more}</p>
            <KeyButton href={faq.cta.href}>{faq.cta.label}</KeyButton>
          </div>
        </div>
      </div>
    </Section>
  );
}
