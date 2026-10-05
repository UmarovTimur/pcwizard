import Link from "next/link";
import { cn } from "@/lib/utils";
import { hero } from "./content";

/** Subheading: short claims as a plain pixel bullet list. */
export function ClaimList({ className }: { className?: string }) {
  return (
    <ul className={cn("flex flex-col gap-3.5", className)}>
      {hero.claims.map((c) => (
        <li key={c} className="flex items-start gap-3 font-pixel text-[11px] leading-[20px] [word-spacing:-0.3em] uppercase md:text-[12px] md:leading-[22px]">
          <span aria-hidden="true" className="mt-[7px] size-[7px] shrink-0 bg-violet shadow-[0_0_8px_rgba(168,85,247,0.9)] md:mt-2" />
          {c}
        </li>
      ))}
    </ul>
  );
}

/**
 * Game-menu style service links. The first item shows a blinking ▶ selector until the
 * menu is hovered; then the selector follows the hovered item.
 */
export function ServiceMenu({ className }: { className?: string }) {
  return (
    <nav aria-label="Услуги" className={className}>
      <ul className="group/menu flex flex-col gap-3.5">
        {hero.bullets.map((b, i) => (
          <li key={b.href}>
            <Link
              href={b.href}
              className="group flex items-center gap-3 font-pixel text-[11px] leading-[20px] [word-spacing:-0.3em] uppercase transition-colors hover:text-lavender md:text-[12px] md:leading-[22px]"
            >
              <span
                aria-hidden="true"
                className={cn(
                  "w-3 text-violet opacity-0 [text-shadow:0_0_8px_rgba(168,85,247,0.9)] group-hover:opacity-100 group-focus-visible:opacity-100",
                  i === 0 && "pixel-cursor opacity-100 group-hover/menu:animate-none group-hover/menu:opacity-0 group-hover/menu:group-hover:opacity-100",
                )}
              >
                ▶
              </span>
              {b.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
