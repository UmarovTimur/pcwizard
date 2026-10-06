import { cn } from "@/lib/utils";
import { Marquee } from "./motion";
import { PixelEdge } from "./PixelEdge";

/**
 * Full-bleed marquee of a single giant display word (section intros). `heading` overrides the
 * hidden h2 text; `size="md"` is a smaller variant for longer phrases. The text runs edge to edge
 * (no fade); "boiling" pixels sit over both sides where it enters and leaves.
 */
export function BigMarquee({ text, heading, duration = 20, size = "lg" }: { text: string; heading?: string; duration?: number; size?: "lg" | "md" }) {
  // Repeat short words so one copy of the loop is wider than the screen (no empty gap on wide displays).
  const reps = Math.max(2, Math.ceil(36 / text.length));
  const edgeHeight = size === "lg" ? "h-[clamp(56px,8.4vw,120px)]" : "h-[clamp(28px,4vw,56px)]";
  return (
    <div className="relative w-full">
      <h2 className="sr-only">{heading ?? text}</h2>
      <Marquee
        duration={duration}
        gap={size === "lg" ? 100 : 60}
        className="w-full"
      >
        {Array.from({ length: reps }, (_, i) => (
          <span
            key={i}
            aria-hidden="true"
            className={cn(
              "font-pixel whitespace-nowrap text-white [text-shadow:0_0_8px_rgba(168,85,247,0.35)]",
              size === "lg" ? "text-[clamp(56px,8.4vw,120px)] leading-[1.65]" : "text-[clamp(28px,4vw,56px)] leading-[1.8] [word-spacing:-0.3em]",
            )}
          >
            {text}
          </span>
        ))}
      </Marquee>
      {/* Same height as the letters (the font size), centred on the line */}
      <PixelEdge side="left" className={edgeHeight} />
      <PixelEdge side="right" className={edgeHeight} />
    </div>
  );
}
