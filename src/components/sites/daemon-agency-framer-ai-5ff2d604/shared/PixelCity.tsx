import { cn } from "@/lib/utils";

const SCALE = 2; // css px per art pixel
const ROWS = 130; // art rows in every layer (public/images/decor/city-*.png)

// Layers back to front: tile width in art pixels and seconds to drift one tile. The nearer the
// layer, the faster it slides, which gives the parallax.
const LAYERS = [
  { src: "city-roofs-back", w: 96, s: 90 },
  { src: "city-roofs-mid", w: 144, s: 60 },
  { src: "city-roofs-front", w: 272, s: 55 },
] as const;

/**
 * A strip of pixel-art city rooftops, recoloured violet, whose layers slowly drift sideways at
 * different speeds. Moves one art pixel at a time, so the pixels stay crisp. Fades out top and
 * bottom. Art: "Warped City 2" by ansimuz (Luis Zuno), CC0, opengameart.org.
 */
export function PixelCity({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-x-0 overflow-hidden [mask-image:linear-gradient(to_bottom,transparent,black_22%,black_60%,transparent)]",
        className,
      )}
      style={{ height: ROWS * SCALE }}
    >
      {LAYERS.map((l) => (
        <div
          key={l.src}
          className="city-layer absolute inset-y-0 left-0 bg-repeat-x [image-rendering:pixelated]"
          style={
            {
              width: `calc(100% + ${l.w * SCALE}px)`,
              backgroundImage: `url(/images/decor/${l.src}.png)`,
              backgroundSize: `${l.w * SCALE}px ${ROWS * SCALE}px`,
              "--tile": `${l.w * SCALE}px`,
              "--steps": l.w,
              "--dur": `${l.s}s`,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}
