import { cn } from "@/lib/utils";

/**
 * 60×60 grid of faint cells where a few cells blink in sequence.
 * `pattern` lists the lit cell indices (0–15, row-major, 4×4).
 */
export function PixelIcon({ pattern, className }: { pattern: number[]; className?: string }) {
  return (
    <div aria-hidden="true" className={cn("grid size-[60px] grid-cols-4 grid-rows-4 gap-px", className)}>
      {Array.from({ length: 16 }, (_, i) => {
        const order = pattern.indexOf(i);
        return (
          <span
            key={i}
            className={cn("border border-white/[0.08]", order >= 0 && "bg-white")}
            style={order >= 0 ? { animation: `pixel-blink 2.4s ease-in-out ${order * 0.3}s infinite` } : undefined}
          />
        );
      })}
    </div>
  );
}
