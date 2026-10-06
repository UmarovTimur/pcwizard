"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

const CELL = 12; // px — same grid as the hero pixel field
const TICK = 140; // ms between updates
const CHURN = 0.05; // share of edge cells re-rolled per tick, so the edge simmers slowly
const INK = "11,6,20"; // --color-ink

/** How deep (share of the box) the dissolve reaches in from each side; 0 = hard edge. */
export interface DissolveEdges {
  left?: number;
  right?: number;
  top?: number;
  bottom?: number;
}

/**
 * Canvas laid over a photo that breaks its edges into pixels: ink-coloured squares on the
 * hero grid, solid at the edge and thinning out inward, with a few violet pixels caught in
 * the transition. `edgesLg` replaces `edges` from 1024px up. Static with reduced motion.
 */
export function PixelDissolve({ edges, edgesLg, className }: { edges: DissolveEdges; edgesLg?: DissolveEdges; className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const lg = window.matchMedia("(min-width: 1024px)");
    let w = 0;
    let h = 0;
    let cols = 0;
    let rows = 0;
    let depth = new Float32Array(0); // 0 inside the photo → 1 at the edge
    let state = new Uint8Array(0); // 0 photo, 1 ink, 2 violet, 3 lavender
    let edgeCells: number[] = [];
    let raf = 0;
    let last = 0;
    let visible = true;

    const roll = (i: number) => {
      const t = depth[i];
      const r = Math.random();
      if (r < t ** 0.8) state[i] = 1;
      else if (r < t ** 0.8 + 0.07 * t) state[i] = Math.random() < 0.25 ? 3 : 2;
      else state[i] = 0;
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cols = Math.ceil(w / CELL);
      rows = Math.ceil(h / CELL);
      depth = new Float32Array(cols * rows);
      state = new Uint8Array(cols * rows);
      edgeCells = [];
      const e = (lg.matches && edgesLg) || edges;
      // Distance into the fade zone of one side: 1 at that edge, 0 where the zone ends.
      const side = (pos: number, size: number, share = 0) => (share > 0 ? Math.max(0, 1 - pos / (size * share)) : 0);
      for (let r = 0; r < rows; r++)
        for (let c = 0; c < cols; c++) {
          const x = c * CELL + CELL / 2;
          const y = r * CELL + CELL / 2;
          const t = Math.max(side(x, w, e.left), side(w - x, w, e.right), side(y, h, e.top), side(h - y, h, e.bottom));
          const i = r * cols + c;
          depth[i] = t;
          if (t > 0 && t < 1) edgeCells.push(i);
          roll(i);
        }
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      for (let i = 0; i < state.length; i++) {
        const s = state[i];
        if (!s) continue;
        const x = (i % cols) * CELL;
        const y = Math.floor(i / cols) * CELL;
        if (s === 1) {
          ctx.fillStyle = `rgb(${INK})`;
          ctx.fillRect(x, y, CELL, CELL);
        } else {
          // A lit pixel on an ink cell, like the pixel field around it
          ctx.fillStyle = `rgb(${INK})`;
          ctx.fillRect(x, y, CELL, CELL);
          ctx.fillStyle = s === 3 ? "#e9d5ff" : "#a855f7";
          ctx.fillRect(x + 2, y + 2, CELL - 4, CELL - 4);
        }
      }
    };

    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      if (!visible || now - last < TICK) return;
      last = now;
      for (const i of edgeCells) if (Math.random() < CHURN) roll(i);
      draw();
    };

    const refresh = () => {
      resize();
      draw();
    };
    refresh();
    if (!reduced) raf = requestAnimationFrame(loop);
    const ro = new ResizeObserver(refresh);
    ro.observe(canvas);
    lg.addEventListener("change", refresh);
    const io = new IntersectionObserver(([en]) => (visible = en.isIntersecting));
    io.observe(canvas);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      lg.removeEventListener("change", refresh);
    };
  }, [edges, edgesLg]);

  return <canvas ref={ref} aria-hidden="true" className={cn("pointer-events-none", className)} />;
}
