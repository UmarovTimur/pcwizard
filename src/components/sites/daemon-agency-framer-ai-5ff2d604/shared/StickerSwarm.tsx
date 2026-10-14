"use client";

import { useEffect, useRef, type RefObject } from "react";
import { cn } from "@/lib/utils";

// public/images/stickers/<name>.png
const NAMES = ["chair", "crate", "csgo", "gamepad", "gg", "grenade", "headset", "headshot", "knife", "monitor", "mousepad", "pc"];

const SIZE = [112, 150]; // a sticker's side, px
const SIZE_MIN = 84; // ...and the least it shrinks to where the space beside the content is narrow
const SPRITE = SIZE[1]; // size the sticker sprites are baked at (the largest drawn), px
const PAD = 24; // room around a baked sprite for its drop shadow, px
const G = 5; // the glow is drawn at 1/G scale and blown up unsmoothed, so it comes out in blocks
const PX = 3; // one sparkle pixel, px

const SPAWN_MS = 190; // at most one new sticker per this while the cursor moves
const SPAWN_DIST = 30; // ...and only after the cursor has travelled this far, px
const MAX = 12; // stickers on screen; past this the oldest pops
const GAP = 16; // clearance kept around the content, px
const HEADER = 80; // the fixed header bar at the top of the viewport, px
const LIFE = [2.2, 3.4]; // seconds a sticker floats before it pops
const IN_MS = 900; // the springy pop-in, wobble included
const FADE_MS = 120; // ...of which this long to become opaque
const OUT_MS = 260;

const SPRING = 22; // pull out of the content and off the edges, 1/s²
const DRAG = 1.4; // velocity damping in open space, 1/s
const DRAG_HIT = 6; // ...and while being pushed out, so it settles without bouncing

const VIOLET = "#a855f7";
const SPARKS = ["#ffffff", "#f3e8ff", "#e9d5ff", "#d8b4fe", "#c084fc"];

interface Art {
  sprite: HTMLCanvasElement; // the sticker with its shadow, at SPRITE + 2·PAD
  halo: HTMLCanvasElement; // violet blurred silhouette at 1/G scale
}

interface Sticker {
  art: Art;
  x: number; // centre, px from the host's top-left
  y: number;
  vx: number;
  vy: number;
  size: number;
  tilt: number; // deg
  born: number;
  life: number; // ms
  leaving: number | null;
  phase: number;
  nextSpark: number;
}

interface Spark {
  x: number;
  y: number;
  vx: number;
  vy: number;
  born: number;
  life: number;
  color: string;
}

interface Box {
  l: number;
  t: number;
  r: number;
  b: number;
}

const rand = (a: number, b: number) => a + Math.random() * (b - a);
const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));
// A released spring: shoots past 1 by about a quarter, then wobbles around it and settles.
const easeOutElastic = (p: number) => (p >= 1 ? 1 : 1 - Math.exp(-6.5 * p) * Math.cos(p * Math.PI * 5));

function bake(img: HTMLImageElement, dpr: number): Art {
  const full = SPRITE + PAD * 2;
  const sprite = document.createElement("canvas");
  sprite.width = sprite.height = Math.round(full * dpr);
  const s = sprite.getContext("2d")!;
  s.scale(dpr, dpr);
  s.shadowColor = "rgba(0,0,0,0.55)";
  s.shadowBlur = 12;
  s.shadowOffsetY = 8;
  s.drawImage(img, PAD, PAD, SPRITE, SPRITE);

  // Silhouette a bit bigger than the sticker, flooded violet and softened at low resolution
  const n = Math.ceil((SPRITE * 1.5) / G);
  const flat = document.createElement("canvas");
  flat.width = flat.height = n;
  const f = flat.getContext("2d")!;
  const inner = (SPRITE * 1.12) / G;
  f.drawImage(img, (n - inner) / 2, (n - inner) / 2, inner, inner);
  f.globalCompositeOperation = "source-in";
  f.fillStyle = VIOLET;
  f.fillRect(0, 0, n, n);
  const halo = document.createElement("canvas");
  halo.width = halo.height = n;
  const h = halo.getContext("2d")!;
  h.filter = "blur(1.6px)";
  h.drawImage(flat, 0, 0);
  h.filter = "none";
  h.drawImage(flat, 0, 0);
  return { sprite, halo };
}

