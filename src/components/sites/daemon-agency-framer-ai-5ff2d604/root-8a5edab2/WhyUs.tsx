"use client";

import { useEffect, useRef, useState } from "react";
import { Cross, Noise, Placeholder, Tag } from "../shared/primitives";
import { Reveal } from "../shared/motion";
import { whyUs } from "./content";

const TICKS = 25;

function Ticks({ className }: { className?: string }) {
  return (
    <div className={className} aria-hidden="true">
      {Array.from({ length: TICKS }, (_, i) => (
        <span key={i} className="h-full w-px shrink-0 bg-white" />
      ))}
    </div>
  );
}

/** Tick-bar meter: a faint full bar with a bright clipped copy that grows on view. */
function Meter({ label, value }: { label: string; value: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [on, setOn] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        setOn(true);
        io.disconnect();
      }
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className="relative flex h-[88px] items-center gap-[19px] border-t border-line py-2 pr-10 pl-3">
      <Cross className="top-0 left-0" />
      <Cross className="top-0 left-full" />
      <span className="w-[18px] shrink-0 font-mono text-xs leading-[18px] tracking-[-0.03em] text-muted [writing-mode:vertical-rl] rotate-180">{label}</span>
      <div className="relative h-[45px] w-full max-w-[282px]" role="meter" aria-label={label} aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(value * 100)}>
        <Ticks className="absolute inset-0 flex justify-between opacity-10" />
        <div className="absolute inset-y-0 left-0 overflow-hidden transition-[width] duration-[1400ms] ease-[cubic-bezier(0.22,1,0.36,1)]" style={{ width: on ? `${value * 100}%` : "0%" }}>
          <Ticks className="flex h-full w-[282px] max-w-none justify-between opacity-60 max-md:w-[calc(100vw-110px)]" />
        </div>
      </div>
    </div>
  );
}

export function WhyUs() {
  return (
    <section className="relative flex flex-col overflow-hidden pt-[200px] md:flex-row">
      <Noise />
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 hidden md:block">
        <span className="absolute inset-y-0 left-[calc(50%-365px)] w-px bg-line" />
        <span className="absolute inset-y-0 left-[calc(50%+365px)] w-px bg-line" />
      </div>

      <div className="relative z-[2] flex w-full justify-end border-t border-line md:w-1/2">
        <div className="flex w-full flex-col gap-[60px] px-5 md:w-[365px] md:px-0">
          <div className="flex flex-col gap-5 pt-[30px] md:pr-5 md:pl-[30px]">
            <Tag>{whyUs.tag}</Tag>
            <Reveal as="h2" className="font-display text-[40px] leading-[44px] tracking-[-0.03em] uppercase">
              {whyUs.heading}
            </Reveal>
            <p className="max-w-[300px] text-[15px] leading-6 font-light tracking-[0.02em]">{whyUs.text}</p>
          </div>
          <div className="border-b border-line">
            {whyUs.meters.map((m) => (
              <Meter key={m.label} {...m} />
            ))}
          </div>
        </div>
      </div>

      <div className="relative z-[2] mt-12 min-h-[520px] w-full overflow-hidden md:mt-0 md:min-h-[788px] md:w-1/2">
        <Placeholder label="Фото 720×788" tone="mid" className="absolute inset-0" />
        <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(68%_150%_at_6%_87%,rgb(124,58,237)_0%,rgb(147,51,234)_45%,rgb(217,70,239)_80%)] opacity-90 mix-blend-screen" />
        <Noise className="opacity-[0.43]" />
        <p aria-hidden="true" className="relative p-[30px] font-display text-[clamp(120px,14vw,200px)] leading-[0.9] tracking-[-0.03em] text-white uppercase">
          {whyUs.bigWord.map((w) => (
            <span key={w} className="block">
              {w}
            </span>
          ))}
        </p>
      </div>
    </section>
  );
}
