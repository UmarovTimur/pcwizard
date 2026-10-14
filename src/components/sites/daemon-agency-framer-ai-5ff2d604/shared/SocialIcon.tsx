import { cn } from "@/lib/utils";

// Pixel glyphs, one character per art pixel.
const GLYPHS = {
  // 13×11 Telegram plane (rasterised from the logo shape): body, fold line, lower flap.
  telegram: [
    "...........##",
    ".........###.",
    "......###.##.",
    "....####.###.",
    "..#####.####.",
    "######.#####.",
    ".####.#####..",
    "...#.######..",
    "....#######..",
    ".....######..",
    ".....#...##..",
  ],
  // 11×11 Instagram camera: rounded frame, lens ring and the flash dot.
  instagram: [
    ".#########.",
    "#.........#",
    "#.......#.#",
    "#...###...#",
    "#..#...#..#",
    "#..#...#..#",
    "#..#...#..#",
    "#...###...#",
    "#.........#",
    "#.........#",
    ".#########.",
  ],
} as const;

export type SocialName = keyof typeof GLYPHS;

/** Pixel-art social network glyph, drawn in the current text colour. Size comes from `className`. */
export function SocialIcon({ name, className }: { name: SocialName; className?: string }) {
  const rows = GLYPHS[name];
  return (
    <svg viewBox={`0 0 ${rows[0].length} ${rows.length}`} shapeRendering="crispEdges" aria-hidden="true" className={cn("shrink-0", className)}>
      {rows.flatMap((row, y) => [...row].flatMap((c, x) => (c === "#" ? [<rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" fill="currentColor" />] : [])))}
    </svg>
  );
}
