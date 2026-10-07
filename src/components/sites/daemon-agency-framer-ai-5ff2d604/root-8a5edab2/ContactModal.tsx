"use client";

import { X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { PixelCurtain } from "../shared/PixelCurtain";
import { Tag } from "../shared/primitives";
import { ContactForm } from "./Contact";
import { contact, footer } from "./content";

const OPEN_MS = 260;
// On phones the quick-contact button waits until the hero has scrolled up by this much,
// so it doesn't sit on top of the hero's own buttons.
const HERO_SCROLL = 120;

// 11×10 pixel speech bubble with three dots.
const BUBBLE = [
  ".#########.",
  "###########",
  "###########",
  "##.#.#.#.##",
  "###########",
  "###########",
  ".#########.",
  "..##.......",
  ".##........",
  "##.........",
];
const BUBBLE_CELLS = BUBBLE.flatMap((row, y) =>
  [...row].flatMap((c, x) => (c === "#" ? [{ x, y }] : [])),
);

/** True on phones while the home hero still fills the screen (it has its own CTA buttons). */
function useOverHeroOnPhone() {
  const pathname = usePathname();
  // Starts hidden, so on phones the button never flashes over the hero before the first check.
  const [over, setOver] = useState(true);
  useEffect(() => {
    const phone = window.matchMedia("(max-width: 767px)");
    const update = () => {
      const hero = document.getElementById("hero");
      setOver(!!hero && phone.matches && hero.getBoundingClientRect().bottom > window.innerHeight - HERO_SCROLL);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    phone.addEventListener("change", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      phone.removeEventListener("change", update);
    };
  }, [pathname]);
  return over;
}

/**
 * Floating quick-contact button (bottom right). Opens the popup via the "#contact" link handler.
 * On phones it stays hidden over the home hero and slides in once you scroll down.
 */
function QuickContact({ hidden }: { hidden: boolean }) {
  return (
    <a
      href="#contact"
      aria-label="Связаться с нами"
      className={cn(
        "group fixed right-5 bottom-5 z-40 flex items-center gap-3 transition-[opacity,transform] duration-200 md:right-8 md:bottom-8",
        hidden ? "pointer-events-none translate-y-3 opacity-0" : "opacity-100",
      )}
    >
      <span className="pointer-events-none bg-ink-2/90 px-3 py-2 font-pixel text-[12px] leading-[19px] whitespace-nowrap uppercase opacity-0 shadow-[0_0_20px_rgba(124,58,237,0.4)] transition-[opacity,transform] duration-200 ease-[steps(3,end)] translate-x-2 group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100 max-md:hidden">
        Связаться
      </span>
      <span className="relative grid size-[60px] place-items-center">
        {/* Pixel pulse ring */}
        <span
          aria-hidden="true"
          className="absolute inset-0 animate-ping bg-violet/40 [animation-duration:2.4s]"
        />
        <span className="relative grid size-full place-items-center bg-[image:var(--accent-gradient-x)] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.35),inset_0_-5px_0_0_rgb(76,29,149),0_0_24px_rgba(168,85,247,0.6),0_0_60px_rgba(217,70,239,0.3)] transition-transform duration-150 group-hover:-translate-y-1 group-active:translate-y-0.5">
          <svg
            viewBox="0 0 11 10"
            shapeRendering="crispEdges"
            aria-hidden="true"
            className="mb-1 size-[26px] text-white"
          >
            {BUBBLE_CELLS.map(({ x, y }) => (
              <rect
                key={`${x}-${y}`}
                x={x}
                y={y}
                width="1"
                height="1"
                fill="currentColor"
              />
            ))}
          </svg>
        </span>
      </span>
    </a>
  );
}

/**
 * Request form in a popup. Mounted once in the root layout: any link to "#contact"
 * (CTA buttons, the menu item, pricing cards) opens it instead of scrolling to the
 * contact section. Native <dialog> gives focus trapping and Escape for free.
 */
export function ContactModal() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);
  // Remounts the form on every open, so a sent form starts fresh next time.
  const [session, setSession] = useState(0);
  const overHero = useOverHeroOnPhone();

  const show = useCallback(() => {
    const d = dialogRef.current;
    if (!d || d.open) return;
    setSession((n) => n + 1);
    d.showModal();
    setOpen(true);
  }, []);

  const hide = useCallback(() => {
    setOpen(false);
    window.setTimeout(() => dialogRef.current?.close(), OPEN_MS);
  }, []);

  // Intercept plain clicks on links to the contact section.
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (
        e.defaultPrevented ||
        e.button !== 0 ||
        e.metaKey ||
        e.ctrlKey ||
        e.shiftKey ||
        e.altKey
      )
        return;
      const link = (e.target as Element | null)?.closest?.(
        'a[href="#contact"], a[href="/#contact"]',
      );
      if (!link) return;
      e.preventDefault();
      show();
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [show]);

  return (
    <>
      <QuickContact hidden={open || overHero} />
      <dialog
        ref={dialogRef}
        aria-labelledby="contact-modal-title"
        onCancel={(e) => {
          e.preventDefault();
          hide();
        }}
        // A click on the dialog box itself (not its content) is a click on the backdrop.
        onClick={(e) => e.target === e.currentTarget && hide()}
        className="m-auto max-h-[calc(100dvh-32px)] w-[min(720px,calc(100%-32px))] overflow-visible bg-transparent p-0 text-white backdrop:bg-ink/70 backdrop:backdrop-blur-sm"
      >
        <div className="relative">
          <PixelCurtain open={open} cell={24} duration={OPEN_MS} />
          <div
            className={cn(
              "relative max-h-[calc(100dvh-32px)] overflow-y-auto border border-line shadow-[0_0_60px_rgba(124,58,237,0.4)] transition-opacity",
              open ? "opacity-100 duration-200" : "opacity-0 duration-100",
            )}
            style={{ transitionDelay: open ? `${OPEN_MS * 0.6}ms` : "0ms" }}
          >
            <button
              type="button"
              onClick={hide}
              aria-label="Закрыть"
              className="absolute top-4 right-4 z-10 grid size-10 cursor-pointer place-items-center text-white/70 transition-colors hover:bg-white/[0.06] hover:text-white"
            >
              <X className="size-5" strokeWidth={1.5} />
            </button>

            <div className="flex flex-col gap-4 px-5 pt-6 pb-7 md:px-[30px] md:pt-[30px]">
              <Tag>{contact.tag}</Tag>
              <h2
                id="contact-modal-title"
                className="max-w-[520px] pr-10 font-display text-[34px] leading-[38px] tracking-[-0.02em] uppercase md:text-[44px] md:leading-[46px]"
              >
                {contact.heading}
              </h2>
              <p className="max-w-[420px] text-base leading-[25.5px] font-light tracking-[0.02em] text-white/85">
                {contact.lead}
              </p>
            </div>

            <ContactForm
              key={session}
              className="border-t border-line bg-ink"
            />

            <p className="flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-line px-5 py-4 font-mono text-[15px] text-muted md:px-[30px]">
              Или сразу:
              <a
                href={`tel:${footer.phone.replace(/\s/g, "")}`}
                className="text-white underline decoration-white/50 underline-offset-[6px] hover:text-lavender"
              >
                {footer.phone}
              </a>
              {footer.socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white underline decoration-white/50 underline-offset-[6px] hover:text-lavender"
                >
                  {s.label}
                </a>
              ))}
            </p>
          </div>
        </div>
      </dialog>
    </>
  );
}
