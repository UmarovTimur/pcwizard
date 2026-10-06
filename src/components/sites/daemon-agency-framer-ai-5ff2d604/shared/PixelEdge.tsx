"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

const CELL = 12; // px — same grid as the hero pixel field
const SIZE = 8; // lit square, px
const TICK = 100; // ms between updates
const CHURN = 0.12; // share of cells re-rolled per tick, so the pixels bubble slowly

/**
 * Bubbling violet pixels at one edge of a marquee: dense and bright at the outer edge,
 * thinning out toward the text. A few cells change each tick, so it simmers rather than flickers.
 * Pauses off screen; static with reduced motion. Size the box with `className` (e.g. the text height).
 */
export function PixelEdge({ side, className }: { side: "left" | "right"; className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let w = 0;
    let h = 0;
    let cols = 0;
    let rows = 0;
    let alpha: Float32Array = new Float32Array(0); // 0 = off
    let hot: Uint8Array = new Uint8Array(0);
    let raf = 0;
    let last = 0;
    let visible = true;

    // 1 at the outer edge → 0 toward the text
    const edge = (c: number) => (side === "left" ? 1 - c / cols : (c + 1) / cols);
    const roll = (i: number) => {
      const t = edge(i % cols);
      const on = Math.random() < t ** 1.5 * 0.9;
      alpha[i] = on ? (0.3 + Math.random() * 0.7) * t : 0;
      hot[i] = on && Math.random() < 0.1 * t ? 1 : 0;
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cols = Math.max(1, Math.floor(w / CELL));
      rows = Math.max(1, Math.floor(h / CELL));
      alpha = new Float32Array(cols * rows);
      hot = new Uint8Array(cols * rows);
      for (let i = 0; i < alpha.length; i++) roll(i);
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      const offY = (h - rows * CELL) / 2;
      for (let i = 0; i < alpha.length; i++) {
        if (!alpha[i]) continue;
        ctx.fillStyle = hot[i] ? `rgba(233,213,255,${alpha[i]})` : `rgba(168,85,247,${alpha[i]})`;
        ctx.fillRect((i % cols) * CELL + (CELL - SIZE) / 2, offY + Math.floor(i / cols) * CELL + (CELL - SIZE) / 2, SIZE, SIZE);
      }
    };

    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      if (!visible || now - last < TICK) return;
      last = now;
      for (let i = 0; i < alpha.length; i++) if (Math.random() < CHURN) roll(i);
      draw();
    };

    resize();
    draw();
    if (!reduced) raf = requestAnimationFrame(loop);
    const ro = new ResizeObserver(() => {
      resize();
      draw();
    });
    ro.observe(canvas);
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    io.observe(canvas);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
    };
  }, [side]);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute top-1/2 w-[clamp(96px,12vw,192px)] -translate-y-1/2 drop-shadow-[0_0_6px_rgba(168,85,247,0.45)]",
        side === "left" ? "left-0" : "right-0",
        className,
      )}
    />
  );
}
