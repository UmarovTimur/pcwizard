import { cn } from "@/lib/utils";

// 7×7 four-point sparkle (like the ones around the logo): "#" = body, "o" = bright core.
const STAR = ["...#...", "...#...", "..#o#..", "##ooo##", "..#o#..", "...#...", "...#..."];
const CELLS = STAR.flatMap((row, y) => [...row].flatMap((c, x) => (c === "." ? [] : [{ x, y, core: c === "o" }])));

interface SparkleSpec {
  left: number; // % of the container
  top: number; // % of the container
  size: number; // px, a multiple of 7 so the pixels stay crisp
  dx: number;
  dy: number;
  drift: number; // s
  twinkle: number; // s
  delay: number; // s
  tone: keyof typeof TONES;
}

/** Hand-placed sparkles for the hero (clear of the headline and the PC). */
const HERO_SPARKLES: readonly SparkleSpec[] = [
  { left: 8, top: 18, size: 21, dx: 10, dy: -26, drift: 9, twinkle: 2.2, delay: 0, tone: "lavender" },
  { left: 18, top: 62, size: 14, dx: -8, dy: -18, drift: 7, twinkle: 1.8, delay: 1.1, tone: "fuchsia" },
  { left: 30, top: 12, size: 14, dx: 6, dy: 20, drift: 8, twinkle: 2.6, delay: 0.6, tone: "white" },
  { left: 47, top: 66, size: 28, dx: -12, dy: -30, drift: 11, twinkle: 3, delay: 1.7, tone: "lavender" },
  { left: 64, top: 14, size: 21, dx: 12, dy: 22, drift: 10, twinkle: 2.4, delay: 0.3, tone: "fuchsia" },
  { left: 78, top: 58, size: 14, dx: -10, dy: -22, drift: 8, twinkle: 2, delay: 2.1, tone: "white" },
  { left: 90, top: 30, size: 28, dx: -8, dy: 26, drift: 12, twinkle: 2.8, delay: 0.9, tone: "lavender" },
  { left: 4, top: 44, size: 14, dx: 10, dy: 16, drift: 9, twinkle: 2.2, delay: 1.4, tone: "fuchsia" },
  { left: 94, top: 76, size: 14, dx: -6, dy: -20, drift: 7, twinkle: 1.6, delay: 0.4, tone: "white" },
];

/** Small deterministic PRNG (mulberry32), so server and client place stars identically. */
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

const TONE_ORDER = ["lavender", "white", "fuchsia"] as const;

/** Scatter `count` sparkles over the container, reproducibly for a given seed. */
function scatter(seed: number, count: number): SparkleSpec[] {
  const r = rng(seed);
  const between = (a: number, b: number) => Math.round((a + (b - a) * r()) * 100) / 100;
  return Array.from({ length: count }, (_, i) => ({
    left: between(2, 96),
    top: between(1, 99),
    size: [14, 14, 21, 28][Math.floor(r() * 4)],
    dx: between(-14, 14),
    dy: between(-30, 30),
    drift: between(7, 12),
    twinkle: between(1.6, 3),
    delay: between(0, 3),
    tone: TONE_ORDER[i % TONE_ORDER.length],
  }));
}

const TONES = {
  white: "text-white drop-shadow-[0_0_6px_rgba(233,213,255,0.9)]",
  lavender: "text-lavender drop-shadow-[0_0_8px_rgba(168,85,247,0.95)]",
  fuchsia: "text-[#e879f9] drop-shadow-[0_0_8px_rgba(217,70,239,0.9)]",
} as const;

function Sparkle({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 7 7" shapeRendering="crispEdges" className={cn("size-full", className)}>
      {CELLS.map(({ x, y, core }) => (
        <rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" fill={core ? "#ffffff" : "currentColor"} />
      ))}
    </svg>
  );
}

/**
 * Pixel-art sparkles that drift and twinkle (decorative). Without `seed` it uses the
 * hero layout; with `seed` it scatters `count` sparkles over the container.
 */
export function PixelStars({ className, seed, count = 12 }: { className?: string; seed?: number; count?: number }) {
  const sparkles = seed === undefined ? HERO_SPARKLES : scatter(seed, count);
  return (
    <div aria-hidden="true" className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}>
      {sparkles.map((s, i) => (
        <span
          key={i}
          className="star-drift absolute"
          style={
            {
              left: `${s.left}%`,
              top: `${s.top}%`,
              width: s.size,
              height: s.size,
              "--dx": `${s.dx}px`,
              "--dy": `${s.dy}px`,
              "--drift": `${s.drift}s`,
              "--twinkle": `${s.twinkle}s`,
              "--delay": `${-s.delay}s`,
            } as React.CSSProperties
          }
        >
          <span className="star-twinkle block size-full">
            <Sparkle className={TONES[s.tone]} />
          </span>
        </span>
      ))}
    </div>
  );
}
