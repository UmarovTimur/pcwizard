"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

const CELL = 12; // grid pitch, px
const SIZE = 8; // lit square size, px
const WAVE_SPEED = 0.45; // ring growth, px per ms
const WAVE_WIDTH = 34; // ring thickness, px
const WAVE_LIFE = 1400; // ms

interface Cell {
  x: number;
  y: number;
  depth: number; // 0 where the field starts, 1 at the dense edge
  fade: number; // 1 = full strength, → 0 inside the soft edge
  phase: number;
  speed: number;
}

/** How deep (share of the box) the photo dissolves in from each side; 0 = hard edge. */
export interface DissolveEdges {
  left?: number;
  right?: number;
  top?: number;
  bottom?: number;
}

/** A photo under the field whose edges break into the same pixel grid. `edgesLg` applies from 1024px. */
export interface PixelCover {
  selector: string;
  edges: DissolveEdges;
  edgesLg?: DissolveEdges;
}

const INK = "rgb(11,6,20)"; // --color-ink

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
 * `cover`: a photo inside the section (matched by `selector`) laid under the canvas. Its
 *   edges are eaten by ink squares on the same grid, with field pixels twinkling among them,
 *   and the cursor waves run across the photo too — so photo and field read as one surface.
 */
export function PixelField({
  className,
  start = 0.35,
  direction = "up",
  density = 1,
  fade = 0,
  cover,
}: {
  className?: string;
  start?: number;
  direction?: "up" | "down";
  density?: number;
  fade?: number;
  cover?: PixelCover;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // Compared by value, so a re-rendered parent passing an equal object doesn't rebuild the field.
  const coverKey = JSON.stringify(cover ?? null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const target = canvas?.closest<HTMLElement>("section, footer");
    const ctx = canvas?.getContext("2d");
    if (!canvas || !target || !ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coverOpt = JSON.parse(coverKey) as PixelCover | null;
    const coverEl = coverOpt ? target.querySelector<HTMLElement>(coverOpt.selector) : null;
    let cells: Cell[] = [];
    let inks: { x: number; y: number }[] = []; // ink squares over the photo edges
    let photo: { x: number; y: number }[] = []; // a sparse set of photo cells the cursor waves light up
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
          if (Math.random() > lit) continue;
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
      buildCover();
    };

    // Grid cells over the photo: solid ink near its edges thinning inward, a twinkling field
    // pixel on some of them; field pixels over the clear part of the photo are dropped.
    const buildCover = () => {
      inks = [];
      photo = [];
      if (!coverOpt || !coverEl) return;
      const box = coverEl.getBoundingClientRect();
      const origin = canvas.getBoundingClientRect();
      const bx = box.left - origin.left;
      const by = box.top - origin.top;
      const e = (window.matchMedia("(min-width: 1024px)").matches && coverOpt.edgesLg) || coverOpt.edges;
      const side = (pos: number, size: number, share = 0) => (share > 0 ? Math.max(0, 1 - pos / (size * share)) : 0);
      const ink = new Set<number>();
      const cols = Math.ceil(width / CELL);
      for (let r = Math.max(0, Math.floor(by / CELL)); r * CELL < by + box.height && r * CELL < height; r++)
        for (let c = Math.max(0, Math.floor(bx / CELL)); c * CELL < bx + box.width && c < cols; c++) {
          const x = c * CELL + CELL / 2 - bx;
          const y = r * CELL + CELL / 2 - by;
          if (x < 0 || y < 0 || x > box.width || y > box.height) continue;
          const t = Math.max(side(x, box.width, e.left), side(box.width - x, box.width, e.right), side(y, box.height, e.top), side(box.height - y, box.height, e.bottom));
          if (Math.random() < t ** 0.8) {
            ink.add(r * cols + c);
            inks.push({ x: c * CELL, y: r * CELL });
            if (Math.random() < 0.3 * t)
              cells.push({
                x: c * CELL + (CELL - SIZE) / 2,
                y: r * CELL + (CELL - SIZE) / 2,
                depth: 0.35 + 0.5 * t,
                fade: 1,
                phase: Math.random() * Math.PI * 2,
                speed: 0.0008 + Math.random() * 0.0028,
              });
          } else if (Math.random() < 0.35) photo.push({ x: c * CELL + (CELL - SIZE) / 2, y: r * CELL + (CELL - SIZE) / 2 });
        }
      const inBox = (cell: Cell) => cell.x + SIZE > bx && cell.x < bx + box.width && cell.y + SIZE > by && cell.y < by + box.height;
      cells = cells.filter((cell) => !inBox(cell) || ink.has(Math.floor(cell.y / CELL) * cols + Math.floor(cell.x / CELL)));
    };

    // Total brightness the cursor adds at a point: expanding rings plus a glow under the pointer.
    const boostAt = (cx: number, cy: number, now: number) => {
      let boost = 0;
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
      return boost;
    };

    const draw = (now: number) => {
      frame = 0;
      ctx.clearRect(0, 0, width, height);

      while (waves.length && now - waves[0].t0 > WAVE_LIFE) waves.shift();

      ctx.fillStyle = INK;
      for (const k of inks) ctx.fillRect(k.x, k.y, CELL, CELL);
      // The waves cross the photo as a ring of pixels.
      if (waves.length || pointer)
        for (const p of photo) {
          const a = Math.min(0.85, boostAt(p.x + SIZE / 2, p.y + SIZE / 2, now) * 0.6);
          if (a < 0.03) continue;
          ctx.fillStyle = `rgba(233,213,255,${a})`;
          ctx.fillRect(p.x, p.y, SIZE, SIZE);
        }

      for (const cell of cells) {
        // Base brightness: dim on the sparse side, bright on the dense edge.
        const base = 0.12 + 0.88 * cell.depth ** 1.6;
        // Chaotic twinkle: two detuned sines per cell, squared so pixels sit
        // mostly dark and flash bright — more contrast than a linear blend.
        const wave = reduced ? 0.7 : 0.5 + 0.32 * Math.sin(now * cell.speed + cell.phase) + 0.18 * Math.sin(now * cell.speed * 2.7 + cell.phase * 1.3);
        const tw = wave * wave * 1.35;
        let alpha = base * cell.fade * Math.max(0.04, tw);

        const boost = boostAt(cell.x + SIZE / 2, cell.y + SIZE / 2, now);
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
    if (coverEl) ro.observe(coverEl);
    target.addEventListener("pointermove", onMove);
    target.addEventListener("pointerleave", onLeave);

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
  }, [start, direction, density, fade, coverKey]);

  return <canvas ref={canvasRef} aria-hidden="true" className={cn("pointer-events-none block size-full", className)} />;
}
