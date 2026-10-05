"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

const FLASH = 0.25; // share of the timeline a cell spends flashing violet before turning solid
const INK = [11, 6, 20];
const VIOLET = [192, 132, 252];

/**
 * Canvas that fills its box with dark pixels in random order (each flashes violet
 * first) when `open`, and clears in reverse when closed. Used as the background of
 * the site menu panel and the contact popup. `cell` is the pixel size in px,
 * `duration` the time in ms for a full cover / uncover.
 */
export function PixelCurtain({ open, cell = 44, duration = 480, className }: { open: boolean; cell?: number; duration?: number; className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const api = useRef<{ animateTo: (target: number) => void } | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let cols = 0;
    let rows = 0;
    let thresholds: number[] = [];
    let progress = 0;
    let frame = 0;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < thresholds.length; i++) {
        const local = (progress - thresholds[i]) / FLASH;
        if (local <= 0) continue;
        const x = (i % cols) * cell;
        const y = Math.floor(i / cols) * cell;
        if (local >= 1) {
          ctx.fillStyle = `rgb(${INK.join(",")})`;
          ctx.fillRect(x, y, cell, cell);
        } else {
          // Flash: bright violet fading into ink, drawn as an inset square.
          const c = VIOLET.map((v, k) => Math.round(v + (INK[k] - v) * local));
          ctx.fillStyle = `rgb(${c.join(",")})`;
          ctx.fillRect(x + 1, y + 1, cell - 2, cell - 2);
        }
      }
    };

    const build = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cols = Math.ceil(w / cell);
      rows = Math.ceil(h / cell);
      thresholds = Array.from({ length: cols * rows }, () => Math.random() * (1 - FLASH));
      draw();
    };

    api.current = {
      animateTo: (target) => {
        cancelAnimationFrame(frame);
        if (reduced) {
          progress = target;
          draw();
          return;
        }
        const from = progress;
        const start = performance.now();
        const step = (now: number) => {
          const t = Math.min(1, (now - start) / (duration * Math.abs(target - from) || 1));
          progress = from + (target - from) * t;
          draw();
          if (t < 1) frame = requestAnimationFrame(step);
        };
        frame = requestAnimationFrame(step);
      },
    };

    build();
    const ro = new ResizeObserver(build);
    ro.observe(canvas);
    return () => {
      cancelAnimationFrame(frame);
      ro.disconnect();
      api.current = null;
    };
  }, [cell, duration]);

  useEffect(() => {
    api.current?.animateTo(open ? 1 : 0);
  }, [open]);

  return <canvas ref={canvasRef} aria-hidden="true" className={cn("pointer-events-none absolute inset-0 size-full", className)} />;
}
