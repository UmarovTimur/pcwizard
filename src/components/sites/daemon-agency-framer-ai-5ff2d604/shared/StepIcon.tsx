"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

// 16×16 animated pixel icons for the work steps. Each kind is a function of the frame
// number that returns the lit pixels; frames tick at FPS while the icon is on screen.
const GRID = 16;
const FPS = 5;

const C = {
  L: "#e9d5ff", // lavender outline
  V: "#a855f7", // violet
  D: "#2e1a52", // dark violet fill
  G: "#4ade80", // green
  Y: "#facc15", // yellow
  R: "#f472b6", // pink
  W: "#ffffff",
};

type Px = [number, number, string];
export type StepIconKind = "chat" | "pick" | "test" | "shield";

const rect = (out: Px[], x0: number, y0: number, x1: number, y1: number, c: string) => {
  for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) out.push([x, y, c]);
};

/** Chat bubble with "typing" dots lighting up one after another. */
function chat(f: number): Px[] {
  const p: Px[] = [];
  rect(p, 1, 2, 14, 11, C.L);
  rect(p, 2, 3, 13, 10, C.D);
  rect(p, 3, 12, 5, 12, C.L); // tail
  rect(p, 3, 13, 3, 13, C.L);
  const lit = f % 4;
  [4, 7, 10].forEach((x, i) => rect(p, x, 6, x + 1, 7, i < lit ? C.W : C.V));
  return p;
}

/** Parts checklist: rows get ticked one by one, then the list starts over. */
function pick(f: number): Px[] {
  const p: Px[] = [];
  const done = Math.min(3, f % 6);
  [1, 6, 11].forEach((y, i) => {
    rect(p, 1, y, 4, y + 3, C.L);
    rect(p, 2, y + 1, 3, y + 2, i < done ? C.G : C.D);
    rect(p, 7, y + 1, i === 1 ? 12 : 14, y + 2, i < done ? C.V : C.D);
  });
  return p;
}

/** Load test: an equalizer of five bars, green → yellow → pink near the top. */
function test(f: number): Px[] {
  const p: Px[] = [];
  rect(p, 0, 15, 15, 15, C.L);
  [1, 4, 7, 10, 13].forEach((x, i) => {
    const h = 4 + Math.round(9 * Math.abs(Math.sin(f * 0.55 + i * 1.3)));
    for (let k = 0; k < h; k++) rect(p, x, 14 - k, x + 1, 14 - k, k < 6 ? C.G : k < 10 ? C.Y : C.R);
  });
  return p;
}

// Shield rows: [y, x from, x to]
const SHIELD: [number, number, number][] = [
  [1, 3, 12],
  [2, 2, 13],
  [3, 2, 13],
  [4, 2, 13],
  [5, 2, 13],
  [6, 2, 13],
  [7, 2, 13],
  [8, 2, 13],
  [9, 3, 12],
  [10, 4, 11],
  [11, 5, 10],
  [12, 6, 9],
  [13, 7, 8],
];
const TICK: [number, number][] = [
  [4, 7],
  [5, 8],
  [6, 9],
  [7, 8],
  [8, 7],
  [9, 6],
  [10, 5],
  [11, 4],
];

/** Warranty shield: the tick draws itself in, sparkles blink around it. */
function shield(f: number): Px[] {
  const p: Px[] = [];
  SHIELD.forEach(([y, a, b], i) => {
    const edge = i === 0 || i === SHIELD.length - 1;
    for (let x = a; x <= b; x++) p.push([x, y, edge || x === a || x === b ? C.L : C.D]);
  });
  const shown = Math.min(TICK.length, (f % 14) + 1);
  TICK.slice(0, shown).forEach(([x, y]) => {
    p.push([x, y, C.G]);
    p.push([x, y + 1, C.G]);
  });
  if (f % 4 < 2) p.push([0, 3, C.W], [15, 12, C.W]);
  else p.push([15, 2, C.W], [0, 13, C.W]);
  return p;
}

const KINDS: Record<StepIconKind, (f: number) => Px[]> = { chat, pick, test, shield };
// Frame shown when not animating (inactive or reduced motion): the "finished" state.
const STILL: Record<StepIconKind, number> = { chat: 3, pick: 3, test: 2, shield: 13 };

/**
 * Animated pixel icon for one work step. `active` = the step has been reached: it plays in
 * colour; before that it shows a still, dimmed frame. Pauses off screen and with reduced motion.
 */
export function StepIcon({ kind, active, className }: { kind: StepIconKind; active: boolean; className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const draw = (f: number) => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const size = canvas.clientWidth;
      const px = size / GRID;
      if (canvas.width !== Math.round(size * dpr)) {
        canvas.width = Math.round(size * dpr);
        canvas.height = Math.round(size * dpr);
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, size, size);
      for (const [x, y, c] of KINDS[kind](f)) {
        ctx.fillStyle = c;
        ctx.fillRect(Math.round(x * px), Math.round(y * px), Math.ceil(px), Math.ceil(px));
      }
    };

    if (!active || reduced) {
      draw(STILL[kind]);
      return;
    }
    let f = 0;
    let visible = true;
    draw(f);
    const id = window.setInterval(() => visible && draw(++f), 1000 / FPS);
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    io.observe(canvas);
    return () => {
      window.clearInterval(id);
      io.disconnect();
    };
  }, [kind, active]);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className={cn("aspect-square transition-[opacity,filter] duration-500", active ? "opacity-100" : "opacity-25 grayscale", className)}
    />
  );
}
