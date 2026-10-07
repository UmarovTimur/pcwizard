import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { PixelStars } from "../shared/PixelStars";
import { Cross, Noise } from "../shared/primitives";
import type { LinkItem } from "./blocks";
import { Contact } from "./Contact";
import { Footer } from "./Footer";
import { Header } from "./Header";

/** Header, dark main and the shared contact form + footer for every inner page. */
export function InnerShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main className="relative bg-ink">
        <PixelStars seed={11} count={18} />
        {children}
        <Contact />
      </main>
      <Footer />
    </>
  );
}

/** Centre column (730px on desktop) framed by the site's guide lines. */
export function Column({ children, className, wide = false }: { children: React.ReactNode; className?: string; wide?: boolean }) {
  return (
    <section className={cn("relative flex justify-center overflow-hidden pt-[80px]", className)}>
      <Noise />
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 hidden md:block">
        <span className="absolute inset-y-0 left-[calc(50%-365px)] w-px bg-line" />
        <span className="absolute inset-y-0 left-[calc(50%+365px)] w-px bg-line" />
      </div>
      <div className={cn("relative z-[2] w-full px-5", wide ? "md:w-full md:max-w-[1100px] md:px-0" : "md:w-full md:max-w-[730px] md:px-[30px]")}>{children}</div>
    </section>
  );
}

/** "Read also" grid of internal links. */
export function RelatedLinks({ title = "Смотрите также", items }: { title?: string; items: LinkItem[] }) {
  return (
    <div className="flex flex-col gap-5">
      <h2 className="font-display text-[32px] leading-[36px] tracking-[-0.02em] uppercase">{title}</h2>
      <ul className="relative grid border-y border-line md:grid-cols-3">
        <Cross className="top-0 left-0" />
        <Cross className="top-0 left-full" />
        {items.map((l) => (
          <li key={l.href} className="border-line max-md:border-b max-md:last:border-b-0 md:border-l md:first:border-l-0">
            <Link href={l.href} className="group flex h-full items-center justify-between gap-4 px-5 py-5 font-mono text-[15px] leading-[23px] uppercase transition-colors hover:bg-white/[0.04]">
              {l.label}
              <ArrowRight className="size-3.5 shrink-0 transition-transform duration-300 group-hover:translate-x-1" strokeWidth={1.25} aria-hidden="true" />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
