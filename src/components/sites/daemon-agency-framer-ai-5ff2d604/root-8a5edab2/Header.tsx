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

/** Fixed header: logo, FPS readout, the main links on desktop, the phone and the menu button (each on a dark translucent backing), and the menu panel. */
export function Header() {
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLElement>(null);
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
      {/* Fixed bar: logo and the live FPS readout on the left; the main links (desktop), the phone
          and the menu button on the right. The bar itself ignores the pointer, and every item sits
          on its own dark backing, so it stays readable over any section. */}
      <div className="pointer-events-none fixed inset-x-0 top-0 z-50 pt-[14px]">
        <div className="wrap flex h-12 items-center gap-2 md:h-[52px] md:gap-4">
          <Link href="/" className="pointer-events-auto -ml-2 block shrink-0 rounded-lg bg-ink/60 px-2 backdrop-blur-sm" aria-label={`${brand.name} — на главную`}>
            <Image src="/brand/logo.png" alt={brand.name} width={366} height={160} priority className="h-11 w-auto min-[400px]:h-12 md:h-[52px]" />
          </Link>
          {/* Game-HUD readout with the page's real frame rate */}
          <FpsCounter className="hidden rounded-lg bg-ink/60 px-3 py-2 backdrop-blur-sm md:flex" />

          {/* The sections people look for first, one click away on desktop; the full list is in the menu */}
          <nav aria-label="Разделы сайта" className="pointer-events-auto ml-auto hidden rounded-lg bg-ink/60 px-1.5 backdrop-blur-sm xl:block">
            <ul className="flex">
              {nav
                .filter((item) => item.bar)
                .map((item) => (
                  <li key={item.href} className={cn(item.bar === "2xl" && "max-2xl:hidden")}>
                    <Link
                      href={item.href}
                      className="block px-3 py-2 font-pixel text-[11px] leading-[22px] whitespace-nowrap uppercase [word-spacing:-0.4em] transition-colors hover:text-lavender hover:[text-shadow:0_0_10px_rgba(233,213,255,0.6)]"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
            </ul>
          </nav>

          <a
            href={`tel:${footer.phone.replace(/\s/g, "")}`}
            aria-label={`Позвонить: ${footer.phone}`}
            data-pixel-avoid
            className="group pointer-events-auto ml-auto flex items-center gap-1.5 rounded-lg bg-ink/60 px-2 py-2 font-pixel text-[10px] leading-[22px] whitespace-nowrap text-white backdrop-blur-sm transition-colors hover:text-lavender min-[400px]:gap-2.5 min-[400px]:text-[11px] md:px-3 md:text-[14px] xl:ml-0"
          >
            <span aria-hidden="true" className="relative flex size-2">
              <span className="absolute inset-0 animate-ping bg-[#4ade80] opacity-60" />
              <span className="relative size-2 bg-[#4ade80]" />
            </span>
            {footer.phone}
          </a>

          <button
            ref={buttonRef}
            type="button"
            aria-expanded={open}
            aria-controls="site-menu"
            aria-label={open ? "Закрыть меню" : "Открыть меню"}
            onClick={() => setOpen((v) => !v)}
            className="pointer-events-auto -mr-2 grid size-10 shrink-0 cursor-pointer place-items-center rounded-lg bg-ink/60 backdrop-blur-sm transition-colors hover:bg-ink-2/80"
          >
            <span className="relative h-5 w-[25px]">
              <span className={cn("absolute left-0 h-[3px] w-full bg-white transition-transform duration-200", open ? "top-[8.5px] rotate-45" : "top-0")} />
              <span className={cn("absolute top-[8.5px] left-0 h-[3px] w-full bg-white transition-opacity duration-200", open && "opacity-0")} />
              <span className={cn("absolute left-0 h-[3px] w-full bg-white transition-transform duration-200", open ? "top-[8.5px] -rotate-45" : "top-[17px]")} />
            </span>
          </button>
        </div>
      </div>

      {/* Menu: a panel under the menu button. Dark pixels fill it in random order,
          then the links slide in; on close the pixels clear and the panel hides. */}
      <div className="pointer-events-none fixed inset-x-0 top-[72px] z-40">
        <div className="wrap flex justify-end">
          <nav
            ref={panelRef}
            id="site-menu"
            aria-label="Основное меню"
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
          </nav>
        </div>
      </div>
    </>
  );
}
