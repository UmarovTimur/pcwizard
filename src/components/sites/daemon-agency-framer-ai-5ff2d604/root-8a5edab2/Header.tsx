"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { FpsCounter } from "../shared/FpsCounter";
import { PixelCurtain } from "../shared/PixelCurtain";
import { brand, footer, nav } from "./content";

// Menu open/close time: the pixel fill, then the links follow right behind it.
const MENU_MS = 200;

/** Fixed logo and menu button (each on a dark translucent backing), menu panel and the scrolling phone link. */
export function Header() {
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Close on Escape or on a click outside the panel and the menu button.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const onDown = (e: PointerEvent) => {
      const t = e.target as Node;
      if (!panelRef.current?.contains(t) && !buttonRef.current?.contains(t)) setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("pointerdown", onDown);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("pointerdown", onDown);
    };
  }, [open]);

  return (
    <>
      {/* Fixed layer: logo on the left, live FPS readout next to it (desktop) */}
      <div className="pointer-events-none fixed inset-x-0 top-0 z-50 flex justify-center pt-[14px]">
        <div className="flex h-12 w-full max-w-[1180px] items-center px-5 md:h-[52px] md:px-10">
          {/* Dark backing keeps the transparent-edged logo readable over the light section */}
          <Link
            href="/"
            className="pointer-events-auto -ml-2 block rounded-lg bg-ink/60 px-2 backdrop-blur-sm"
            aria-label={`${brand.name} — на главную`}
          >
            <Image src="/brand/logo.png" alt={brand.name} width={366} height={160} priority className="h-11 w-auto min-[400px]:h-12 md:h-[52px]" />
          </Link>
          {/* Game-HUD readout with the page's real frame rate */}
          <FpsCounter className="ml-4 hidden rounded-lg bg-ink/60 px-3 py-2 backdrop-blur-sm md:flex" />
        </div>
      </div>

      {/* Phone: at the top of the page, between logo and menu button, but scrolls away (not fixed) */}
      {/* Same row box as the logo (pt-14 + 48/52px), so it lines up with the logo and the menu button */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-50 flex justify-center pt-[14px]">
        <div className="flex h-12 w-full max-w-[1180px] items-center justify-end px-5 pr-[54px] md:h-[52px] md:px-10 md:pr-[85px]">
          <a
            href={`tel:${footer.phone.replace(/\s/g, "")}`}
            aria-label={`Позвонить: ${footer.phone}`}
            data-pixel-avoid
            className="group pointer-events-auto flex items-center gap-1.5 py-2 font-pixel min-[400px]:gap-2.5 text-[10px] leading-[22px] whitespace-nowrap text-white transition-colors hover:text-lavender min-[400px]:text-[11px] md:text-[14px]"
          >
            <span aria-hidden="true" className="relative flex size-2">
              <span className="absolute inset-0 animate-ping bg-[#4ade80] opacity-60" />
              <span className="relative size-2 bg-[#4ade80]" />
            </span>
            {footer.phone}
          </a>
        </div>
      </div>

      {/* The bar itself ignores the pointer (it spans the full width over the phone link); only the button is clickable.
          The button has its own dark backing (like the logo), so it stays visible over white text and light sections. */}
      <nav aria-label="Основное меню" className="pointer-events-none fixed inset-x-0 top-0 z-50 flex justify-center pt-[18px] md:pt-[20px]">
        <div className="flex w-full max-w-[1180px] items-center justify-end px-5 md:px-10">
          <button
            ref={buttonRef}
            type="button"
            aria-expanded={open}
            aria-controls="site-menu"
            aria-label={open ? "Закрыть меню" : "Открыть меню"}
            onClick={() => setOpen((v) => !v)}
            className="pointer-events-auto -mr-2 grid size-10 cursor-pointer place-items-center rounded-lg bg-ink/60 backdrop-blur-sm transition-colors hover:bg-ink-2/80"
          >
            <span className="relative h-5 w-[25px]">
              <span className={cn("absolute left-0 h-[3px] w-full bg-white transition-transform duration-200", open ? "top-[8.5px] rotate-45" : "top-0")} />
              <span className={cn("absolute top-[8.5px] left-0 h-[3px] w-full bg-white transition-opacity duration-200", open && "opacity-0")} />
              <span className={cn("absolute left-0 h-[3px] w-full bg-white transition-transform duration-200", open ? "top-[8.5px] -rotate-45" : "top-[17px]")} />
            </span>
          </button>
        </div>
      </nav>

      {/* Menu: a panel under the menu button. Dark pixels fill it in random order,
          then the links slide in; on close the pixels clear and the panel hides. */}
      <div className="pointer-events-none fixed inset-x-0 top-[72px] z-40 flex justify-center">
        <div className="flex w-full max-w-[1180px] justify-end px-5 md:px-10">
          <div
            ref={panelRef}
            id="site-menu"
            className={cn("relative w-[min(340px,100%)] transition-[visibility] duration-0", open ? "pointer-events-auto visible" : "invisible")}
            style={{ transitionDelay: open ? "0ms" : `${MENU_MS}ms` }}
          >
            <PixelCurtain open={open} cell={20} duration={MENU_MS} />
            <div
              className={cn(
                "relative border border-line shadow-[0_0_40px_rgba(124,58,237,0.35)] transition-opacity",
                open ? "opacity-100 duration-150" : "opacity-0 duration-100",
              )}
              style={{ transitionDelay: open ? `${MENU_MS * 0.5}ms` : "0ms" }}
            >
              <ul className="flex flex-col py-2">
                {nav.map((item, i) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className={cn(
                        "group relative flex items-center gap-4 overflow-hidden px-5 py-3.5 outline-none transition-[transform,opacity]",
                        open ? "translate-x-0 opacity-100 duration-200" : "translate-x-3 opacity-0 duration-100",
                      )}
                      style={{ transitionDelay: open ? `${MENU_MS * 0.5 + i * 20}ms` : "0ms" }}
                    >
                      {/* Hover: a violet bar fills in from the left in pixel steps */}
                      <span
                        aria-hidden="true"
                        className="absolute inset-0 origin-left scale-x-0 bg-[image:var(--accent-gradient-x)] transition-transform duration-300 ease-[steps(8,end)] group-hover:scale-x-100 group-focus-visible:scale-x-100"
                      />
                      <span aria-hidden="true" className="relative w-6 font-pixel text-[11px] text-violet transition-colors group-hover:text-white group-focus-visible:text-white">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="relative font-pixel text-[15px] leading-[23px] [word-spacing:-0.4em] uppercase transition-transform duration-300 ease-[steps(4,end)] group-hover:translate-x-2 group-hover:[text-shadow:0_0_10px_rgba(255,255,255,0.6)] group-focus-visible:translate-x-2">
                        {item.label}
                      </span>
                      <span
                        aria-hidden="true"
                        className="relative ml-auto font-pixel text-[15px] opacity-0 transition-[opacity,transform] duration-300 ease-[steps(4,end)] -translate-x-2 group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100"
                      >
                        &gt;
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
