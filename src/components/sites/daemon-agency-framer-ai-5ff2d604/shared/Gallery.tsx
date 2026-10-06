"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Full-screen photo viewer on a native <dialog> (focus trap + Escape for free).
 * Arrow keys / buttons / swipe switch photos; thumbnails jump directly.
 * Opens when `photos` is set, at photo `start`; `onClose` clears it.
 * Give it a `key` that changes per opening so `start` is picked up each time.
 */
export function Gallery({ title, photos, start = 0, onClose }: { title: string; photos: string[] | null; start?: number; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  const [index, setIndex] = useState(start);
  const touchX = useRef<number | null>(null);
  const count = photos?.length ?? 0;

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (photos && !d.open) d.showModal();
    if (!photos && d.open) d.close();
  }, [photos]);

  const go = (dir: 1 | -1) => setIndex((i) => (i + dir + count) % count);

  return (
    <dialog
      ref={ref}
      aria-label={title}
      onClose={onClose}
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") go(1);
        if (e.key === "ArrowLeft") go(-1);
      }}
      onClick={(e) => e.target === e.currentTarget && ref.current?.close()}
      className="m-0 h-dvh max-h-none w-screen max-w-none bg-ink/95 p-0 text-white backdrop:bg-ink/80 backdrop:backdrop-blur-sm"
    >
      {photos && (
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between gap-4 px-5 py-4 md:px-10">
            <p className="font-pixel text-[11px] leading-[18px] uppercase md:text-[13px]">
              {title}
              <span className="ml-4 text-muted">
                {index + 1}/{count}
              </span>
            </p>
            <button
              type="button"
              onClick={() => ref.current?.close()}
              aria-label="Закрыть"
              className="grid size-10 cursor-pointer place-items-center text-white/70 transition-colors hover:bg-white/[0.06] hover:text-white"
            >
              <X className="size-6" strokeWidth={1.5} />
            </button>
          </div>

          <div
            className="relative min-h-0 flex-1"
            onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
            onTouchEnd={(e) => {
              if (touchX.current === null) return;
              const dx = e.changedTouches[0].clientX - touchX.current;
              if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1);
              touchX.current = null;
            }}
          >
            <Image key={photos[index]} src={photos[index]} alt={`${title} — фото ${index + 1}`} fill sizes="100vw" className="object-contain" />
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="Предыдущее фото"
              className="absolute top-1/2 left-3 grid size-12 -translate-y-1/2 cursor-pointer place-items-center bg-ink/60 backdrop-blur-sm transition-colors hover:bg-violet/40 md:left-8"
            >
              <ChevronLeft className="size-6" strokeWidth={1.5} />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label="Следующее фото"
              className="absolute top-1/2 right-3 grid size-12 -translate-y-1/2 cursor-pointer place-items-center bg-ink/60 backdrop-blur-sm transition-colors hover:bg-violet/40 md:right-8"
            >
              <ChevronRight className="size-6" strokeWidth={1.5} />
            </button>
          </div>

          <ul className="flex justify-start gap-2 overflow-x-auto px-5 py-4 md:justify-center md:px-10">
            {photos.map((src, i) => (
              <li key={src} className="shrink-0">
                <button
                  type="button"
                  onClick={() => setIndex(i)}
                  aria-label={`Фото ${i + 1}`}
                  aria-current={i === index}
                  className={cn(
                    "relative block size-14 cursor-pointer overflow-hidden border-2 transition-[border-color,opacity] md:size-16",
                    i === index ? "border-violet" : "border-transparent opacity-50 hover:opacity-100",
                  )}
                >
                  <Image src={src} alt="" fill sizes="64px" className="object-cover" />
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </dialog>
  );
}
