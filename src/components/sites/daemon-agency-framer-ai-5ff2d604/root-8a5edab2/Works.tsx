"use client";

import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { KeyButton, Section, SectionHead } from "../shared/primitives";
import { BuildCard } from "./BuildCard";
import { works } from "./content";

const arrow = "flex size-12 items-center justify-center border border-line bg-panel transition-colors hover:border-violet/60 hover:text-lavender";

/**
 * Portfolio carousel of real builds: arrows move the track one card at a time, and it can be
 * dragged with a finger or the mouse; a card links to its build page.
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
    <Section id="works">
      <div className="wrap relative">
        <SectionHead title={works.heading} lead={works.lead}>
          <div className="flex gap-2.5">
            <button type="button" onClick={() => go(-1)} aria-label="Предыдущая сборка" className={arrow}>
              <ChevronLeft className="size-6" strokeWidth={1.5} />
            </button>
            <button type="button" onClick={() => go(1)} aria-label="Следующая сборка" className={arrow}>
              <ChevronRight className="size-6" strokeWidth={1.5} />
            </button>
          </div>
        </SectionHead>
      </div>

      {/* Track: card 0 of the middle copy starts on the container's left edge (--edge) and the row runs off the screen */}
      {/* Drag area: vertical swipes still scroll the page (touch-action: pan-y) */}
      <div
        className="relative w-full cursor-grab touch-pan-y overflow-hidden select-none active:cursor-grabbing"
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
            "flex [--card:calc(100vw-2*var(--gutter)+12px)] [--edge:max(var(--gutter),calc((100%-var(--page))/2+var(--gutter)))] md:[--card:clamp(440px,37vw,640px)]",
            animate && drag === null && "transition-transform duration-700 ease-[cubic-bezier(0.65,0,0.35,1)]",
          )}
          style={{ transform: `translateX(calc(var(--edge) - ${count + index} * var(--card) + ${drag ?? 0}px))` }}
        >
          {loop.map((p, i) => (
            // The gap between cards is the item's own right padding, so one step is exactly --card
            <li key={i} className="h-[420px] w-[var(--card)] shrink-0 pr-3 md:h-[clamp(440px,34vw,560px)] md:pr-5" aria-hidden={i < count + index || i >= count * 2 + index}>
              <BuildCard
                build={p}
                index={i % count}
                sizes="(min-width: 768px) 640px, 100vw"
                tabIndex={i < count + index || i >= count * 2 + index ? -1 : 0}
                className="size-full"
              />
            </li>
          ))}
        </ul>
      </div>

      {/* Every build shown is sold, so the way to buy is to order one like it */}
      <div className="wrap relative mt-10 flex flex-wrap gap-3" data-service="Сборка ПК на заказ">
        <KeyButton href={works.order.href} tone="accent">
          {works.order.label}
        </KeyButton>
        <KeyButton href={works.all.href} tone="black">
          {works.all.label}
        </KeyButton>
      </div>
    </Section>
  );
}
