"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

// Glyphs cycled through before each letter settles (all present in Press Start 2P).
const GLYPHS = "АБВГДЕЖЗИКЛМНОПРСТУФХЦЧШЩЭЮЯ0123456789#$%&*+=?<>/";
const FRAME = 45; // ms between glyph swaps

/** Deterministic scramble for the first paint (server and client agree, so no hydration mismatch). */
const seeded = (text: string) => [...text].map((ch, i) => (ch === " " ? ch : GLYPHS[(i * 7 + ch.charCodeAt(0)) % GLYPHS.length])).join("");

/**
 * Neon headline text that "decodes": letters cycle through random glyphs and lock
 * in left to right. The first paint is already scrambled; with reduced motion the
 * final text is shown right away.
 * The font is monospaced, so the line width never jumps while scrambling.
 */
export function ScrambleText({ text, delay = 0, duration = 1100, className }: { text: string; delay?: number; duration?: number; className?: string }) {
  const [out, setOut] = useState(() => seeded(text));

  useEffect(() => {
    const chars = [...text];
    // Each letter locks at a time that grows left to right, with a little jitter.
    const lockAt = chars.map((_, i) => (i / chars.length) * duration * 0.75 + Math.random() * duration * 0.25);
    const start = performance.now() + (window.matchMedia("(prefers-reduced-motion: reduce)").matches ? -duration : delay);
    let last = 0;
    let raf = 0;

    const tick = (now: number) => {
      const t = now - start;
      if (t >= duration) {
        setOut(text);
        return;
      }
      if (now - last >= FRAME) {
        last = now;
        setOut(chars.map((ch, i) => (ch === " " || t >= lockAt[i] ? ch : GLYPHS[Math.floor(Math.random() * GLYPHS.length)])).join(""));
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [text, delay, duration]);

  return (
    <span aria-hidden="true" className={cn("neon-fill", className)} data-text={out}>
      {out}
    </span>
  );
}
