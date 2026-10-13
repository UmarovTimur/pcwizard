"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { Sticker } from "../shared/Sticker";

// Each step's sticker sits at its own slight tilt
const TILTS = [-6, 5, -4, 7];

const STEP_MS = 750; // time for the bar to run through one step
const CELLS = 20; // squares in each step's bar

/**
 * The four work steps in a row, joined by a pixel progress bar. As steps scroll into view
 * the bar fills square by square and each step lights up in turn, its sticker slapping on
 * in colour (on phones, one by one as you scroll down to it).
 */
export function ProcessSteps({ steps }: { steps: { title: string; text: string; sticker: string }[] }) {
  const ref = useRef<HTMLOListElement>(null);
  const [target, setTarget] = useState(0); // steps scrolled into view (counting from the first)
  const [reached, setReached] = useState(0); // steps lit so far; catches up with target one by one

  useEffect(() => {
    const items = ref.current ? [...ref.current.children] : [];
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- show the finished state at once
      setTarget(items.length);
      setReached(items.length);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setTarget((t) => Math.max(t, items.indexOf(e.target) + 1));
      },
      { threshold: 0.5 },
    );
    items.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (reached >= target) return;
    const id = window.setTimeout(() => setReached((r) => r + 1), reached === 0 ? 250 : STEP_MS);
    return () => clearTimeout(id);
  }, [reached, target]);

  return (
    <ol ref={ref} className="grid gap-4 md:grid-cols-2 md:gap-5 xl:grid-cols-4 xl:gap-0">
      {steps.map((step, i) => {
        const on = i < reached;
        return (
          <li key={step.title} className="group flex flex-col">
            {/* This step's stretch of the progress bar */}
            <div aria-hidden="true" className="relative mb-6 h-3 max-xl:hidden">
              <span className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.1)_0_66%,transparent_66%)] bg-[size:5%_100%]" />
              <span
                className="absolute inset-0 bg-[linear-gradient(90deg,#a855f7_0_66%,transparent_66%)] bg-[size:5%_100%] drop-shadow-[0_0_6px_rgba(168,85,247,0.7)] transition-[clip-path] ease-linear"
                style={{
                  clipPath: on ? "inset(0 0 0 0)" : "inset(0 100% 0 0)",
                  transitionDuration: `${STEP_MS}ms`,
                  transitionTimingFunction: `steps(${CELLS}, end)`,
                }}
              />
            </div>

            <div
              className={cn(
                "flex h-full flex-col border bg-[#120a22] p-6 transition-colors duration-500 md:p-8 xl:mr-5 xl:p-7 xl:group-last:mr-0",
                on ? "border-violet/40" : "border-white/8",
              )}
            >
              <div className="flex items-start justify-between gap-4">
                <Sticker name={step.sticker} active={on} tilt={TILTS[i % TILTS.length]} className="-mt-2 -ml-2 w-24 md:w-28" />
                <span className={cn("font-pixel text-[22px] leading-none transition-colors duration-500 md:text-[26px]", on ? "text-violet" : "text-white/20")}>
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>
              <h3 className="mt-6 font-headline text-[26px] leading-[1.05] font-[800] uppercase [font-variation-settings:'wdth'_85] md:text-[30px]">
                {step.title}
              </h3>
              <p className="mt-3 text-[18px] leading-[1.55] text-white/70 md:text-[17px]">{step.text}</p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
