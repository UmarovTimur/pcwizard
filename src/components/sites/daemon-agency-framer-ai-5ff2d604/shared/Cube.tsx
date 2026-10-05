import { cn } from "@/lib/utils";

const FACES = [
  "rotateY(0deg)",
  "rotateY(90deg)",
  "rotateY(180deg)",
  "rotateY(-90deg)",
  "rotateX(90deg)",
  "rotateX(-90deg)",
];

/** Spinning CSS 3D cube built from 3×3 tiles per face. */
export function Cube({ size = 100, className }: { size?: number; className?: string }) {
  const half = size / 2;
  return (
    <div aria-hidden="true" className={cn("[perspective:600px]", className)} style={{ width: size, height: size }}>
      <div className="relative size-full [transform-style:preserve-3d]" style={{ animation: "cube-spin 14s linear infinite" }}>
        {FACES.map((rot) => (
          <div
            key={rot}
            className="absolute inset-0 grid grid-cols-3 grid-rows-3 gap-[3px] p-[2px] [backface-visibility:hidden]"
            style={{ transform: `${rot} translateZ(${half}px)` }}
          >
            {Array.from({ length: 9 }, (_, i) => (
              <span key={i} className="rounded-[6px] border-2 border-white/70 bg-ink" />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
