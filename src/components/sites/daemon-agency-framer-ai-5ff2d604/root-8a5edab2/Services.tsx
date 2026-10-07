import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Cross, KeyButton, Noise, Tag } from "../shared/primitives";
import { PixelIcon } from "../shared/PixelIcon";
import { Reveal } from "../shared/motion";
import { services } from "./content";

const PATTERNS = [
  [3, 6, 9, 12, 15],
  [0, 5, 10, 15, 3],
  [1, 4, 6, 9, 11, 14],
  [0, 3, 12, 15, 5, 10],
];

function ServiceCell({
  title,
  text,
  href,
  pattern,
  textAt,
  iconAt,
}: {
  title: string;
  text: string;
  href?: string;
  pattern: number[];
  textAt: "top" | "bottom";
  iconAt: "top-right" | "bottom-right";
}) {
  return (
    <div className={cn("relative flex h-[430px] flex-col gap-5 bg-ink p-[30px] max-md:h-[320px]", textAt === "bottom" && "justify-end")}>
      <PixelIcon pattern={pattern} className={cn("absolute right-[30px]", iconAt === "top-right" ? "top-[30px]" : "bottom-[30px]")} />
      <Reveal className="flex w-[219px] flex-col gap-[13px]">
        <h3 className="font-pixel text-[15px] leading-[25.5px] uppercase">{title}</h3>
        <p className="text-base leading-[25.5px] font-light tracking-[0.02em] text-muted">{text}</p>
        {href && (
          <Link href={href} className="group flex w-fit items-center gap-2 font-pixel text-[11px] leading-[22px] uppercase hover:text-lavender">
            Подробнее
            <ArrowRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-1" strokeWidth={1.25} aria-hidden="true" />
          </Link>
        )}
      </Reveal>
    </div>
  );
}

function RowCrosses() {
  return (
    <>
      <Cross className="top-0 left-0" />
      <Cross className="top-0 left-1/2" />
      <Cross className="top-0 left-full" />
    </>
  );
}

export function Services() {
  const [a, b, c, d] = services.items;
  return (
    <section id="services" className="relative flex flex-col items-center overflow-hidden pt-[140px] pb-2.5">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 hidden md:block">
        <span className="absolute inset-y-0 left-1/2 w-px bg-line" />
      </div>
      <Noise />

      <div className="relative z-[2] w-full px-5 md:w-full md:max-w-[1100px] md:px-0">
        {/* Row 1: intro + first service */}
        <div className="relative grid border-t border-line md:grid-cols-2">
          <RowCrosses />
          <div className="relative flex h-[430px] flex-col gap-5 overflow-hidden bg-ink pt-[30px] pr-10 pl-[30px] max-md:h-auto max-md:pb-10">
            <div className="flex max-w-[480px] flex-col gap-5">
              <Tag>{services.tag}</Tag>
              <Reveal as="h2" className="max-w-[430px] font-display text-[44px] leading-[44px] tracking-[-0.03em] uppercase max-md:text-[34px] max-md:leading-[36px]">
                {services.heading}
              </Reveal>
            </div>
            <p className="max-w-[300px] text-[17px] leading-[27px] font-light tracking-[0.02em]">{services.lead}</p>
            <Noise />
          </div>
          <ServiceCell {...a} pattern={PATTERNS[0]} textAt="top" iconAt="bottom-right" />
        </div>

        {/* Row 2 */}
        <div className="relative grid border-t border-line md:grid-cols-2">
          <RowCrosses />
          <ServiceCell {...b} pattern={PATTERNS[1]} textAt="top" iconAt="bottom-right" />
          <ServiceCell {...c} pattern={PATTERNS[2]} textAt="bottom" iconAt="top-right" />
        </div>

        {/* Row 3: last service + CTA */}
        <div className="relative grid border-y border-line md:grid-cols-2">
          <RowCrosses />
          <Cross className="top-full left-0" />
          <Cross className="top-full left-1/2" />
          <Cross className="top-full left-full" />
          <ServiceCell {...d} pattern={PATTERNS[3]} textAt="bottom" iconAt="top-right" />
          <div className="relative flex h-[430px] flex-col justify-end gap-5 overflow-hidden bg-ink p-[30px] max-md:h-auto max-md:pt-16">
            <Noise />
            <div className="relative z-[2] flex flex-col gap-5">
              <p className="max-w-[400px] text-[17px] leading-[27px] font-light tracking-[0.02em]">{services.cta.text}</p>
              <KeyButton href={services.cta.href}>{services.cta.label}</KeyButton>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
