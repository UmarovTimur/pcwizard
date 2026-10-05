"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

/** Game-style HUD readout with the page's real frame rate, updated twice a second. */
export function FpsCounter({ className }: { className?: string }) {
  const [fps, setFps] = useState<number | null>(null);

  useEffect(() => {
    let frames = 0;
    let since = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      frames++;
      if (now - since >= 500) {
        setFps(Math.round((frames * 1000) / (now - since)));
        frames = 0;
        since = now;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div aria-hidden="true" className={cn("flex items-center gap-4 font-pixel text-[9px] leading-[14px] uppercase", className)}>
      <span className="text-[#4ade80] [text-shadow:0_0_8px_rgba(74,222,128,0.7)]">FPS {fps ?? "--"}</span>
      <span className="text-muted">P1</span>
      <span className="pixel-cursor text-lavender">READY</span>
    </div>
  );
}
