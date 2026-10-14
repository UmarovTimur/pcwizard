import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { innerHeading } from "../shared/Prose";
import { Noise } from "../shared/primitives";
import type { LinkItem } from "./blocks";
import { Contact } from "./Contact";
import { Footer } from "./Footer";
import { Header } from "./Header";

/** Header, dark main and the shared contact form + footer for every inner page. */
export function InnerShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main id="main" className="relative bg-ink">
        {children}
        <Contact />
      </main>
      <Footer />
    </>
  );
}

/**
 * A block of an inner page in the shared container. Text keeps a readable measure (900px) on the
 * container's left edge, in line with the page title; `wide` gives the block the full width.
 */
export function Column({ children, className, wide = false }: { children: React.ReactNode; className?: string; wide?: boolean }) {
  return (
    // overflow-clip, not hidden: a sticky block inside (the build page's summary) still sticks to the viewport
    <section className={cn("relative overflow-clip pt-[80px]", className)}>
      <Noise />
      <div className="wrap relative z-[2]">
        <div className={cn(!wide && "max-w-[900px]")}>{children}</div>
      </div>
    </section>
  );
}

/** "Read also" grid of internal links. */
export function RelatedLinks({ title = "Смотрите также", items }: { title?: string; items: LinkItem[] }) {
  return (
    <div className="flex flex-col gap-8">
      <h2 className={innerHeading}>{title}</h2>
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
        {items.map((l) => (
          <li key={l.href}>
            <Link href={l.href} className="group flex h-full items-center justify-between gap-4 border border-line bg-panel px-6 py-5 text-[19px] leading-[1.35] font-medium transition-colors hover:border-violet/60">
              {l.label}
              <ArrowRight className="size-4 shrink-0 transition-transform duration-300 group-hover:translate-x-1" strokeWidth={1.5} aria-hidden="true" />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
