"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

const FRAME = 90; // ms between redraws: the sky moves in steps, like sprite animation
const REF_W = 90; // the poster the sky is modelled on (public/images/whyus-pixel-sky.png), art pixels
const REF_H = 100;
const STAR_AREA = 450; // art pixels of sky per star
const STAR_MAX_LEVEL = 6.5; // stars only sit on the dark part of the sky

/** Packs "rrggbb" into the little-endian RGBA word that ImageData stores. */
const pack = (hex: string) => {
  const n = parseInt(hex, 16);
  return (0xff000000 | ((n & 0xff) << 16) | (n & 0xff00) | (n >> 16)) >>> 0;
};

// Sky colours from the dark corner to the heart of the glow.
const RAMP = ["2e1065", "3b0764", "4c1d95", "5b21b6", "6d28d9", "7c3aed", "9333ea", "a855f7", "c084fc", "d946ef", "e879f9", "f0abfc", "f5d0fe", "fdf4ff"].map(pack);
// A star's brightness steps as it twinkles: dim, normal, peak.
const STAR_TONES = ["c084fc", "f5d0fe", "ffffff"].map(pack);
// 2×2 ordered dither, the order in which the pixels of a block switch to the next colour.
const BAYER = [3, 1, 0, 2];

interface Star {
  x: number;
  y: number;
  phase: number;
  speed: number; // rad per second
  flare: boolean; // grows into a plus at its peak
}

/** Small deterministic PRNG (mulberry32), so the stars sit in the same places on every visit. */
function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Animated pixel-art sky: deep violet in the top left corner, a pink glow rising from the bottom
 * right, dithered steps between the shades. Slow waves of light run out from the glow, so the
 * dithered bands creep back and forth, and the stars twinkle. Drawn one canvas pixel per art
 * pixel and scaled up by a whole factor. Fills its (positioned) parent.
 */
export function PixelSky({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const box = canvas?.parentElement;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !box || !ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let cols = 0;
    let rows = 0;
    let image: ImageData | null = null;
    let out = new Uint32Array(0);
    // Per art pixel: resting colour level, distance from the glow, angle around it, dither threshold.
    let base = new Float32Array(0);
    let dist = new Float32Array(0);
    let angle = new Float32Array(0);
    let threshold = new Float32Array(0);
    let stars: Star[] = [];
    let frame = 0;
    let last = -FRAME;

    const build = () => {
      const width = box.clientWidth;
      const height = box.clientHeight;
      if (!width || !height) return;
      // Whole css pixels per art pixel, picked so the sky keeps the grain of the poster.
      const px = Math.max(3, Math.round(Math.max(width / REF_W, height / REF_H)));
      cols = Math.ceil(width / px);
      rows = Math.ceil(height / px);
      canvas.width = cols;
      canvas.height = rows;
      canvas.style.width = `${cols * px}px`;
      canvas.style.height = `${rows * px}px`;

      image = ctx.createImageData(cols, rows);
      out = new Uint32Array(image.data.buffer);
      base = new Float32Array(cols * rows);
      dist = new Float32Array(cols * rows);
      angle = new Float32Array(cols * rows);
      threshold = new Float32Array(cols * rows);
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          // The glow sits just outside the bottom right corner and is a little taller than wide.
          const dx = ((x + 0.5) / cols - 0.978) * REF_W;
          const dy = ((y + 0.5) / rows - 1.04) * REF_H * 0.8;
          const d = Math.hypot(dx, dy);
          const i = y * cols + x;
          dist[i] = d;
          angle[i] = Math.atan2(dy, dx);
          base[i] = 13.6 - 0.3136 * d ** 0.8;
          threshold[i] = (BAYER[(y & 1) * 2 + (x & 1)] + 0.5) / 4;
        }
      }

      stars = [];
      const random = rng(7);
      const count = Math.round((cols * rows) / STAR_AREA);
      for (let tries = 0; stars.length < count && tries < count * 20; tries++) {
        const x = Math.floor(random() * cols);
        const y = Math.floor(random() * rows);
        const phase = random() * Math.PI * 2;
        const speed = 0.6 + random() * 1.3;
        const flare = random() < 0.3;
        if (base[y * cols + x] < STAR_MAX_LEVEL) stars.push({ x, y, phase, speed, flare });
      }
      last = -FRAME;
    };

    const draw = (now: number) => {
      frame = reduced ? 0 : requestAnimationFrame(draw);
      if (!image || now - last < FRAME) return;
      last = now;
      const t = reduced ? 0 : now / 1000;

      const top = RAMP.length - 1;
      for (let i = 0; i < out.length; i++) {
        const d = dist[i];
        // Light rolls outward from the glow in rings, and a slower swell bends the rings.
        const level = base[i] + 0.45 * Math.sin(d * 0.16 - t * 0.9) + 0.3 * Math.sin(angle[i] * 4 + d * 0.05 + t * 0.5);
        const whole = Math.floor(level);
        const step = whole + (level - whole > threshold[i] ? 1 : 0);
        out[i] = RAMP[step < 0 ? 0 : step > top ? top : step];
      }

      for (const s of stars) {
        const glow = Math.sin(t * s.speed + s.phase);
        if (glow < -0.7) continue; // the star is out for a moment
        out[s.y * cols + s.x] = STAR_TONES[glow > 0.55 ? 2 : glow > -0.2 ? 1 : 0];
        if (s.flare && glow > 0.85) {
          if (s.x > 0) out[s.y * cols + s.x - 1] = STAR_TONES[1];
          if (s.x < cols - 1) out[s.y * cols + s.x + 1] = STAR_TONES[1];
          if (s.y > 0) out[(s.y - 1) * cols + s.x] = STAR_TONES[1];
          if (s.y < rows - 1) out[(s.y + 1) * cols + s.x] = STAR_TONES[1];
        }
      }

      ctx.putImageData(image, 0, 0);
    };

    build();
    frame = requestAnimationFrame(draw);

    const ro = new ResizeObserver(() => {
      build();
      if (!frame) frame = requestAnimationFrame(draw);
    });
    ro.observe(box);

    // Pause the loop while the sky is off screen.
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        if (!frame) frame = requestAnimationFrame(draw);
      } else if (frame) {
        cancelAnimationFrame(frame);
        frame = 0;
      }
    });
    io.observe(box);

    return () => {
      if (frame) cancelAnimationFrame(frame);
      ro.disconnect();
      io.disconnect();
    };
  }, []);

  // Anchored to the bottom right corner, where the glow is; the spare part of the last art pixel
  // row and column is cropped by the parent.
  return <canvas ref={canvasRef} aria-hidden="true" className={cn("pointer-events-none absolute right-0 bottom-0 block max-w-none [image-rendering:pixelated]", className)} />;
}
