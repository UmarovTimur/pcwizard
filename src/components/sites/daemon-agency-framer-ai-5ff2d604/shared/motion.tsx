"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

/** Adds `is-visible` to `.reveal` when the element scrolls into view (once). */
export function Reveal({
  as: Tag = "div",
  delay = 0,
  className,
  children,
}: {
  as?: "div" | "p" | "h1" | "h2" | "h3" | "li" | "span";
  delay?: number;
  className?: string;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -10% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <Tag
      ref={ref as never}
      className={cn("reveal", visible && "is-visible", className)}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </Tag>
  );
}

/** Horizontal infinite marquee. Children are rendered twice for a seamless loop. */
export function Marquee({
  children,
  duration = 30,
  reverse = false,
  gap = 0,
  className,
}: {
  children: React.ReactNode;
  duration?: number;
  reverse?: boolean;
  gap?: number;
  className?: string;
}) {
  return (
    <div className={cn("overflow-hidden", className)}>
      {/* The track holds two identical copies and slides by exactly -50%. Each copy carries its
          own trailing gap (padding), so copy + gap is exactly half the track: no jump at the loop. */}
      <div className="marquee-track" data-reverse={reverse} style={{ "--marquee-duration": `${duration}s` } as React.CSSProperties}>
        <div className="flex shrink-0" style={{ gap, paddingRight: gap }}>
          {children}
        </div>
        <div className="flex shrink-0" style={{ gap, paddingRight: gap }} aria-hidden="true">
          {children}
        </div>
      </div>
    </div>
  );
}

/** 0→1 progress of an element travelling through the viewport (for scroll-driven effects). */
export function useScrollProgress<T extends HTMLElement>(): [React.RefObject<T | null>, number] {
  const ref = useRef<T>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      const p = total > 0 ? -rect.top / total : rect.top < 0 ? 1 : 0;
      setProgress(Math.min(1, Math.max(0, p)));
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return [ref, progress];
}
