import { cn } from "@/lib/utils";

/** Small "+" marker that sits on grid-line intersections. */
export function Cross({ className }: { className?: string }) {
  return (
    <span aria-hidden="true" className={cn("pointer-events-none absolute z-10 block size-[7px] -translate-x-1/2 -translate-y-1/2", className)}>
      <span className="absolute top-0 left-1/2 h-full w-px -translate-x-1/2 bg-white" />
      <span className="absolute top-1/2 left-0 h-px w-full -translate-y-1/2 bg-white" />
    </span>
  );
}

/** Crosses on the four corners of the parent (parent must be relative). */
export function CornerCrosses({ top = true, bottom = true }: { top?: boolean; bottom?: boolean }) {
  return (
    <>
      {top && <Cross className="top-0 left-0" />}
      {top && <Cross className="top-0 left-full" />}
      {bottom && <Cross className="top-full left-0" />}
      {bottom && <Cross className="top-full left-full" />}
    </>
  );
}

/**
 * Faint full-height guide lines. Desktop positions: the 730px centre frame
 * edges and the page centre line.
 */
export function GuideLines({ center = true, quarters = true, light = false }: { center?: boolean; quarters?: boolean; light?: boolean }) {
  const line = light ? "bg-black/[0.06]" : "bg-line";
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 hidden md:block">
      {quarters && <span className={cn("absolute inset-y-0 left-[calc(50%-365px)] w-px", line)} />}
      {center && <span className={cn("absolute inset-y-0 left-1/2 w-px", line)} />}
      {quarters && <span className={cn("absolute inset-y-0 left-[calc(50%+365px)] w-px", line)} />}
    </div>
  );
}

/** Horizontal hairline across the full viewport width. */
export function HLine({ className, light = false }: { className?: string; light?: boolean }) {
  return <span aria-hidden="true" className={cn("pointer-events-none absolute inset-x-0 h-px", light ? "bg-black/[0.06]" : "bg-line", className)} />;
}

export function Noise({ className }: { className?: string }) {
  return <div aria-hidden="true" className={cn("noise", className)} />;
}

/** Mono label chip with tiny corner brackets. */
export function Tag({ children, tone = "dark", className }: { children: React.ReactNode; tone?: "dark" | "light"; className?: string }) {
  const dot = tone === "dark" ? "bg-white" : "bg-ink";
  return (
    <div
      className={cn(
        "relative inline-flex w-fit items-center justify-center px-4 py-2 font-pixel text-[9px] leading-[18px]",
        tone === "dark" ? "bg-line text-white" : "bg-black/10 text-ink",
        className,
      )}
    >
      {children}
      {(["top-0 left-0", "top-0 right-0", "bottom-0 left-0", "bottom-0 right-0"] as const).map((pos) => (
        <span key={pos} aria-hidden="true" className={cn("absolute size-[3px]", pos, dot)} />
      ))}
    </div>
  );
}

/** Screw-head glyph used in the corners of the 3D buttons. */
function Screw({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 7 7" aria-hidden="true" className={cn("absolute size-[7px]", className)}>
      <circle cx="3.5" cy="3.5" r="3" fill="none" stroke="currentColor" strokeWidth="0.8" />
      <line x1="1.6" y1="5.4" x2="5.4" y2="1.6" stroke="currentColor" strokeWidth="0.8" />
    </svg>
  );
}

interface ButtonProps {
  /** Renders a link when set, otherwise a submit button. */
  href?: string;
  children: React.ReactNode;
  /** accent: violet gradient face with a neon glow, for the main CTA. */
  tone?: "white" | "black" | "accent";
  className?: string;
}

// 10×5 grid of 3px cells. A chevron occupies columns c..c+2 (rows 0–4: c, c+1, c+2, c+1, c);
// chevrons repeat every 3 columns, so the 9px shift in `pixel-march` loops seamlessly.
const CELL = 3;
const CHEVRON = [0, 1, 2, 1, 0];
const CHEVRON_STARTS = [-3, 0, 3, 6, 9];
const GRID = Array.from({ length: 50 }, (_, i) => [i % 10, Math.floor(i / 10)]);

/** 30×15 pixel-art row of chevrons that scrolls right without stopping. */
function PixelArrows() {
  return (
    <svg viewBox="0 0 30 15" aria-hidden="true" className="size-full">
      {GRID.map(([x, y]) => (
        <rect key={`g${x}-${y}`} x={x * CELL + 0.5} y={y * CELL + 0.5} width="2" height="2" fill="currentColor" opacity="0.08" />
      ))}
      <g className="pixel-march">
        {CHEVRON_STARTS.flatMap((c) =>
          CHEVRON.map((dx, row) => (
            <rect key={`${c}-${row}`} x={(c + dx) * CELL} y={row * CELL} width={CELL} height={CELL} fill="currentColor" />
          )),
        )}
      </g>
    </svg>
  );
}


/**
 * Physical-key style button. Hover: the label fades out and a marching pixel
 * arrow fades in. Press: the face drops into the housing, hiding its bottom lip.
 */