/**
 * Stickers that pop out under a moving mouse cursor inside the parent element, at an interval,
 * in a flash of blocky violet glow and pixel sparkles. Each drifts a little way and then hovers,
 * bobbing. They never appear over `avoid` (the content); one that lands partly on it slides off
 * sideways. Mouse only, and off with reduced motion.
 */
export function StickerSwarm({ avoid, className }: { avoid: RefObject<HTMLElement | null>; className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const host = canvas?.parentElement;
    if (!canvas || !host) return;
    if (!matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = canvas.getContext("2d")!;
    const glow = document.createElement("canvas");
    const gctx = glow.getContext("2d")!;
    let dpr = 1;
    let W = 0;
    let H = 0;
    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = host.clientWidth;
      H = host.clientHeight;
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      glow.width = Math.ceil(W / G);
      glow.height = Math.ceil(H / G);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(host);

    // The artwork loads (through the image optimiser, as small webp) as the section scrolls near
    const arts: Art[] = [];
    let loading = false;
    const load = () => {
      if (loading) return;
      loading = true;
      for (const name of NAMES) {
        const img = new Image();
        img.decoding = "async";
        img.onload = () => arts.push(bake(img, dpr));
        img.src = `/_next/image?url=${encodeURIComponent(`/images/stickers/${name}.png`)}&w=384&q=75`;
      }
    };

    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          load();
          io.disconnect();
        }
      },
      { rootMargin: "600px 0px" },
    );
    io.observe(host);

    const stickers: Sticker[] = [];
    const sparks: Spark[] = [];
    let lastArt: Art | null = null;

    const contentBox = (): Box | null => {
      const el = avoid.current;
      if (!el) return null;
      const h = host.getBoundingClientRect();
      const r = el.getBoundingClientRect();
      return { l: r.left - h.left - GAP, t: r.top - h.top - GAP, r: r.right - h.left + GAP, b: r.bottom - h.top + GAP };
    };

    const burst = (x: number, y: number, n: number, radius: number, now: number) => {
      for (let i = 0; i < n; i++) {
        const a = rand(0, Math.PI * 2);
        const d = rand(0.3, 1) * radius;
        const sp = rand(20, 70);
        sparks.push({
          x: x + Math.cos(a) * d,
          y: y + Math.sin(a) * d,
          vx: Math.cos(a) * sp,
          vy: Math.sin(a) * sp - 15,
          born: now + rand(0, 160),
          life: rand(500, 1000),
          color: SPARKS[Math.floor(Math.random() * SPARKS.length)],
        });
      }
    };

    const spawn = (x: number, y: number, now: number, box: Box | null) => {
      const pool = arts.length > 1 ? arts.filter((a) => a !== lastArt) : arts;
      if (!pool.length) return;
      const art = pool[Math.floor(Math.random() * pool.length)];
      lastArt = art;
      // Drift off in a random direction, a little upwards and away from the content
      let ax = 0;
      let ay = 0;
      if (box) {
        ax = x < box.l ? -1 : x > box.r ? 1 : 0;
        ay = y < box.t ? -1 : y > box.b ? 1 : 0;
      }
      const a = rand(0, Math.PI * 2);
      const sp = rand(50, 130);
      // No bigger than the free strip beside the content, so it does not sit on the questions
      const room = box ? Math.max(box.l, W - box.r) : W;
      const big = clamp(room, SIZE_MIN, SIZE[1]);
      const size = rand((big * SIZE[0]) / SIZE[1], big);
      stickers.push({
        art,
        x: x + rand(-10, 10),
        y: y + rand(-10, 10),
        vx: Math.cos(a) * sp + ax * 60,
        vy: Math.sin(a) * sp - 30 + ay * 30,
        size,
        tilt: rand(-12, 12),
        born: now,
        life: rand(LIFE[0], LIFE[1]) * 1000,
        leaving: null,
        phase: rand(0, Math.PI * 2),
        nextSpark: now + IN_MS,
      });
      burst(x, y, 12, size * 0.6, now);
      const staying = stickers.filter((s) => s.leaving === null);
      if (staying.length > MAX) staying[0].leaving = now;
      start();
    };

    // Pointer: count the distance travelled and drop a sticker once enough time and distance have passed
    let prev: { x: number; y: number } | null = null;
    let moved = 0;
    let lastSpawn = 0;
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse" && e.pointerType !== "pen") return;
      load();
      const r = host.getBoundingClientRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      if (prev) moved += Math.hypot(x - prev.x, y - prev.y);
      prev = { x, y };
      const now = performance.now();
      if (now - lastSpawn < SPAWN_MS || moved < SPAWN_DIST) return;
      // Not under the fixed header either
      if (e.clientY < HEADER) return;
      const box = contentBox();
      // Over the content: no sticker here
      if (box && x > box.l && x < box.r && y > box.t && y < box.b) return;
      lastSpawn = now;
      moved = 0;
      spawn(x, y, now, box);
    };
    const onLeave = () => {
      prev = null;
    };
    host.addEventListener("pointermove", onMove);
    host.addEventListener("pointerleave", onLeave);

    const step = (s: Sticker, dt: number, box: Box | null) => {
      const h = s.size * 0.42;
      let ax = 0;
      let ay = 0;
      let hit = false;

      if (box) {
        const cx = clamp(s.x, box.l, box.r);
        const cy = clamp(s.y, box.t, box.b);
        if (cx !== s.x || cy !== s.y) {
          // Outside but grazing an edge or a corner: ease straight out
          const d = Math.hypot(s.x - cx, s.y - cy);
          if (d < h) {
            ax += ((s.x - cx) / d) * (h - d) * SPRING;
            ay += ((s.y - cy) / d) * (h - d) * SPRING;
            hit = true;
          }
        } else {
          // Centre inside: slide out to the nearest side, preferring left and right
          const left = s.x - box.l + h;
          const right = box.r - s.x + h;
          const top = (s.y - box.t + h) * 1.6;
          const bottom = (box.b - s.y + h) * 1.6;
          const m = Math.min(left, right, top, bottom);
          const pen = Math.min(m, 140) * SPRING;
          if (m === left) ax -= pen;
          else if (m === right) ax += pen;
          else if (m === top) ay -= pen;
          else ay += pen;
          hit = true;
        }
      }

      // Soft walls at the host's edges
      if (s.x < h) ax += (h - s.x) * SPRING;
      if (s.x > W - h) ax -= (s.x - (W - h)) * SPRING;
      if (s.y < h) ay += (h - s.y) * SPRING;
      if (s.y > H - h) ay -= (s.y - (H - h)) * SPRING;

      s.vx += ax * dt;
      s.vy += ay * dt;
      const drag = Math.exp(-(hit ? DRAG_HIT : DRAG) * dt);
      s.vx *= drag;
      s.vy *= drag;
      s.x += s.vx * dt;
      s.y += s.vy * dt;
    };

    // Stickers nudge each other apart instead of piling up
    const separate = (dt: number) => {
      for (let i = 0; i < stickers.length; i++) {
        for (let j = i + 1; j < stickers.length; j++) {
          const a = stickers[i];
          const b = stickers[j];
          const dx = b.x - a.x;
          const dy = b.y - a.y;
          const d = Math.hypot(dx, dy) || 0.01;
          const min = (a.size + b.size) * 0.48;
          if (d >= min) continue;
          const f = (min - d) * 16 * dt;
          a.vx -= (dx / d) * f;
          a.vy -= (dy / d) * f;
          b.vx += (dx / d) * f;
          b.vy += (dy / d) * f;
        }
      }
    };

    let raf = 0;
    let running = false;
    let lastT = 0;

    const frame = (now: number) => {
      const dt = Math.min(0.05, (now - lastT) / 1000);
      lastT = now;
      const t = now / 1000;
      const box = contentBox();

      separate(dt);
      for (let i = stickers.length - 1; i >= 0; i--) {
        const s = stickers[i];
        if (s.leaving === null && now - s.born > s.life) {
          s.leaving = now;
          burst(s.x, s.y, 8, s.size * 0.45, now);
        }
        if (s.leaving !== null && now - s.leaving > OUT_MS) {
          stickers.splice(i, 1);
          continue;
        }
        step(s, dt, box);
        // While it hovers it lets off the odd sparkle from its edge
        if (s.leaving === null && now > s.nextSpark) {
          const a = rand(0, Math.PI * 2);
          const d = s.size * rand(0.4, 0.55);
          sparks.push({
            x: s.x + Math.cos(a) * d,
            y: s.y + Math.sin(a) * d,
            vx: Math.cos(a) * 12,
            vy: Math.sin(a) * 12 - 10,
            born: now,
            life: rand(600, 1100),
            color: SPARKS[Math.floor(Math.random() * SPARKS.length)],
          });
          s.nextSpark = now + rand(350, 1000);
        }
      }

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);

      // Where each sticker is drawn this frame
      const poses = stickers.map((s) => {
        const p = clamp((now - s.born) / IN_MS, 0, 1);
        const k = easeOutElastic(p);
        const q = s.leaving === null ? 0 : clamp((now - s.leaving) / OUT_MS, 0, 1);
        const settle = clamp((now - s.born) / 1200, 0, 1);
        return {
          s,
          y: s.y + Math.sin(t * 1.6 + s.phase) * 5 * settle,
          rot: ((s.tilt - 18 * (1 - k) + 10 * q + Math.sin(t * 1.1 + s.phase) * 3 * settle) * Math.PI) / 180,
          scale: (0.25 + 0.75 * k) * (1 - 0.4 * q) * (s.size / SPRITE),
          alpha: clamp((now - s.born) / FADE_MS, 0, 1) * (1 - q),
          flash: 1 + Math.max(0, 1 - (now - s.born) / 400) * 1.2,
        };
      });

      // Blocky violet glow under the stickers, flaring as each one pops in
      gctx.setTransform(1, 0, 0, 1, 0, 0);
      gctx.clearRect(0, 0, glow.width, glow.height);
      for (const { s, y, scale, alpha, flash } of poses) {
        const n = s.art.halo.width * scale;
        gctx.globalAlpha = clamp(alpha * (0.6 + 0.2 * Math.sin(t * 2 + s.phase)) * flash, 0, 1);
        gctx.drawImage(s.art.halo, s.x / G - n / 2, y / G - n / 2, n, n);
      }
      ctx.save();
      ctx.imageSmoothingEnabled = false;
      ctx.globalCompositeOperation = "lighter";
      ctx.drawImage(glow, 0, 0, glow.width * G, glow.height * G);
      ctx.restore();

      const full = SPRITE + PAD * 2;
      for (const { s, y, rot, scale, alpha } of poses) {
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.translate(s.x, y);
        ctx.rotate(rot);
        ctx.scale(scale, scale);
        ctx.drawImage(s.art.sprite, -full / 2, -full / 2, full, full);
        ctx.restore();
      }

      // Sparkles: a pixel that flares into a little cross and fades
      ctx.save();
      ctx.globalCompositeOperation = "lighter";
      for (let i = sparks.length - 1; i >= 0; i--) {
        const p = sparks[i];
        const age = now - p.born;
        if (age < 0) continue;
        if (age > p.life) {
          sparks.splice(i, 1);
          continue;
        }
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.vx *= 0.96;
        p.vy *= 0.96;
        const b = Math.sin((age / p.life) * Math.PI);
        const x = Math.round(p.x / PX) * PX;
        const y = Math.round(p.y / PX) * PX;
        ctx.fillStyle = p.color;
        ctx.globalAlpha = b;
        ctx.fillRect(x, y, PX, PX);
        if (b > 0.55) {
          ctx.fillRect(x - PX, y, PX, PX);
          ctx.fillRect(x + PX, y, PX, PX);
          ctx.fillRect(x, y - PX, PX, PX);
          ctx.fillRect(x, y + PX, PX, PX);
        }
        if (b > 0.85) {
          ctx.globalAlpha = b * 0.5;
          ctx.fillRect(x - PX * 2, y, PX, PX);
          ctx.fillRect(x + PX * 2, y, PX, PX);
          ctx.fillRect(x, y - PX * 2, PX, PX);
          ctx.fillRect(x, y + PX * 2, PX, PX);
        }
      }
      ctx.restore();

      if (stickers.length || sparks.length) raf = requestAnimationFrame(frame);
      else running = false;
    };

    function start() {
      if (running) return;
      running = true;
      lastT = performance.now();
      raf = requestAnimationFrame(frame);
    }

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      host.removeEventListener("pointermove", onMove);
      host.removeEventListener("pointerleave", onLeave);
    };
  }, [avoid]);

  return <canvas ref={ref} aria-hidden="true" className={cn("pointer-events-none absolute inset-0 size-full", className)} />;
}
