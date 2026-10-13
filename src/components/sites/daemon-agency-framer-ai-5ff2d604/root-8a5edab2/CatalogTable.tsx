"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowRight, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { site } from "@/lib/site";
import { CONDITION_LABEL, formatPrice, STOCK_LABEL, type CatalogGroup, type CatalogRow, type Stock } from "@/lib/catalog-shared";
import { Cross } from "../shared/primitives";

const STOCK_DOT: Record<Stock, string> = {
  in_stock: "bg-[#4ade80] shadow-[0_0_6px_rgba(74,222,128,0.8)]",
  on_order: "bg-[#fbbf24]",
  out: "bg-white/25",
};

// 5×5 pixel camera: the mark on rows that open a page with photos
const CAMERA = [".##..", "#####", "#.#.#", "#####", "....."];

function CameraGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 5 5" shapeRendering="crispEdges" aria-hidden="true" className={cn("size-[15px]", className)}>
      {CAMERA.flatMap((row, y) => [...row].flatMap((c, x) => (c === "#" ? [<rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" fill="currentColor" />] : [])))}
    </svg>
  );
}

function StockBadge({ stock }: { stock: Stock }) {
  return (
    <span className={cn("inline-flex items-center gap-2 whitespace-nowrap", stock === "out" && "text-white/45")}>
      <span aria-hidden="true" className={cn("size-[7px] shrink-0", STOCK_DOT[stock])} />
      {STOCK_LABEL[stock]}
    </span>
  );
}

function Price({ price }: { price: number | null }) {
  return (
    <span className={cn("font-pixel text-[12px] leading-[20px] whitespace-nowrap md:text-[13px]", price == null ? "text-white/45" : "text-[#4ade80]")}>
      {formatPrice(price)}
    </span>
  );
}

/**
 * One product. A row with its own page is marked (violet edge, photo or camera tile, "Фото"
 * tag) and the whole row opens the page; plain rows are just information. On phones each row
 * folds into a compact card.
 */
function Row({ row }: { row: CatalogRow }) {
  const linked = !!row.href;
  const meta = (
    <span className="flex flex-wrap items-center gap-x-3 gap-y-1">
      <StockBadge stock={row.stock} />
      {row.condition === "used" && <span className="bg-white/10 px-1.5 font-pixel text-[10px] leading-[18px] uppercase">{CONDITION_LABEL.used}</span>}
    </span>
  );

  return (
    <tr
      className={cn(
        "relative border-b border-line text-[15px] leading-[22px] max-md:grid max-md:grid-cols-[auto_minmax(0,1fr)] max-md:gap-x-4 max-md:gap-y-2 max-md:px-4 max-md:py-4",
        linked &&
          "group cursor-pointer bg-violet/[0.04] transition-colors hover:bg-violet/[0.12] focus-within:bg-violet/[0.12] max-md:shadow-[inset_3px_0_0_#a855f7]",
      )}
    >
      {/* Marker column: a violet edge, and a photo (or camera) tile for rows with a page */}
      <td className="relative w-[76px] py-3 pl-4 align-middle max-md:row-span-2 max-md:w-auto max-md:p-0">
        {linked && <span aria-hidden="true" className="absolute inset-y-0 left-0 w-[3px] bg-violet shadow-[0_0_10px_rgba(168,85,247,0.9)] max-md:hidden" />}
        {linked ? (
          <span className="relative grid size-12 place-items-center overflow-hidden border border-violet/60 bg-ink-2 text-lavender">
            {row.thumb ? <Image src={row.thumb} alt="" fill sizes="48px" className="object-cover" /> : <CameraGlyph />}
          </span>
        ) : (
          <span aria-hidden="true" className="block size-12 border border-white/[0.06]" />
        )}
      </td>

      <td className="py-3 pr-4 align-middle">
        {linked ? (
          // Stretched link: the whole row is the click target
          <Link href={row.href!} className="font-medium text-white outline-none after:absolute after:inset-0 group-hover:text-lavender focus-visible:underline">
            {row.title}
          </Link>
        ) : (
          <span className="font-medium text-white/90">{row.title}</span>
        )}
        {row.brand && <span className="ml-2 font-pixel text-[10px] leading-[18px] text-white/45 uppercase">{row.brand}</span>}
        {row.summary && <p className="mt-0.5 text-[13px] leading-[19px] font-light text-white/60 md:hidden">{row.summary}</p>}
      </td>

      <td className="hidden py-3 pr-4 align-middle text-[14px] font-light text-white/70 md:table-cell">{row.summary ?? "—"}</td>
      <td className="hidden py-3 pr-4 align-middle text-[13px] md:table-cell">{meta}</td>
      <td className="py-3 pr-4 text-right align-middle max-md:col-start-2 max-md:flex max-md:items-center max-md:justify-between max-md:gap-3 max-md:p-0 max-md:text-left max-md:text-[13px]">
        <span className="md:hidden">{meta}</span>
        <Price price={row.price} />
      </td>
      <td className="hidden w-[110px] py-3 pr-4 text-right align-middle md:table-cell">
        {linked && (
          <span className="inline-flex items-center gap-1.5 bg-violet px-2 font-pixel text-[10px] leading-[22px] uppercase transition-colors group-hover:bg-fuchsia">
            <CameraGlyph className="size-3" />
            Фото
            <ArrowRight className="size-3 transition-transform duration-300 group-hover:translate-x-0.5" strokeWidth={2} aria-hidden="true" />
          </span>
        )}
      </td>
    </tr>
  );
}

/**
 * The parts catalog as one table split into categories: a search box and category links on top,
 * then a titled table per category. Products with their own page are marked and clickable.
 */
export function CatalogTable({ groups }: { groups: CatalogGroup[] }) {
  const [query, setQuery] = useState("");

  const shown = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return groups;
    return groups
      .map((g) => ({ ...g, rows: g.rows.filter((r) => [r.title, r.brand, r.summary, g.title].some((t) => t?.toLowerCase().includes(q))) }))
      .filter((g) => g.rows.length);
  }, [groups, query]);

  const total = groups.reduce((n, g) => n + g.rows.length, 0);

  if (!total) {
    return (
      <div className="relative flex flex-col items-start gap-5 border-y border-line py-12">
        <Cross className="top-0 left-0" />
        <Cross className="top-0 left-full" />
        <p className="font-display text-[28px] leading-[1.1] uppercase md:text-[36px]">Каталог скоро наполнится</p>
        <p className="max-w-[520px] text-[17px] leading-7 font-light text-white/80">
          Пока мы добавляем товары, просто напишите, какая деталь нужна, — проверим наличие и пришлём цену.
        </p>
        <a href={site.telegram} target="_blank" rel="noopener noreferrer" className="font-mono text-[15px] underline decoration-white/60 underline-offset-[6px] hover:text-white/70">
          Написать в Telegram
        </a>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-10">
      {/* Toolbar: sticks under the header while the table scrolls */}
      <div className="sticky top-[76px] z-10 -mx-5 flex flex-col gap-3 border-y border-line bg-ink/90 px-5 py-3 backdrop-blur-md md:top-[84px] md:mx-0 md:flex-row md:items-center md:gap-5 md:px-4">
        <label className="flex shrink-0 items-center gap-2 border border-line bg-ink-2 px-3 md:w-[300px]">
          <Search className="size-4 text-white/50" strokeWidth={1.5} aria-hidden="true" />
          <span className="sr-only">Поиск по каталогу</span>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Найти деталь…"
            className="h-10 w-full bg-transparent text-[15px] outline-none placeholder:text-white/40"
          />
        </label>
        <nav aria-label="Категории каталога" className="-mx-5 overflow-x-auto px-5 md:mx-0 md:px-0">
          <ul className="flex gap-2">
            {shown.map((g) => (
              <li key={g.id} className="shrink-0">
                <a href={`#${g.slug}`} className="block bg-line px-3 font-pixel text-[11px] leading-[32px] uppercase whitespace-nowrap transition-colors hover:bg-violet">
                  {g.title}
                  <span className="ml-2 text-white/50">{g.rows.length}</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Legend for the marked rows */}
      <p className="-mt-4 flex items-center gap-2.5 text-[13px] leading-5 font-light text-white/60">
        <span className="grid size-6 shrink-0 place-items-center border border-violet/60 bg-ink-2 text-lavender">
          <CameraGlyph className="size-3" />
        </span>
        Строки с фиолетовой меткой открываются — там фото и подробные характеристики.
      </p>

      {shown.length === 0 && (
        <p className="border-y border-line py-10 text-[17px] font-light text-white/80">
          Ничего не нашлось по запросу «{query}». Напишите нам в{" "}
          <a href={site.telegram} target="_blank" rel="noopener noreferrer" className="text-lavender underline underline-offset-4 hover:text-white">
            Telegram
          </a>{" "}
          — подберём.
        </p>
      )}

      {shown.map((g) => (
        <section key={g.id} id={g.slug} aria-labelledby={`cat-${g.slug}`} className="scroll-mt-[200px] md:scroll-mt-[160px]">
          <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-2 pb-4">
            <div className="flex flex-col gap-1">
              <h2 id={`cat-${g.slug}`} className="font-display text-[28px] leading-[1.05] uppercase md:text-[36px]">
                {g.title}
              </h2>
              {g.description && <p className="max-w-[640px] text-[15px] leading-6 font-light text-white/65">{g.description}</p>}
            </div>
            <span className="font-pixel text-[11px] leading-[20px] text-white/50 uppercase">{g.rows.length} шт.</span>
          </div>
          <table className="relative w-full table-fixed border-collapse border-t border-line text-left max-md:block">
            <caption className="sr-only">{g.title}</caption>
            {/* Same column widths in every category */}
            <colgroup className="max-md:hidden">
              <col className="w-[76px]" />
              <col />
              <col className="w-[28%]" />
              <col className="w-[15%]" />
              <col className="w-[190px]" />
              <col className="w-[110px]" />
            </colgroup>
            <thead className="max-md:hidden">
              <tr className="border-b border-line font-pixel text-[10px] leading-[18px] text-white/45 uppercase">
                <th scope="col" className="py-3 pl-4">
                  <span className="sr-only">Фото</span>
                </th>
                <th scope="col" className="py-3 pr-4 font-normal">Товар</th>
                <th scope="col" className="py-3 pr-4 font-normal">Характеристики</th>
                <th scope="col" className="py-3 pr-4 font-normal">Наличие</th>
                <th scope="col" className="py-3 pr-4 text-right font-normal">Цена</th>
                <th scope="col" className="py-3 pr-4">
                  <span className="sr-only">Страница товара</span>
                </th>
              </tr>
            </thead>
            <tbody className="max-md:block">
              {g.rows.map((r) => (
                <Row key={r.id} row={r} />
              ))}
            </tbody>
          </table>
        </section>
      ))}
    </div>
  );
}
