import { cn } from "@/lib/utils";

// Chips hovering around the board: file, position, tilt and float period
const CHIPS = [
  { n: "01", c: "top-[6%] right-[44%]", t: -8, d: 6 },
  { n: "04", c: "top-[2%] right-[12%]", t: 6, d: 7.5 },
  { n: "05", c: "top-[38%] right-[2%]", t: -5, d: 5.5 },
  { n: "09", c: "bottom-[10%] right-[48%]", t: 9, d: 6.8 },
  { n: "11", c: "top-[30%] right-[50%]", t: 4, d: 8 },
];

/**
 * Pixel-art motherboard with its graphics card and memory, recoloured violet, under a soft glow,
 * with a few microchips floating round it. Decoration for the catalog hero's right side.
 * Art: "PC motherboard and components" and "Microchips" by knekko, CC0, opengameart.org.
 */
export function MainboardArt({ className }: { className?: string }) {
  return (
    <div aria-hidden="true" className={cn("pointer-events-none absolute", className)}>
      <div className="absolute inset-[10%] bg-[radial-gradient(closest-side,rgba(168,85,247,0.35),transparent)] blur-2xl" />
      {/* eslint-disable-next-line @next/next/no-img-element -- tiny pixel art, shown unsmoothed at an exact multiple */}
      <img
        src="/images/decor/mainboard.png"
        alt=""
        width={272}
        height={157}
        className="relative h-auto w-full [image-rendering:pixelated] drop-shadow-[0_0_24px_rgba(168,85,247,0.35)]"
      />
      {CHIPS.map((chip) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={chip.n}
          src={`/images/decor/chip-${chip.n}.png`}
          alt=""
          width={32}
          height={32}
          className={cn("chip-float absolute w-[9%] [image-rendering:pixelated] drop-shadow-[0_0_10px_rgba(192,132,252,0.7)]", chip.c)}
          style={{ "--tilt": `${chip.t}deg`, "--dur": `${chip.d}s` } as React.CSSProperties}
        />
      ))}
    </div>
  );
}
