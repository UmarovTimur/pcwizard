"use client";

import { useEffect, useRef, useState } from "react";
import { Noise, Placeholder } from "../shared/primitives";
import { Reveal } from "../shared/motion";
import { caseStudy } from "./content";

const TICKS = 40;
// Fixed precision keeps server and client markup identical.
const round = (n: number) => Math.round(n * 100) / 100;

/** Radial tick gauge; ticks fill up to `value`% once it scrolls into view. */
function Gauge({ value, label }: { value: number; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      const start = performance.now();
      const tick = (t: number) => {
        const p = Math.min(1, (t - start) / 1400);
        setShown(Math.round(value * (1 - Math.pow(1 - p, 3))));
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });
    io.observe(el);
    return () => io.disconnect();
  }, [value]);

  const lit = Math.round((shown / 100) * TICKS);
  return (
    <div ref={ref} className="flex w-[150px] flex-col gap-5">
      <div className="relative size-[110px]">
        <svg viewBox="0 0 110 110" className="size-full" aria-hidden="true">
          {Array.from({ length: TICKS }, (_, i) => {
            const a = (i / TICKS) * Math.PI * 2 - Math.PI / 2;
            const r1 = 37;
            const r2 = i < lit ? 54 : 50;
            return (
              <line
                key={i}
                x1={round(55 + Math.cos(a) * r1)}
                y1={round(55 + Math.sin(a) * r1)}
                x2={round(55 + Math.cos(a) * r2)}
                y2={round(55 + Math.sin(a) * r2)}
                stroke={i < lit ? "rgba(0,0,0,0.6)" : "rgba(0,0,0,0.08)"}
                strokeWidth="2"
                strokeLinecap="round"
                style={{ transition: "stroke 0.3s" }}
              />
            );
          })}
        </svg>
        <span className="absolute inset-0 flex items-center justify-center font-mono text-sm text-ink">
          {shown}
          <span className="mt-1 text-[8px]">%</span>
        </span>
      </div>
      <p className="flex gap-2.5 font-mono text-xs leading-[18px] tracking-[-0.03em] text-ink">
        <span aria-hidden="true" className="mt-[5px] size-[7px] shrink-0 bg-ink" />
        {label}
      </p>
    </div>
  );
}

function Pinwheel() {
  return (
    <svg viewBox="0 0 100 100" aria-hidden="true" className="size-[100px] text-ink">
      <path d="M0 0 L50 0 L50 50 Z M100 0 L100 50 L50 50 Z M0 100 L0 50 L50 50 Z M50 100 L50 50 L100 100 Z" fill="currentColor" />
    </svg>
  );
}

export function CaseStudy() {
  return (
    <section className="on-light relative flex flex-col overflow-hidden bg-[linear-gradient(132deg,#ffffff_0%,#e9d5ff_56%,#c4b5fd_100%)] text-ink md:flex-row md:justify-center">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 hidden md:block">
        <span className="absolute inset-y-0 left-[calc(50%-365px)] w-px bg-black/[0.06]" />
        <span className="absolute inset-y-0 left-1/2 w-px bg-black/[0.06]" />
        <span className="absolute inset-y-0 left-[calc(50%+365px)] w-px bg-black/[0.06]" />
      </div>
      <Noise />

      <div className="relative flex flex-col justify-between gap-16 px-5 pt-[140px] pb-[140px] md:w-[550px] md:px-0 md:pl-2.5 max-md:pb-10">
        <div className="flex flex-col gap-[30px]">
          <Reveal as="p" className="max-w-[375px] text-[15px] leading-6 font-light tracking-[0.02em]">
            {caseStudy.intro}
          </Reveal>
          <Reveal as="h2" className="max-w-[350px] font-display text-[32px] leading-[33px] tracking-[-0.02em] uppercase">
            {caseStudy.heading}
          </Reveal>
        </div>
        <p className="font-display text-[80px] leading-[81.3px] tracking-[-0.02em] uppercase max-md:text-[56px] max-md:leading-[58px]">
          {caseStudy.client.map((l) => (
            <span key={l} className="block">
              {l}
            </span>
          ))}
        </p>
      </div>

      <div className="absolute top-[490px] left-1/2 hidden -translate-x-1/2 md:block">
        <Pinwheel />
      </div>

      <div className="relative flex flex-col justify-between gap-16 px-5 pt-[140px] pb-[140px] md:w-[550px] md:px-0 md:pl-2.5 max-md:pt-10">
        <div className="flex flex-wrap gap-y-8">
          {caseStudy.stats.map((s) => (
            <Gauge key={s.label} value={s.value} label={s.label} />
          ))}
        </div>
        <div className="flex flex-col gap-[15px]">
          <figure className="flex max-w-[450px] flex-col gap-3.5">
            <blockquote className="text-[15px] leading-6 font-light tracking-[0.02em]">{caseStudy.quote}</blockquote>
            <figcaption className="font-mono text-[13px] leading-[20.8px] text-black/70 uppercase">{caseStudy.author}</figcaption>
          </figure>
          <ul className="flex max-w-[400px] flex-wrap gap-x-5 gap-y-[9px] opacity-40">
            {caseStudy.logos.map((l) => (
              <li key={l}>
                <Placeholder label={l} tone="light" className="h-8 w-[76px] bg-none bg-black/10 text-black/60" />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
