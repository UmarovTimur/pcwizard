"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

const PX = 3; // one art pixel, px (as in the sparkles)
const STEP = 50; // animation step, ms
const TOP = 70; // keep clear of the header row, px
const AVOID_PAD = 16; // clearance around text and buttons, px
const AVOID = "h1, h2, h3, p, li, a, button, [data-pixel-avoid]";

// From the white-hot middle of a streak out to its violet tips
const SHADES = ["#ffffff", "#f3e8ff", "#d8b4fe", "#a855f7"];
const HALO = "rgba(168,85,247,0.24)";
const TRAIL = ["#ffffff", "#f3e8ff", "#e9d5ff", "#d8b4fe", "#c084fc", "#a855f7", "#9333ea", "#7c3aed"];

interface Streak {
  x: number; // centre, art pixels
  y: number;
  dx: number;
  dy: number;
  half: number; // half-length at full size, art pixels
  grow: number; // steps to open (and to close)
  hold: number; // steps at full size
  t: number;
}

interface Comet {
  x: number; // head, art pixels
  y: number;
  dx: number; // art pixels per step
  dy: number;
  life: number;
}

const rand = (a: number, b: number) => a + Math.random() * (b - a);
const randInt = (a: number, b: number) => Math.floor(rand(a, b + 1));

/**
 * Glowing pixel streaks in the upper part of the field: short flat lines that open out from a
 * bright point, shine with a soft halo and a little cross at their middle,
 * and close again, twinkling like the sparkles; now and then a shooting star slides straight across.
 * They keep clear of the header row and of the text, links and buttons in the enclosing <section>.
 *
 * `reach`: how far down the streaks may appear, as a share of the field's height.
 */
