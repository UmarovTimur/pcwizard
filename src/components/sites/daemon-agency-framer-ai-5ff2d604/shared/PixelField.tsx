"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

const CELL = 8; // one pixel, px (6 on phones, where there is less room under the text)
const STEP = 70; // animation step, ms: everything moves in whole cells
const AVOID_PAD = 10; // clearance kept around text and buttons, px
const AVOID = "h1, h2, h3, p, li, a, button, [data-pixel-avoid]";

// Crystal palette. Every shard has three facets (lit left, front, shaded right), each banded
// from dark at the root to bright at the tip.
const LIT = ["#7c3aed", "#a855f7", "#d8b4fe", "#f7efff"];
const FRONT = ["#4c1d95", "#7c3aed", "#a855f7", "#e4ccff"];
const SHADE = ["#2e1065", "#4c1d95", "#6d28d9", "#a78bfa"];
const RIM = "#2b1157"; // one-pixel halo around the clusters
const SEAM = "#0b0614"; // gap where a shard passes behind another
const HOT = "#ffffff";
const CHARGE = "#e9b8ff";
const BOLT_GLOW = "rgba(192,132,252,0.4)";
const BIT_COLORS = ["#ffffff", "#e9d5ff", "#c084fc", "#f0abfc"];

// Colour indices into PALETTE
const C_RIM = 1;
const C_SEAM = 2;
const C_LIT = 3; // 3..6
const C_FRONT = 7; // 7..10
const C_SHADE = 11; // 11..14
const C_HOT = 15;
const C_CHARGE = 16;
const PALETTE = ["", RIM, SEAM, ...LIT, ...FRONT, ...SHADE, HOT, CHARGE];

interface Shard {
  x: number; // root, cells (sunk a little below the bottom edge)
  y: number;
  ang: number; // lean from vertical, radians
  w: number; // half-width, cells
  len: number; // resting length, cells
  max: number; // longest it may get before running into text
  amp: number; // how far it grows and shrinks, cells
  speed: number;
  phase: number;
  grow: number; // 0..1: regrowing after it shattered
  cur: number; // length this step
  charge: number; // position of a pulse of energy running up it, or -1
  rate: number; // cells per step
}

interface Bit {
  x: number; // cells
  y: number;
  vx: number;
  vy: number;
  life: number;
  color: string;
}

interface Bolt {
  pts: [number, number][]; // cells
  life: number;
}

const rand = (a: number, b: number) => a + Math.random() * (b - a);
const randInt = (a: number, b: number) => Math.floor(rand(a, b + 1));

/**
 * Clusters of pixel crystals growing from the bottom of the field, biggest at the sides and
 * stopping short of the text, links and buttons in the enclosing <section>/<footer> (and anything
 * marked `data-pixel-avoid` on the page). Each shard is a faceted, pointed prism; the shards keep
 * growing and shrinking a cell at a time, pulses of energy run up them and flash at the tips,
 * now and then one shatters into falling splinters and grows back, and arcs jump between tips.
 * Scrolling surges the power (shards stretch, brighten and fire faster); a click fires a bolt
 * from the pointer into the nearest tip and shatters that shard.
 *
 * `reach`: how far up the crystals may grow, as a share of the field's height.
 */
