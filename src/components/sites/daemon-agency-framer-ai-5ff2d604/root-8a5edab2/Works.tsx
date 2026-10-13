"use client";

import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Cross, KeyButton, Noise, Tag } from "../shared/primitives";
import { Reveal } from "../shared/motion";
import { BuildCard } from "./BuildCard";
import { works } from "./content";

/**
 * Portfolio carousel of real builds: arrows move the track one card at a time (550px; full width
 * on mobile), and it can be dragged with a finger or the mouse; a card links to its build page.
 */
export function Works() {
  const [index, setIndex] = useState(0);
  const [animate, setAnimate] = useState(true);
  const [drag, setDrag] = useState<number | null>(null); // px the track is pulled while dragging
  const pointer = useRef<{ x: number; moved: boolean } | null>(null);
  const dragged = useRef(false); // swallow the click that ends a drag, so it doesn't open a card
  const trackRef = useRef<HTMLUListElement>(null);
  const count = works.projects.length;
  const go = (dir: number) => {
    setAnimate(true);
    setIndex((i) => i + dir);
  };

  // Past either end of the middle copy: once the slide ends, jump to the same card in the
  // middle copy without animating, so the carousel loops endlessly in both directions.
  const onSlideEnd = (e: React.TransitionEvent) => {
    if (e.target !== e.currentTarget || (index >= 0 && index < count)) return;
    setAnimate(false);
    setIndex(((index % count) + count) % count);
  };

  const onPointerDown = (e: React.PointerEvent) => {
    if (e.button !== 0) return;
    pointer.current = { x: e.clientX, moved: false };
    dragged.current = false;
  };
  const onPointerMove = (e: React.PointerEvent) => {
    const p = pointer.current;
    if (!p) return;
    const dx = e.clientX - p.x;
    if (!p.moved && Math.abs(dx) > 6) {
      p.moved = true;
      e.currentTarget.setPointerCapture(e.pointerId);
    }
    if (p.moved) setDrag(dx);
  };
  const onPointerUp = () => {
    const p = pointer.current;
    pointer.current = null;
    if (!p?.moved) return;
    dragged.current = true;
    // Snap to the nearest card; a short flick still turns one card
    const card = trackRef.current?.firstElementChild?.clientWidth || 1;
    const dx = drag ?? 0;
    let n = Math.round(-dx / card);
    if (!n && Math.abs(dx) > card * 0.12) n = dx < 0 ? 1 : -1;
    setDrag(null);
    go(Math.max(-(count - 1), Math.min(count - 1, n)));
  };

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

      <div className="relative z-[2] grid w-full border-t border-line px-5 md:w-full md:max-w-[1100px] md:grid-cols-2 md:px-0">
        <Cross className="top-0 left-0" />
        <Cross className="top-0 left-1/2" />
        <Cross className="top-0 left-full" />
        <div className="relative flex flex-col gap-5 bg-ink pt-[30px] pr-10 pb-[70px] pl-[30px] max-md:px-0">
          <Tag>{works.tag}</Tag>
          <Reveal as="h2" className="max-w-[480px] font-display text-[46px] leading-[1] uppercase md:text-[60px] lg:text-[76px]">
            {works.heading}
          </Reveal>
          <Noise />
        </div>
        <div className="flex flex-col justify-end gap-10 pb-[70px] pl-2.5 max-md:pl-0">
          <p className="max-w-[355px] text-[17px] leading-[27px] font-light tracking-[0.02em]">{works.lead}</p>
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
      {/* Drag area: vertical swipes still scroll the page (touch-action: pan-y) */}
      <div
        className="relative z-[2] w-full cursor-grab touch-pan-y overflow-hidden select-none active:cursor-grabbing"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onClickCapture={(e) => {
          if (!dragged.current) return;
          dragged.current = false;
          e.preventDefault();
          e.stopPropagation();
        }}
        onDragStart={(e) => e.preventDefault()}
      >
        <ul
          ref={trackRef}
          onTransitionEnd={onSlideEnd}
          className={cn(
            "flex [--card:calc(100vw-40px)] md:[--card:550px]",
            animate && drag === null && "transition-transform duration-700 ease-[cubic-bezier(0.65,0,0.35,1)]",
          )}
          style={{ transform: `translateX(calc(max(20px, 50% - 550px) - ${count + index} * var(--card) + ${drag ?? 0}px))` }}
        >
          {loop.map((p, i) => (
            <li key={i} className="relative h-[472px] w-[var(--card)] shrink-0 max-md:h-[420px]" aria-hidden={i < count + index || i >= count * 2 + index}>
              <BuildCard
                build={p}
                index={i % count}
                sizes="(min-width: 768px) 550px, 100vw"
                tabIndex={i < count + index || i >= count * 2 + index ? -1 : 0}
                className="size-full"
              />
            </li>
          ))}
        </ul>
      </div>

      <KeyButton href={works.all.href} tone="black" className="relative z-[2] mt-10">
        {works.all.label}
      </KeyButton>
    </section>
  );
}
