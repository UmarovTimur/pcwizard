"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

const CELL = 12; // grid pitch, px
const SIZE = 8; // lit square size, px
const WAVE_SPEED = 0.45; // ring growth, px per ms
const WAVE_WIDTH = 34; // ring thickness, px
const WAVE_LIFE = 1400; // ms
const CALM_KEEP = 0.25; // share of pixels left under `calm` content
const CALM_REACH = 70; // how far around that content the field stays thinned, px

interface Cell {
  x: number;
  y: number;
  depth: number; // 0 where the field starts, 1 at the dense edge
  fade: number; // 1 = full strength, → 0 inside the soft edge
  phase: number;
  speed: number;
}

interface Wave {
  x: number;
  y: number;
  t0: number;
}

/**
 * Canvas field of violet pixels that thickens and brightens toward one edge,
 * twinkles at random, and ripples outward from the cursor.
 * Pointer events are read from the enclosing <section>/<footer>, so the canvas
 * itself never blocks clicks.
 *
 * `start`: share of the field (from the sparse side) left empty.
 * `direction`: "up" — dense at the bottom (hero), "down" — dense at the top.
 * `density`: multiplier for how many cells are lit (1 = default).
 * `fade`: share of the field at the dense edge over which pixels thin out and dim
 *   to nothing, so the field ends softly instead of at a hard edge (0 = no fade).
 * `calm`: selector of content inside the section (headline, text) that the field thins out
 *   under and around, so the pixels gather beside and below it instead of behind it.
 */
