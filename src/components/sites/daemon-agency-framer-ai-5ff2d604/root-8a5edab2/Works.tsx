"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Cross, Noise, Placeholder, Tag } from "../shared/primitives";
import { Reveal } from "../shared/motion";
import { works } from "./content";

const CARD = 550;

/** Click-driven carousel: arrows move the track one 550px card at a time. */
export function Works() {
  const [index, setIndex] = useState(0);
  const count = works.projects.length;
  const go = (dir: 1 | -1) => setIndex((i) => (i + dir + count) % count);

  // Render the list three times so neighbours are always visible on both sides.
  const loop = [...works.projects, ...works.projects, ...works.projects];

  return (
    <section id="works" className="relative flex flex-col items-center overflow-hidden pt-[200px]">
      <Noise />
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 hidden md:block">
        <span className="absolute inset-y-0 left-[calc(50%-365px)] w-px bg-line" />
        <span className="absolute inset-y-0 left-1/2 w-px bg-line" />
        <span className="absolute inset-y-0 left-[calc(50%+365px)] w-px bg-line" />
      </div>

      <div className="relative z-[2] grid w-full border-t border-line px-5 md:w-[1100px] md:grid-cols-2 md:px-0">
        <Cross className="top-0 left-0" />
        <Cross className="top-0 left-1/2" />
        <Cross className="top-0 left-full" />
        <div className="relative flex flex-col gap-5 bg-ink pt-[30px] pr-10 pb-[70px] pl-[30px] max-md:px-0">
          <Tag>{works.tag}</Tag>
          <Reveal as="h2" className="max-w-[400px] font-display text-[80px] leading-[81px] tracking-[-0.02em] uppercase max-md:text-[52px] max-md:leading-[54px]">
            {works.heading}
          </Reveal>
          <Noise />
        </div>
        <div className="flex flex-col justify-end gap-10 pb-[70px] pl-2.5 max-md:pl-0">
          <p className="max-w-[355px] text-[15px] leading-6 font-light tracking-[0.02em]">{works.lead}</p>
          <div className="flex gap-2.5">
            <button type="button" onClick={() => go(-1)} aria-label="Предыдущая сборка" className="flex size-10 items-center justify-center transition-opacity hover:opacity-60">
              <ChevronLeft className="size-6" strokeWidth={1.5} />
            </button>
            <button type="button" onClick={() => go(1)} aria-label="Следующая сборка" className="flex size-10 items-center justify-center transition-opacity hover:opacity-60">
              <ChevronRight className="size-6" strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </div>

      {/* Track: card 0 of the middle copy aligns with the left edge of the 1100 frame */}
      <div className="relative z-[2] w-full overflow-hidden">
        <ul
          className="flex transition-transform duration-700 ease-[cubic-bezier(0.65,0,0.35,1)]"
          style={{ transform: `translateX(calc(max(20px, 50% - 550px) - ${(count + index) * CARD}px))` }}
        >
          {loop.map((p, i) => (
            <li key={i} className="relative h-[472px] w-[550px] shrink-0 max-md:h-[360px] max-md:w-[calc(100vw-40px)]" aria-hidden={i < count || i >= count * 2}>
              <a href="#works" className="group relative flex size-full flex-col items-center justify-between overflow-hidden p-[30px]">
                <Placeholder label={`Фото сборки ${(i % count) + 1}`} tone={i % 2 ? "dark" : "mid"} className="absolute inset-0 transition-transform duration-700 group-hover:scale-105" />
                <span className="relative z-[2] font-pixel text-[10px] leading-[20.8px]">{p.year}</span>
                <span aria-hidden="true" className="relative z-[2] flex size-[90px] items-center justify-center border border-white/30 font-mono text-[10px] text-white/60 uppercase">
                  Лого
                </span>
                <span className="relative z-[2] flex w-[285px] justify-center bg-black/50 px-3 py-1 font-pixel text-[10px] leading-[20.8px] uppercase backdrop-blur-sm">
                  {p.name}
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