export function KeyButton({ href, children, tone = "white", className }: ButtonProps) {
  const Tag = href ? "a" : "button";
  return (
    <Tag
      {...(href ? { href } : { type: "submit" as const })}
      className={cn(
        "group relative inline-flex h-14 w-fit cursor-pointer overflow-hidden",
        tone === "accent"
          ? "shadow-[0_0_14px_rgba(168,85,247,0.3),0_10px_8px_-1px_rgba(0,0,0,0.35)] transition-shadow duration-300 hover:shadow-[0_0_22px_rgba(168,85,247,0.5),0_10px_8px_-1px_rgba(0,0,0,0.35)]"
          : "shadow-[0_0.72px_0.29px_-0.17px_rgba(84,84,84,0.06),0_2px_0.8px_-0.33px_rgba(84,84,84,0.11),0_5px_2px_-0.5px_rgba(84,84,84,0.15),0_10px_8px_-1px_rgba(0,0,0,0.25)]",
        "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white",
        className,
      )}
    >
      {/* Invisible copy of the label sets the button width */}
      <span aria-hidden="true" className="invisible flex h-full items-center px-6 pb-2 font-pixel text-[11px] leading-[19.2px] whitespace-nowrap">
        {children}
      </span>

      {/* Face: moves down as one piece on press */}
      <span className="absolute inset-0 transition-transform duration-150 ease-out group-active:translate-y-[9px]">
        <span
          className={cn(
            "absolute inset-0 flex items-center justify-center px-6 pb-2",
            {
              white: "bg-white text-ink shadow-[inset_0_-8px_2px_0_rgb(201,201,201)]",
              black: "bg-ink-2 text-white shadow-[inset_0_-1px_1px_0_#000,inset_0_-8px_2px_0_rgb(14,8,26)]",
              accent: "bg-[image:var(--accent-gradient-x)] text-white shadow-[inset_0_1px_0_0_rgba(255,255,255,0.35),inset_0_-8px_2px_0_rgb(76,29,149)]",
            }[tone],
          )}
        >
          <span className="font-pixel text-[11px] leading-[19.2px] whitespace-nowrap transition-opacity duration-200 ease-out group-hover:opacity-0 group-focus-visible:opacity-0">
            {children}
          </span>
          <span className="absolute top-[17px] left-1/2 h-[15px] w-[30px] -translate-x-1/2 overflow-hidden opacity-0 transition-opacity duration-200 ease-out group-hover:opacity-100 group-focus-visible:opacity-100">
            <PixelArrows />
          </span>
        </span>
        <span className={cn("pointer-events-none absolute inset-x-0 top-0 h-12", tone === "white" ? "text-ink/60" : "text-white/60")}>
          <Screw className="top-[5px] left-[5px]" />
          <Screw className="top-[5px] right-[5px]" />
          <Screw className="bottom-[5px] left-[5px]" />
          <Screw className="right-[5px] bottom-[5px]" />
        </span>
      </span>
    </Tag>
  );
}

/** Wide flat CTA used inside pricing cards (dotted or gradient fill). */
export function BarButton({ href, children, variant }: { href: string; children: React.ReactNode; variant: "dots" | "gradient" }) {
  return (
    <a
      href={href}
      className={cn(
        "relative flex h-[62px] w-full items-center justify-center font-pixel text-[11px] text-white transition-opacity hover:opacity-90",
        variant === "gradient"
          ? "bg-[radial-gradient(58%_306%_at_0%_79%,rgb(124,58,237)_3%,rgb(147,51,234)_40%,rgb(217,70,239)_75%)]"
          : "bg-[radial-gradient(rgba(255,255,255,0.18)_1px,transparent_1px)] bg-[size:6px_6px]",
      )}
    >
      <CornerCrosses />
      {children}
    </a>
  );
}

/**
 * Image placeholder. Replace with <Image> once real assets are in place.
 * `label` describes the slot and its source size.
 */
export function Placeholder({ label, className, tone = "dark" }: { label: string; className?: string; tone?: "dark" | "light" | "mid" }) {
  const tones = {
    dark: "bg-[linear-gradient(160deg,#2a1748_0%,#0f0819_100%)] text-white/35",
    mid: "bg-[linear-gradient(160deg,#8b5cf6_0%,#2e1065_100%)] text-white/60",
    light: "bg-[linear-gradient(160deg,#faf5ff_0%,#c4b5fd_100%)] text-black/40",
  } as const;
  return (
    <div role="img" aria-label={label} className={cn("relative flex items-center justify-center overflow-hidden", tones[tone], className)}>
      <svg aria-hidden="true" className="absolute inset-0 size-full opacity-30" preserveAspectRatio="none" viewBox="0 0 100 100">
        <line x1="0" y1="0" x2="100" y2="100" stroke="currentColor" strokeWidth="0.15" vectorEffect="non-scaling-stroke" />
        <line x1="100" y1="0" x2="0" y2="100" stroke="currentColor" strokeWidth="0.15" vectorEffect="non-scaling-stroke" />
      </svg>
      <span className="absolute bottom-2 left-2.5 font-mono text-[10px] tracking-wide uppercase">{label}</span>
    </div>
  );
}

/** Logo placeholder: generic diamond mark + wordmark slot. */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true" className={cn("size-5", className)}>
      <rect x="6" y="6" width="8" height="8" transform="rotate(45 10 10)" fill="currentColor" />
    </svg>
  );
}