export function PixelField({ className, reach = 0.32 }: { className?: string; reach?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const target = canvas?.closest<HTMLElement>("section, footer");
    const ctx = canvas?.getContext("2d");
    if (!canvas || !target || !ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const avoidEls = [...new Set([...target.querySelectorAll<HTMLElement>(AVOID), ...document.querySelectorAll<HTMLElement>("[data-pixel-avoid]")])].filter(
      (el) => !el.closest("[aria-hidden=true]"),
    );

    let cell = CELL;
    let width = 0;
    let height = 0;
    let cols = 0;
    let rows = 0;
    let offX = 0; // grid centred horizontally, sitting on the bottom edge
    let offY = 0;
    let room = new Float32Array(0); // distance to the nearest text, cells
    let owner = new Int16Array(0); // shard index + 1 per cell for the current step
    let color = new Uint8Array(0); // palette index per cell for the current step
    let shards: Shard[] = [];
    let bits: Bit[] = [];
    let bolts: Bolt[] = [];
    let stars: { c: number; r: number; t: number }[] = [];
    let surge = 0; // extra power from scrolling and clicks, decays each step
    let tick = 0;
    let frame = 0;
    let last = 0;

    // Distance (cells) from every cell to the nearest padded text box: two-pass chamfer.
    const buildRoom = (ox: number, oy: number) => {
      room = new Float32Array(cols * rows).fill(999);
      for (const el of avoidEls) {
        const box = el.getBoundingClientRect();
        if (!box.width || !box.height) continue;
        const c0 = Math.max(0, Math.floor((box.left - ox - AVOID_PAD) / cell));
        const c1 = Math.min(cols - 1, Math.floor((box.right - ox + AVOID_PAD) / cell));
        const r0 = Math.max(0, Math.floor((box.top - oy - AVOID_PAD) / cell));
        const r1 = Math.min(rows - 1, Math.floor((box.bottom - oy + AVOID_PAD) / cell));
        for (let r = r0; r <= r1; r++) for (let c = c0; c <= c1; c++) room[r * cols + c] = 0;
      }
      const D = Math.SQRT2;
      for (let r = 0; r < rows; r++)
        for (let c = 0; c < cols; c++) {
          const i = r * cols + c;
          if (c > 0) room[i] = Math.min(room[i], room[i - 1] + 1);
          if (r > 0) {
            room[i] = Math.min(room[i], room[i - cols] + 1);
            if (c > 0) room[i] = Math.min(room[i], room[i - cols - 1] + D);
            if (c < cols - 1) room[i] = Math.min(room[i], room[i - cols + 1] + D);
          }
        }
      for (let r = rows - 1; r >= 0; r--)
        for (let c = cols - 1; c >= 0; c--) {
          const i = r * cols + c;
          if (c < cols - 1) room[i] = Math.min(room[i], room[i + 1] + 1);
          if (r < rows - 1) {
            room[i] = Math.min(room[i], room[i + cols] + 1);
            if (c < cols - 1) room[i] = Math.min(room[i], room[i + cols + 1] + D);
            if (c > 0) room[i] = Math.min(room[i], room[i + cols - 1] + D);
          }
        }
    };
    // Cells off the sides count as open, so clusters can lean out past the edge.
    const roomAt = (c: number, r: number) => {
      const x = Math.round(c);
      const y = Math.round(r);
      if (y < 0) return 0;
      if (x < 0 || x >= cols) return 999;
      return room[Math.min(rows - 1, y) * cols + x];
    };

    const tipOf = (s: Shard, len = s.cur): [number, number] => [s.x + Math.sin(s.ang) * len, s.y - Math.cos(s.ang) * len];

    // Lay out the clusters along the bottom: a fan of shards each, tallest at the sides.
    const buildShards = () => {
      shards = [];
      const span = Math.max(6, Math.round(rows * reach)); // tallest a shard may reach, cells
      const base = rows - 1 + 1.5;
      // Open rows above the bottom edge at a column before the text starts
      const freeAt = (c: number) => {
        let r = rows - 1;
        while (r > 0 && roomAt(c, r) >= 3) r--;
        return rows - 1 - r;
      };
      const cluster = (cx: number, tall: number, lean: number, count: number) => {
        const height = Math.min(tall, Math.max(4, freeAt(cx) * 1.1));
        const spread = rand(0.3, 0.6);
        for (let k = 0; k < count; k++) {
          const f = count === 1 ? 0 : (k / (count - 1)) * 2 - 1; // -1..1 across the fan
          const ang = lean + f * spread + rand(-0.08, 0.08);
          const w = Math.min(3.4, Math.max(1.3, span * 0.075)) * rand(0.75, 1.15) * (1 - 0.3 * Math.abs(f));
          const len = height * (1 - 0.45 * Math.abs(f)) * rand(0.7, 1.05);
          const s: Shard = { x: cx + f * w * 1.7, y: base, ang, w, len, max: 0, amp: rand(0.8, 2.2), speed: rand(0.8, 1.8), phase: rand(0, Math.PI * 2), grow: 1, cur: 0, charge: -1, rate: 1 };
          // Longest it can get: walk up its axis until the shard would touch text
          const reachOf = () => {
            let u = 0;
            while (u < span * 1.4 && roomAt(...tipOf(s, u + 1)) >= s.w + 1.5) u++;
            return u;
          };
          s.max = reachOf();
          // Where text sits low the shards come out short, so make them slimmer to stay pointed
          if (s.max < s.w * 6) {
            s.w = Math.max(1.1, s.w * 0.6);
            s.max = reachOf();
          }
          s.len = Math.min(s.len, s.max - s.amp * 0.5);
          if (s.max >= 3 && s.len >= 2) shards.push(s);
        }
      };

      // Big clusters leaning in from both corners, then smaller ones packed in between
      cluster(rand(-1, 2), span * 1.05, 0.3, randInt(4, 6));
      cluster(cols - 1 - rand(-1, 2), span * 1.05, -0.3, randInt(4, 6));
      for (let x = rand(5, 9); x < cols - 5; ) {
        const edge = Math.min(x, cols - x) / Math.max(1, cols); // 0 at the sides, 0.5 in the middle
        cluster(x, span * Math.max(0.3, 0.95 - edge * 1.3) * rand(0.75, 1.1), rand(-0.12, 0.12), randInt(2, 4));
        x += rand(6, 11) * Math.max(1, span / 30);
      }
      // Back to front: random depth, so shards cross in front of their neighbours
      shards.sort(() => Math.random() - 0.5);
    };

    const build = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      cell = width < 640 ? 6 : CELL;
      cols = Math.floor(width / cell);
      rows = Math.floor(height / cell);
      offX = (width - cols * cell) / 2;
      offY = height - rows * cell;
      ctx.setTransform(dpr, 0, 0, dpr, dpr * offX, dpr * offY);
      const rect = canvas.getBoundingClientRect();
      buildRoom(rect.left + offX, rect.top + offY);
      owner = new Int16Array(cols * rows);
      color = new Uint8Array(cols * rows);
      bits = [];
      bolts = [];
      stars = [];
      buildShards();
      step();
    };

    // A shard breaks into splinters that fly off and fall; it then grows back from the root.
    const shatter = (s: Shard) => {
      const n = Math.min(26, Math.round(s.cur * s.w * 0.6));
      for (let k = 0; k < n; k++) {
        const [x, y] = tipOf(s, rand(1, s.cur));
        const side = Math.random() < 0.5 ? -1 : 1;
        bits.push({
          x: x + side * rand(0, s.w),
          y,
          vx: Math.cos(s.ang) * side * rand(0.3, 1.2) + Math.sin(s.ang) * rand(0, 0.6),
          vy: -rand(0.6, 1.8),
          life: randInt(8, 18),
          color: BIT_COLORS[k % BIT_COLORS.length],
        });
      }
      s.grow = 0;
      s.charge = -1;
    };

    // A jagged bolt between two points: recursive midpoint displacement
    const makeBolt = (a: [number, number], b: [number, number], life = 7) => {
      const pts: [number, number][] = [a, b];
      for (let pass = 0; pass < 3; pass++)
        for (let k = pts.length - 1; k > 0; k--) {
          const [x0, y0] = pts[k - 1];
          const [x1, y1] = pts[k];
          const len = Math.hypot(x1 - x0, y1 - y0) || 1;
          const off = rand(-0.3, 0.3) * len;
          pts.splice(k, 0, [(x0 + x1) / 2 - ((y1 - y0) / len) * off, (y0 + y1) / 2 + ((x1 - x0) / len) * off]);
        }
      bolts.push({ pts: pts.map(([x, y]) => [Math.round(x), Math.round(y)]), life });
    };

    // One animation step: shards grow and shrink, pulses climb them, then everything is
    // re-rastered and shaded; splinters fall and stars pop at the tips.
    const step = () => {
      tick++;
      surge *= 0.9;
      const t = tick * STEP * 0.001;
      const bright = surge > 0.7 ? 1 : 0; // a surge lights every facet up a band

      // New pulses of energy, many more under a surge
      const fire = 0.1 + surge * 0.6;
      for (let n = Math.floor(fire) + (Math.random() < fire % 1 ? 1 : 0); n > 0 && shards.length; n--) {
        const s = shards[(Math.random() * shards.length) | 0];
        if (s.charge < 0 && s.grow >= 1) {
          s.charge = 0;
          s.rate = Math.random() < 0.4 || surge > 1 ? 2 : 1;
        }
      }
      // Now and then a shard shatters by itself
      if (shards.length && Math.random() < 0.012) {
        const s = shards[(Math.random() * shards.length) | 0];
        if (s.grow >= 1 && s.cur > 4) shatter(s);
      }

      owner.fill(0);
      color.fill(0);
      shards.forEach((s, id) => {
        s.grow = Math.min(1, s.grow + 0.05);
        const want = (s.len + Math.sin(t * s.speed + s.phase) * s.amp + surge * s.len * 0.18) * s.grow;
        s.cur = Math.max(0, Math.min(s.max, Math.round(want)));
        if (s.charge >= 0) {
          s.charge += s.rate;
          if (s.charge > s.cur) {
            // The pulse reaches the tip: a star, and sometimes a splinter flies off
            const [x, y] = tipOf(s);
            stars.push({ c: Math.round(x), r: Math.round(y), t: 0 });
            if (Math.random() < 0.4 + surge * 0.2) bits.push({ x, y: y - 1, vx: rand(-0.5, 0.5), vy: -rand(0.8, 1.6), life: randInt(6, 12), color: HOT });
            s.charge = -1;
          }
        }
        const L = s.cur;
        if (L < 2) return;

        const dx = Math.sin(s.ang);
        const dy = -Math.cos(s.ang);
        const tipLen = Math.min(L * 0.7, s.w * 1.8); // pointed end
        const [tx, ty] = tipOf(s);
        const pad = s.w + 1;
        const x0 = Math.max(0, Math.floor(Math.min(s.x, tx) - pad));
        const x1 = Math.min(cols - 1, Math.ceil(Math.max(s.x, tx) + pad));
        const y0 = Math.max(0, Math.floor(Math.min(s.y, ty) - pad));
        const y1 = Math.min(rows - 1, Math.ceil(Math.max(s.y, ty) + pad));
        for (let y = y0; y <= y1; y++)
          for (let x = x0; x <= x1; x++) {
            const rx = x - s.x;
            const ry = y - s.y;
            const u = rx * dx + ry * dy; // along the shard
            const v = rx * -dy + ry * dx; // across it, negative on the left
            if (u < 0 || u > L) continue;
            const hw = u > L - tipLen ? (s.w * (L - u)) / tipLen : s.w;
            if (Math.abs(v) > hw + 0.3) continue;
            const i = y * cols + x;
            owner[i] = id + 1;
            if (s.charge >= 0 && Math.abs(u - s.charge) < 1.2) {
              color[i] = C_HOT;
              continue;
            }
            if (s.charge >= 0 && Math.abs(u - s.charge) < 2.4) {
              color[i] = C_CHARGE;
              continue;
            }
            const band = Math.min(3, Math.floor((u / Math.max(L, 1)) * 4) + bright);
            color[i] = (v < -hw * 0.34 ? C_LIT : v > hw * 0.34 ? C_SHADE : C_FRONT) + band;
          }
      });

      // A dark seam wherever a shard passes behind another, and a dim halo around the clusters
      for (let r = 0; r < rows; r++)
        for (let c = 0; c < cols; c++) {
          const i = r * cols + c;
          const o = owner[i];
          const l = c > 0 ? owner[i - 1] : 0;
          const rt = c < cols - 1 ? owner[i + 1] : 0;
          const up = r > 0 ? owner[i - cols] : 0;
          const dn = r < rows - 1 ? owner[i + cols] : 0;
          if (!o) {
            if (l || rt || up || dn) color[i] = C_RIM;
          } else if (l > o || rt > o || up > o || dn > o) color[i] = C_SEAM;
        }

      // Arcs between the tips of neighbouring shards
      if (shards.length > 1 && Math.random() < 0.015 + surge * 0.05) {
        const a = shards[(Math.random() * shards.length) | 0];
        const [ax, ay] = tipOf(a);
        const near = shards.filter((b) => {
          if (b === a || b.cur < 3) return false;
          const [bx, by] = tipOf(b);
          const d = Math.hypot(bx - ax, by - ay);
          return d > 6 && d < 26;
        });
        if (a.cur >= 3 && near.length) makeBolt([ax, ay], tipOf(near[(Math.random() * near.length) | 0]));
      }
      bolts = bolts.filter((b) => --b.life > 0);

      // Splinters fly off and fall, and vanish when they reach text
      bits = bits.filter((b) => {
        b.x += b.vx;
        b.y += b.vy;
        b.vy += 0.22;
        if (--b.life <= 0 || b.y >= rows || roomAt(b.x, b.y) < 1) return false;
        return true;
      });
      stars = stars.filter((s) => ++s.t < 5);
    };

    const draw = () => {
      ctx.clearRect(-offX, -offY, width, height);
      for (let k = 1; k < PALETTE.length; k++) {
        ctx.fillStyle = PALETTE[k];
        for (let i = 0; i < color.length; i++) {
          if (color[i] !== k) continue;
          const c = i % cols;
          ctx.fillRect(c * cell, ((i - c) / cols) * cell, cell, cell);
        }
      }

      // Bolts flicker: every third step they blink out
      for (const b of bolts) {
        if (b.life % 3 === 0) continue;
        for (const [fill, grow] of [
          [BOLT_GLOW, 1],
          [HOT, 0],
        ] as const) {
          ctx.fillStyle = fill;
          for (let k = 1; k < b.pts.length; k++) {
            const [x0, y0] = b.pts[k - 1];
            const [x1, y1] = b.pts[k];
            const n = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0), 1);
            for (let s = 0; s <= n; s++) {
              const x = Math.round(x0 + ((x1 - x0) * s) / n);
              const y = Math.round(y0 + ((y1 - y0) * s) / n);
              ctx.fillRect((x - grow) * cell, (y - grow) * cell, cell * (1 + 2 * grow), cell * (1 + 2 * grow));
            }
          }
        }
      }

      for (const b of bits) {
        if (b.life < 4 && b.life % 2) continue; // blink out
        ctx.fillStyle = b.color;
        ctx.fillRect(Math.round(b.x) * cell, Math.round(b.y) * cell, cell, cell);
      }

      // Four-point stars at the tips that grow and shrink over five steps
      ctx.fillStyle = HOT;
      for (const s of stars) {
        const arm = [1, 2, 3, 2, 1][s.t];
        const x = s.c * cell;
        const y = s.r * cell;
        ctx.fillRect(x, y, cell, cell);
        for (let a = 1; a < arm; a++) {
          ctx.fillRect(x - a * cell, y, cell, cell);
          ctx.fillRect(x + a * cell, y, cell, cell);
          ctx.fillRect(x, y - a * cell, cell, cell);
          ctx.fillRect(x, y + a * cell, cell, cell);
        }
      }
    };

    const loop = (now: number) => {
      frame = requestAnimationFrame(loop);
      if (now - last < STEP) return;
      last = now;
      step();
      draw();
    };

    build();
    draw();
    if (!reduced) frame = requestAnimationFrame(loop);

    // Click: a bolt from the pointer into the nearest tip, which shatters.
    const onDown = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = (e.clientX - rect.left - offX) / cell;
      const y = (e.clientY - rect.top - offY) / cell;
      if (x < 0 || y < 0 || x > cols || y > rows) return;
      let best: Shard | null = null;
      let bestD = Infinity;
      for (const s of shards) {
        if (s.cur < 3) continue;
        const [tx, ty] = tipOf(s);
        const d = Math.hypot(tx - x, ty - y);
        if (d < bestD) {
          bestD = d;
          best = s;
        }
      }
      if (best) {
        makeBolt([x, y], tipOf(best), 10);
        shatter(best);
      }
      surge = Math.min(3, surge + 0.8);
    };
    // Scroll: the faster the page moves, the harder the power surges.
    let lastY = window.scrollY;
    const onScroll = () => {
      surge = Math.min(3, surge + Math.abs(window.scrollY - lastY) / 90);
      lastY = window.scrollY;
    };
    if (!reduced) {
      target.addEventListener("pointerdown", onDown);
      window.addEventListener("scroll", onScroll, { passive: true });
    }

    // Rebuild when the field or anything it avoids changes size (fonts loading, resize).
    let rebuild = 0;
    const ro = new ResizeObserver(() => {
      cancelAnimationFrame(rebuild);
      rebuild = requestAnimationFrame(() => {
        build();
        draw();
      });
    });
    ro.observe(canvas);
    for (const el of avoidEls) ro.observe(el);

    // Pause the loop while the field is off screen.
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
      target.removeEventListener("pointerdown", onDown);
      window.removeEventListener("scroll", onScroll);
    };
  }, [reach]);

  return <canvas ref={canvasRef} aria-hidden="true" className={cn("pointer-events-none block size-full", className)} />;
}
