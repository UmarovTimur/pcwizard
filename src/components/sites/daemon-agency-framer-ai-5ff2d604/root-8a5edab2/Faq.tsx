"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Cross, KeyButton, Noise } from "../shared/primitives";
import { Reveal } from "../shared/motion";
import { faq } from "./content";

/** Click-driven accordion: one item open at a time, "+" rotates to "×". */
export function Faq() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section id="faq" className="relative flex justify-center overflow-hidden pt-[200px]">
      <Noise />
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 hidden md:block">
        <span className="absolute inset-y-0 left-[calc(50%-365px)] w-px bg-line" />
        <span className="absolute inset-y-0 left-1/2 w-px bg-line" />
        <span className="absolute inset-y-0 left-[calc(50%+365px)] w-px bg-line" />
      </div>

      <div className="relative z-[2] grid w-full border-y border-line px-5 md:w-full md:max-w-[730px] md:grid-cols-2 md:px-0">
        <Cross className="top-0 left-0" />
        <Cross className="top-0 left-1/2" />
        <Cross className="top-0 left-full" />
        <Cross className="top-full left-0" />
        <Cross className="top-full left-1/2" />
        <Cross className="top-full left-full" />

        <div className="flex flex-col justify-between gap-12 pt-[30px] pr-2.5 pb-2.5 md:pl-[30px]">
          <div className="flex flex-col gap-5">
            <Reveal as="h2" className="max-w-[320px] font-display text-[38px] leading-[1.05] uppercase">
              {faq.heading}
            </Reveal>
            <p className="max-w-[300px] text-[17px] leading-[27px] font-light tracking-[0.02em]">{faq.text}</p>
          </div>
          <div className="relative flex items-center pb-10">
            <p className="w-[190px] shrink-0 font-display text-[24px] leading-[1.1] uppercase">{faq.more}</p>
            <KeyButton href={faq.cta.href}>{faq.cta.label}</KeyButton>
            <svg viewBox="0 0 80 24" aria-hidden="true" className="absolute bottom-0 left-[88px] h-6 w-20 text-white/80">
              <path d="M2 6 C 20 26, 55 26, 76 4" fill="none" stroke="currentColor" strokeWidth="1" />
              <path d="M68 4 L76 4 L74 12" fill="none" stroke="currentColor" strokeWidth="1" />
            </svg>
          </div>
        </div>

        <ul className="bg-ink">
          {faq.items.map((item, i) => {
            const isOpen = open === i;
            const id = `faq-${i}`;
            return (
              <li key={i} className="border-b-8 border-ink">
                <h3>
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={id}
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="flex w-full items-start justify-between gap-6 bg-white/[0.02] py-5 pr-3 pl-[22px] text-left transition-colors hover:bg-white/[0.05]"
                  >
                    <span className="font-mono text-[15px] leading-[24px] uppercase">{item.q}</span>
                    <span aria-hidden="true" className={cn("relative size-6 shrink-0 transition-transform duration-300", isOpen && "rotate-45")}>
                      <span className="absolute top-1/2 left-1/2 h-px w-3.5 -translate-x-1/2 bg-white" />
                      <span className="absolute top-1/2 left-1/2 h-3.5 w-px -translate-y-1/2 bg-white" />
                    </span>
                  </button>
                </h3>
                <div
                  id={id}
                  role="region"
                  className="grid bg-white/[0.02] transition-[grid-template-rows] duration-400 ease-out"
                  style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
                >
                  <p className="overflow-hidden px-[22px] text-base leading-[25.5px] font-light tracking-[0.02em] text-muted">
                    <span className="block pb-5">{item.a}</span>
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
