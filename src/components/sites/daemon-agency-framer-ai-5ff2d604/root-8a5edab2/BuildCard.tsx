import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import type { Build } from "./content";

/** Sale / sold badge shared by the cards and the build page. */
export function StatusBadge({ status, className }: { status: Build["status"]; className?: string }) {
  return (
    <span className={cn("px-2 py-1 font-pixel text-[9px] leading-[16px] uppercase", status === "sale" ? "bg-[#16a34a]" : "bg-violet", className)}>
      {status === "sale" ? "В продаже" : "Продано"}
    </span>
  );
}

/** Portfolio card: cover photo, status, price, name and highlights; links to the build page. */
export function BuildCard({
  build,
  index,
  sizes,
  tabIndex,
  className,
}: {
  build: Build;
  index: number;
  sizes: string;
  tabIndex?: number;
  className?: string;
}) {
  return (
    <Link
      href={`/portfolio/${build.slug}`}
      tabIndex={tabIndex}
      aria-label={`${build.title}: фото, конфигурация и цена`}
      className={cn("group relative flex flex-col justify-between overflow-hidden p-[26px] text-left", className)}
    >
      <Image src={build.photos[0]} alt={build.title} fill sizes={sizes} className="object-cover transition-transform duration-700 group-hover:scale-105" />
      {/* Darken top and bottom so the labels stay readable on bright RGB photos */}
      <span aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(180deg,rgba(11,6,20,0.65)_0%,transparent_28%,transparent_50%,rgba(11,6,20,0.92)_100%)]" />
      <span className="relative flex items-center justify-between gap-3">
        <span className="flex items-center gap-1.5">
          <span className="bg-ink/60 px-2 py-1 font-pixel text-[9px] leading-[16px] backdrop-blur-sm">#{String(index + 1).padStart(2, "0")}</span>
          <StatusBadge status={build.status} />
        </span>
        <span className="bg-ink/70 px-2 py-1 font-pixel text-[10px] leading-[16px] text-[#4ade80] backdrop-blur-sm">{build.price.usd} $</span>
      </span>
      <span className="relative flex flex-col gap-2">
        <span className="font-display text-[30px] leading-[33px] tracking-[-0.01em] uppercase md:text-[36px] md:leading-[39px]">{build.name}</span>
        <span className="flex flex-wrap gap-1.5">
          {build.highlights.map((h) => (
            <span key={h} className="bg-ink/70 px-2 py-1 font-pixel text-[8px] leading-[14px] uppercase backdrop-blur-sm">
              {h}
            </span>
          ))}
        </span>
      </span>
    </Link>
  );
}