export function PixelStreaks({ className, reach = 0.55 }: { className?: string; reach?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const target = canvas?.closest<HTMLElement>("section, footer");
    const ctx = canvas?.getContext("2d");
    if (!canvas || !target || !ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const avoidEls = [...target.querySelectorAll<HTMLElement>(AVOID), ...document.querySelectorAll<HTMLElement>("[data-pixel-avoid]")].filter(
      (el) => !el.closest("[aria-hidden=true]"),
    );

    let cols = 0;
    let rows = 0;
    let boxes: { x0: number; y0: number; x1: number; y1: number }[] = []; // art pixels
    let streaks: Streak[] = [];
    let comets: Comet[] = [];
    let want = 0;
    let frame = 0;
    let last = 0;

    const blocked = (x: number, y: number) =>
      x < 0 || x >= cols || y < TOP / PX || y >= rows * reach || boxes.some((b) => x >= b.x0 && x <= b.x1 && y >= b.y0 && y <= b.y1);

    const build = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cols = Math.floor(w / PX);
      rows = Math.floor(h / PX);
      const rect = canvas.getBoundingClientRect();
      boxes = avoidEls.flatMap((el) => {
        const b = el.getBoundingClientRect();
        if (!b.width || !b.height) return [];
        return [
          {
            x0: Math.floor((b.left - rect.left - AVOID_PAD) / PX),
            y0: Math.floor((b.top - rect.top - AVOID_PAD) / PX),
            x1: Math.ceil((b.right - rect.left + AVOID_PAD) / PX),
            y1: Math.ceil((b.bottom - rect.top + AVOID_PAD) / PX),
          },
        ];
      });
      want = Math.max(5, Math.round((w * h * reach) / 30000));
      streaks = [];
      comets = [];
    };

    // A new streak somewhere open: both its ends must miss the text too
    const spawn = (t = 0) => {
      for (let tries = 0; tries < 12; tries++) {
        const [dx, dy] = [1, 0]; // always flat
        const half = randInt(4, 12);
        const x = randInt(0, cols - 1);
        const y = randInt(Math.ceil(TOP / PX), Math.floor(rows * reach));
        if (blocked(x, y) || blocked(x - dx * half, y - dy * half) || blocked(x + dx * half, y + dy * half)) continue;
        streaks.push({ x, y, dx, dy, half, grow: randInt(4, 7), hold: randInt(4, 14), t });
        return;
      }
    };

    const px = (x: number, y: number, color: string) => {
      ctx.fillStyle = color;
      ctx.fillRect(x * PX, y * PX, PX, PX);
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const s of streaks) {
        // Open, hold, close: the visible half-length and how bright the middle burns
        const close = s.grow + s.hold;
        const open = s.t < s.grow ? (s.t + 1) / s.grow : s.t < close ? 1 : Math.max(0, 1 - (s.t - close + 1) / s.grow);
        const reachNow = Math.round(s.half * open);
        // Soft halo first, then the line on top
        ctx.fillStyle = HALO;
        for (let k = -reachNow; k <= reachNow; k++) ctx.fillRect((s.x + s.dx * k - 1) * PX, (s.y + s.dy * k - 1) * PX, PX * 3, PX * 3);
        for (let k = -reachNow; k <= reachNow; k++) {
          const d = reachNow ? Math.abs(k) / (s.half + 1) : 0;
          px(s.x + s.dx * k, s.y + s.dy * k, SHADES[Math.min(SHADES.length - 1, Math.floor(d * SHADES.length))]);
        }
        // As it reaches full size a little cross flares across the middle (arms 1, 2, 1)
        const flare = s.t - s.grow;
        if (flare >= 0 && flare < 3) {
          for (let a = 1; a <= (flare === 1 ? 2 : 1); a++) {
            px(s.x - s.dy * a, s.y + s.dx * a, SHADES[a]);
            px(s.x + s.dy * a, s.y - s.dx * a, SHADES[a]);
          }
        }
      }
      for (const c of comets) {
        for (let k = TRAIL.length - 1; k >= 0; k--) {
          const x = Math.round(c.x - c.dx * k * 0.5);
          const y = Math.round(c.y - c.dy * k * 0.5);
          if (k < 3) {
            ctx.fillStyle = HALO;
            ctx.fillRect((x - 1) * PX, (y - 1) * PX, PX * 3, PX * 3);
          }
          px(x, y, TRAIL[k]);
        }
      }
    };

    const step = () => {
      streaks = streaks.filter((s) => ++s.t < s.grow * 2 + s.hold);
      if (streaks.length < want && Math.random() < 0.5) spawn();
      comets = comets.filter((c) => {
        c.x += c.dx;
        c.y += c.dy;
        return --c.life > 0 && !blocked(Math.round(c.x), Math.round(c.y));
      });
      // Now and then a shooting star slides straight across the top
      if (!comets.length && Math.random() < 0.02) {
        const dir = Math.random() < 0.5 ? -1 : 1;
        const x = randInt(Math.round(cols * 0.15), Math.round(cols * 0.85));
        const y = randInt(Math.ceil(TOP / PX), Math.floor(rows * reach));
        if (!blocked(x, y)) comets.push({ x, y, dx: dir * 3, dy: 0, life: randInt(14, 28) });
      }
    };

    const loop = (now: number) => {
      frame = requestAnimationFrame(loop);
      if (now - last < STEP) return;
      last = now;
      step();
      draw();
    };

    // Fill the sky: frozen at full size for reduced motion, otherwise part-way through their
    // lives, so it isn't empty for the first second
    const populate = () => {
      for (let k = 0; k < want; k++) spawn(reduced ? 0 : randInt(0, 12));
      if (reduced) for (const s of streaks) s.t = s.grow + s.hold - 1;
    };

    build();
    populate();
    draw();
    if (!reduced) frame = requestAnimationFrame(loop);

    let rebuild = 0;
    const ro = new ResizeObserver(() => {
      cancelAnimationFrame(rebuild);
      rebuild = requestAnimationFrame(() => {
        build();
        populate();
        draw();
      });
    });
    ro.observe(canvas);
    for (const el of avoidEls) ro.observe(el);

    // Pause while off screen
    const io = new IntersectionObserver(([entry]) => {
      if (reduced) return;
      if (entry.isIntersecting) {
        if (!frame) frame = requestAnimationFrame(loop);
      } else if (frame) {
        cancelAnimationFrame(frame);
        frame = 0;
      }
    });
    io.observe(canvas);

    return () => {
      if (frame) cancelAnimationFrame(frame);
      cancelAnimationFrame(rebuild);
      ro.disconnect();
      io.disconnect();
    };
  }, [reach]);

  return <canvas ref={canvasRef} aria-hidden="true" className={cn("pointer-events-none block size-full", className)} />;
}
