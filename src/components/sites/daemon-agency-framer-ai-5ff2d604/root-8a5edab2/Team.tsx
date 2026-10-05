"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { KeyButton, Noise, Placeholder, Tag } from "../shared/primitives";
import { Reveal } from "../shared/motion";
import { team } from "./content";

/**
 * Hover/focus-driven: invisible hotspots sit over each person in the group photo;
 * the active member's callout card moves to that position.
 */
export function Team() {
  const [active, setActive] = useState(0);
  const member = team.members[active];

  return (
    <section id="team" className="relative flex flex-col items-center gap-10 overflow-hidden pt-[200px]">
      <Noise />
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 hidden md:block">
        <span className="absolute inset-y-0 left-[calc(50%-365px)] w-px bg-line" />
        <span className="absolute inset-y-0 left-1/2 w-px bg-line" />
        <span className="absolute inset-y-0 left-[calc(50%+365px)] w-px bg-line" />
      </div>

      <div className="relative z-[2] flex flex-col items-center gap-5 px-5 pt-[30px] text-center">
        <Tag>{team.tag}</Tag>
        <Reveal as="h2" className="font-display text-[80px] leading-[81px] tracking-[-0.02em] uppercase max-md:text-[44px] max-md:leading-[46px]">
          {team.heading.map((l) => (
            <span key={l} className="block">
              {l}
            </span>
          ))}
        </Reveal>
      </div>

      <div className="relative z-[2] h-[746px] w-full max-w-[1100px] max-md:h-[560px]">
        <Placeholder label="Фото команды 1100×616" tone="dark" className="absolute inset-x-0 bottom-0 h-[616px] [mask-image:linear-gradient(180deg,transparent,#000_18%)] max-md:h-[440px]" />

        {/* Callout card */}
        <div
          className="pointer-events-none absolute top-10 z-[3] w-[220px] transition-[left] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] max-md:left-5!"
          style={{ left: `calc(${member.x * 100}% - 20px)` }}
          aria-live="polite"
        >
          <div className="relative border-l border-white/60 pt-2.5 pr-4 pb-4 pl-4">
            <span aria-hidden="true" className="absolute top-0 left-0 h-px w-[110px] bg-white/60" />
            <p className="font-pixel text-[11px] leading-[20.8px] uppercase">{member.name}</p>
            <p className="mt-[7px] font-mono text-xs leading-[18px] tracking-[-0.03em] text-muted">{member.role}</p>
            <p className="mt-3 text-[15px] leading-[22.5px] font-light tracking-[0.02em]">{member.quote}</p>
          </div>
        </div>

        {/* Hotspots */}
        <div className="absolute inset-x-0 bottom-0 flex h-[520px]">
          {team.members.map((m, i) => (
            <button
              key={i}
              type="button"
              aria-label={`${m.name}, ${m.role}`}
              aria-pressed={active === i}
              onMouseEnter={() => setActive(i)}
              onFocus={() => setActive(i)}
              onClick={() => setActive(i)}
              className={cn("h-full flex-1 cursor-pointer focus-visible:outline-1 focus-visible:-outline-offset-4 focus-visible:outline-white/40")}
            />
          ))}
        </div>

        <div className="absolute bottom-[50px] left-1/2 z-[3] -translate-x-1/2">
          <KeyButton href={team.cta.href}>{team.cta.label}</KeyButton>
        </div>
      </div>
    </section>
  );
}
