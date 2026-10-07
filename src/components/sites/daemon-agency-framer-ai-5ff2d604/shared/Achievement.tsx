"use client";

import { useEffect, useState } from "react";

// 9×9 pixel trophy.
const TROPHY = [
  "#########",
  "#.#####.#",
  "#.#####.#",
  ".#######.",
  "..#####..",
  "...###...",
  "....#....",
  "..#####..",
  ".#######.",
];
const CELLS = TROPHY.flatMap((row, y) => [...row].flatMap((c, x) => (c === "#" ? [{ x, y }] : [])));

/** Game-style "achievement unlocked" toast; slides up, stays a few seconds, then hides. */
export function Achievement({ title, text }: { title: string; text: string }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const t = window.setTimeout(() => setVisible(false), 4500);
    return () => window.clearTimeout(t);
  }, []);

  if (!visible) return null;
  return (
    <div
      role="status"
      className="achievement fixed bottom-6 left-1/2 z-[60] flex w-[min(360px,calc(100vw-32px))] -translate-x-1/2 items-center gap-4 border border-violet/60 bg-ink-2/95 p-4 shadow-[0_0_40px_rgba(168,85,247,0.55)] backdrop-blur-sm"
    >
      <svg viewBox="0 0 9 9" shapeRendering="crispEdges" aria-hidden="true" className="size-9 shrink-0 text-[#facc15] drop-shadow-[0_0_8px_rgba(250,204,21,0.7)]">
        {CELLS.map(({ x, y }) => (
          <rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" fill="currentColor" />
        ))}
      </svg>
      <div className="flex flex-col gap-1.5">
        <p className="font-pixel text-[11px] leading-[17px] text-[#facc15] uppercase">{title}</p>
        <p className="font-pixel text-[13px] leading-[21.5px] uppercase">{text}</p>
      </div>
    </div>
  );
}
