"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

const SCALE = 2; // css px per art pixel
const ROWS = 130; // band height in art pixels
const STEP_MS = 22; // a pulse moves one art pixel per step
const TRAIL = 14; // art pixels of fading tail behind each pulse
const PER_COLS = 14; // one pulse per this many art columns
const HALO = "rgba(168,85,247,0.45)"; // around each pulse head
const TAIL = ["#ffffff", "#f3e8ff", "#e9d5ff", "#d8b4fe", "#c084fc", "#a855f7"];

const DIRS = [
  [1, 0],
  [-1, 0],
  [0, 1],
  [0, -1],
  [1, 1],
  [1, -1],
  [-1, 1],
  [-1, -1],
] as const;

interface Pulse {
  path: [number, number][]; // head last
  dx: number;
  dy: number;
  left: number; // steps before it dies and starts over elsewhere
}

const rand = (a: number, b: number) => a + Math.random() * (b - a);

/**
 * A band of dim violet circuit-board traces, tiled across the width, with bright pixel pulses
 * running along them like current. Fades out top and bottom; still with reduced motion.
 * Traces: "Circuitboard" by ArtBIT, CC0, opengameart.org.
 */
export function CircuitTraces({ className }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let mask: Uint8Array | null = null;
    let mw = 0;
    let mh = 0;
    let cols = 0;
    const base = document.createElement("canvas");
    let pulses: Pulse[] = [];
    let raf = 0;
    let visible = false;
    let acc = 0;
    let lastT = 0;

    const trace = (x: number, y: number) => x >= 0 && y >= 0 && x < cols && y < ROWS && mask![(x % mw) + (y % mh) * mw] > 0;

    const spawn = (): Pulse => {
      for (let i = 0; i < 60; i++) {
        const x = Math.floor(rand(0, cols));
        const y = Math.floor(rand(0, ROWS));
        if (trace(x, y)) {
          const [dx, dy] = DIRS[Math.floor(rand(0, 8))];
          return { path: [[x, y]], dx, dy, left: Math.floor(rand(60, 220)) };
        }
      }
      return { path: [[0, 0]], dx: 1, dy: 0, left: 0 };
    };

    // One step along the trace: keep going the same way where it can, never doubling back
    const advance = (p: Pulse) => {
      const [x, y] = p.path[p.path.length - 1];
      let best: readonly [number, number] | null = null;
      let score = -Infinity;
      for (const d of DIRS) {
        const nx = x + d[0];
        const ny = y + d[1];
        if (!trace(nx, ny) || p.path.some(([px, py]) => px === nx && py === ny)) continue;
        const s = d[0] * p.dx + d[1] * p.dy + (d[0] && d[1] ? -0.3 : 0) + Math.random() * 0.2;
        if (s > score) {
          score = s;
          best = d;
        }
      }
      p.left--;
      if (!best || p.left <= 0) return false;
      p.dx = best[0];
      p.dy = best[1];
      p.path.push([x + best[0], y + best[1]]);
      if (p.path.length > TRAIL) p.path.shift();
      return true;
    };

    const resize = () => {
      if (!mask) return;
      cols = Math.ceil(canvas.clientWidth / SCALE);
      canvas.width = cols;
      canvas.height = ROWS;
      base.width = cols;
      base.height = ROWS;
      const b = base.getContext("2d")!;
      const img = b.createImageData(cols, ROWS);
      for (let y = 0; y < ROWS; y++) {
        for (let x = 0; x < cols; x++) {
          if (!trace(x, y)) continue;
          const i = (y * cols + x) * 4;
          img.data[i] = 124;
          img.data[i + 1] = 58;
          img.data[i + 2] = 237;
          img.data[i + 3] = 82;
        }
      }
      b.putImageData(img, 0, 0);
      pulses = Array.from({ length: Math.max(6, Math.round(cols / PER_COLS)) }, spawn);
      draw();
    };

    const draw = () => {
      ctx.clearRect(0, 0, cols, ROWS);
      ctx.drawImage(base, 0, 0);
      for (const p of pulses) {
        const n = p.path.length;
        const [hx, hy] = p.path[n - 1];
        ctx.fillStyle = HALO;
        ctx.fillRect(hx - 1, hy - 1, 3, 3);
        for (let i = 0; i < n; i++) {
          const k = n - 1 - i; // 0 at the head
          ctx.globalAlpha = 1 - k / TRAIL;
          ctx.fillStyle = TAIL[Math.min(TAIL.length - 1, Math.floor((k / TRAIL) * TAIL.length))];
          ctx.fillRect(p.path[i][0], p.path[i][1], 1, 1);
        }
        ctx.globalAlpha = 1;
      }
    };

    const frame = (now: number) => {
      acc += now - lastT;
      lastT = now;
      let moved = false;
      while (acc >= STEP_MS) {
        acc -= STEP_MS;
        moved = true;
        pulses = pulses.map((p) => (advance(p) ? p : spawn()));
      }
      if (moved) draw();
      if (visible) raf = requestAnimationFrame(frame);
    };

    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      cancelAnimationFrame(raf);
      if (visible && mask && !still) {
        lastT = performance.now();
        raf = requestAnimationFrame(frame);
      }
    });
    const ro = new ResizeObserver(resize);

    const img = new Image();
    img.onload = () => {
      mw = img.width;
      mh = img.height;
      const c = document.createElement("canvas");
      c.width = mw;
      c.height = mh;
      const g = c.getContext("2d")!;
      g.drawImage(img, 0, 0);
      const data = g.getImageData(0, 0, mw, mh).data;
      mask = new Uint8Array(mw * mh);
      for (let i = 0; i < mask.length; i++) mask[i] = data[i * 4 + 3] > 127 ? 1 : 0;
      ro.observe(canvas);
      io.observe(canvas);
    };
    img.src = "/images/decor/circuit.png";

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-x-0 w-full [image-rendering:pixelated] [mask-image:linear-gradient(to_bottom,transparent,black_25%,black_60%,transparent)]",
        className,
      )}
      style={{ height: ROWS * SCALE }}
    />
  );
}
