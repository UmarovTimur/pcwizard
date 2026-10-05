import { cn } from "@/lib/utils";
import { BigMarquee } from "../shared/BigMarquee";
import { Cross, KeyButton, Noise } from "../shared/primitives";
import { Reveal } from "../shared/motion";
import { process } from "./content";

// Grid slots (col, row) for the four steps — a staircase across a 3×4 grid.
const SLOTS = [
  [0, 0],
  [1, 1],
  [2, 2],
  [1, 3],
];

function DiamondCluster() {
  return (
    <svg viewBox="0 0 36 36" aria-hidden="true" className="size-[35px] text-white/60">
      {[
        [18, 6],
        [8, 16],
        [28, 16],
        [18, 26],
      ].map(([x, y], i) => (
        <rect key={i} x={x - 4} y={y - 4} width="8" height="8" transform={`rotate(45 ${x} ${y})`} fill="none" stroke="currentColor" strokeWidth="1" />
      ))}
    </svg>
  );
}

function Step({ title, text }: { title: string; text: string }) {
  return (
    <div className="relative flex h-[250px] flex-col justify-between overflow-hidden bg-ink p-[30px]">
      {/* Dotted texture */}
      <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.12)_1px,transparent_1px)] bg-[size:5px_5px] opacity-60" />
      <DiamondCluster />
      <Reveal className="relative flex max-w-[300px] flex-col gap-[13px]">
        <h3 className="font-pixel text-[13px] leading-[22px] uppercase">{title}</h3>
        <p className="text-sm leading-[22.4px] font-light tracking-[0.02em] text-muted">{text}</p>
      </Reveal>
      <span aria-hidden="true" className="absolute inset-x-0 bottom-0 h-1 bg-[image:var(--accent-gradient-x)]" />
    </div>
  );
}

export function Process() {
  return (
    <section id="process" className="relative flex flex-col items-center gap-[70px] overflow-hidden pt-[60px]">
      <Noise />
      <BigMarquee text={process.marquee} heading={process.heading} />

      <div className="relative w-full px-5 md:w-[1100px] md:px-0">
        <div className="relative grid gap-px md:grid-cols-3 md:grid-rows-[repeat(4,250px)] md:gap-0">
          {/* Grid frame lines and crosses */}
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 hidden md:block">
            {[0, 1, 2, 3, 4].map((r) => (
              <span key={r} className="absolute inset-x-0 h-px bg-line" style={{ top: r * 250 }}>
                {[0, 1, 2, 3].map((c) => (
                  <span key={c} className="absolute top-0" style={{ left: `${(c / 3) * 100}%` }}>
                    <Cross className="top-0 left-0" />
                  </span>
                ))}
              </span>
            ))}
            {[0, 1, 2, 3].map((c) => (
              <span key={c} className="absolute inset-y-0 w-px bg-line" style={{ left: `${(c / 3) * 100}%` }} />
            ))}
          </div>

          {process.steps.map((step, i) => (
            <div
              key={step.title}
              className="md:[grid-column:var(--c)] md:[grid-row:var(--r)]"
              style={{ "--c": SLOTS[i][0] + 1, "--r": SLOTS[i][1] + 1 } as React.CSSProperties}
            >
              <Step {...step} />
            </div>
          ))}

          <div className={cn("flex flex-col justify-end gap-5 p-[30px] max-md:pt-12", "md:[grid-column:3] md:[grid-row:4]")}>
            <p className="max-w-[256px] text-[15px] leading-6 font-light tracking-[0.02em]">{process.cta.text}</p>
            <KeyButton href={process.cta.href}>{process.cta.label}</KeyButton>
          </div>
        </div>
      </div>
    </section>
  );
}