export function PixelField({
  className,
  start = 0.35,
  direction = "up",
  density = 1,
  fade = 0,
  calm,
}: {
  className?: string;
  start?: number;
  direction?: "up" | "down";
  density?: number;
  fade?: number;
  calm?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const target = canvas?.closest<HTMLElement>("section, footer");
    const ctx = canvas?.getContext("2d");
    if (!canvas || !target || !ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // Cursor ripples only where there is a real cursor.
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const calmEls = calm ? [...target.querySelectorAll<HTMLElement>(calm)] : [];
    let cells: Cell[] = [];
    let width = 0;
    let height = 0;
    const waves: Wave[] = [];
    let pointer: { x: number; y: number } | null = null;
    let lastWave = 0;
    let frame = 0;

    const build = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Boxes of the `calm` content in canvas coordinates.
      const origin = canvas.getBoundingClientRect();
      const quiet = calmEls.map((el) => {
        const box = el.getBoundingClientRect();
        return { left: box.left - origin.left, top: box.top - origin.top, right: box.right - origin.left, bottom: box.bottom - origin.top };
      });
      // Share of pixels kept at a point: CALM_KEEP under the content, easing to 1 at CALM_REACH from it.
      const keepAt = (x: number, y: number) => {
        let d = CALM_REACH;
        for (const q of quiet) d = Math.min(d, Math.hypot(Math.max(q.left - x, 0, x - q.right), Math.max(q.top - y, 0, y - q.bottom)));
        const e = d / CALM_REACH;
        return CALM_KEEP + (1 - CALM_KEEP) * e * e * (3 - 2 * e);
      };

      cells = [];
      const cols = Math.ceil(width / CELL);
      const rows = Math.ceil(height / CELL);
      for (let r = 0; r < rows; r++) {
        const pos = (r + 0.5) / rows;
        const t = direction === "up" ? pos : 1 - pos;
        if (t < start) continue;
        const depth = (t - start) / (1 - start);
        // Soft end: smoothstep from 0 at the edge to 1 at `fade` away from it.
        const e = fade > 0 ? Math.min(1, (1 - t) / fade) : 1;
        const soft = e * e * (3 - 2 * e);
        // Density ramps from sparse to nearly full toward the dense edge.
        const lit = (0.06 + 0.84 * depth * depth) * density * soft;
        for (let c = 0; c < cols; c++) {
          if (Math.random() > lit * (quiet.length ? keepAt((c + 0.5) * CELL, (r + 0.5) * CELL) : 1)) continue;
          cells.push({
            x: c * CELL + (CELL - SIZE) / 2,
            y: r * CELL + (CELL - SIZE) / 2,
            depth,
            fade: soft,
            phase: Math.random() * Math.PI * 2,
            speed: 0.0008 + Math.random() * 0.0028,
          });
        }
      }
    };

    const draw = (now: number) => {
      frame = 0;
      ctx.clearRect(0, 0, width, height);

      while (waves.length && now - waves[0].t0 > WAVE_LIFE) waves.shift();

      for (const cell of cells) {
        // Base brightness: dim on the sparse side, bright on the dense edge.
        const base = 0.12 + 0.88 * cell.depth ** 1.6;
        // Chaotic twinkle: two detuned sines per cell, squared so pixels sit
        // mostly dark and flash bright — more contrast than a linear blend.
        const wave = reduced ? 0.7 : 0.5 + 0.32 * Math.sin(now * cell.speed + cell.phase) + 0.18 * Math.sin(now * cell.speed * 2.7 + cell.phase * 1.3);
        const tw = wave * wave * 1.35;
        let alpha = base * cell.fade * Math.max(0.04, tw);

        let boost = 0;
        const cx = cell.x + SIZE / 2;
        const cy = cell.y + SIZE / 2;
        for (const w of waves) {
          const age = now - w.t0;
          const radius = age * WAVE_SPEED;
          const d = Math.hypot(cx - w.x, cy - w.y);
          const ring = Math.exp(-((d - radius) ** 2) / (WAVE_WIDTH * WAVE_WIDTH));
          boost += ring * (1 - age / WAVE_LIFE);
        }
        if (pointer) {
          const d = Math.hypot(cx - pointer.x, cy - pointer.y);
          boost += 0.6 * Math.exp(-(d * d) / (70 * 70));
        }
        alpha = Math.min(1, alpha + boost * 0.9 * cell.fade);
        if (alpha < 0.02) continue;

        // Hotter pixels (twinkle peak, cursor wave) shift from violet toward lavender-white.
        const heat = Math.min(1, boost + Math.max(0, tw - 0.75) * 1.2 + cell.depth * 0.2);
        const r = Math.round(168 + (240 - 168) * heat);
        const g = Math.round(85 + (220 - 85) * heat);
        const b = Math.round(247 + (255 - 247) * heat);
        ctx.fillStyle = `rgba(${r},${g},${b},${alpha})`;
        ctx.fillRect(cell.x, cell.y, SIZE, SIZE);
      }

      if (!reduced) frame = requestAnimationFrame(draw);
    };

    const onMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointer = { x: e.clientX - rect.left, y: e.clientY - rect.top };
      const now = performance.now();
      if (now - lastWave > 140) {
        waves.push({ ...pointer, t0: now });
        lastWave = now;
      }
      if (reduced && !frame) frame = requestAnimationFrame(draw);
    };
    const onLeave = () => {
      pointer = null;
    };

    build();
    frame = requestAnimationFrame(draw);

    const ro = new ResizeObserver(() => {
      build();
      if (reduced && !frame) frame = requestAnimationFrame(draw);
    });
    ro.observe(canvas);
    // The content can reflow without the canvas resizing (a font swap, a wrapped line).
    for (const el of calmEls) ro.observe(el);
    if (fine) {
      target.addEventListener("pointermove", onMove);
      target.addEventListener("pointerleave", onLeave);
    }

    // Pause the loop while the hero is off screen.
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        if (!frame) frame = requestAnimationFrame(draw);
      } else if (frame) {
        cancelAnimationFrame(frame);
        frame = 0;
      }
    });
    io.observe(canvas);

    return () => {
      if (frame) cancelAnimationFrame(frame);
      ro.disconnect();
      io.disconnect();
      target.removeEventListener("pointermove", onMove);
      target.removeEventListener("pointerleave", onLeave);
    };
  }, [start, direction, density, fade, calm]);

  return <canvas ref={canvasRef} aria-hidden="true" className={cn("pointer-events-none block size-full", className)} />;
}
