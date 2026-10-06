"use client";

import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Gallery } from "./Gallery";

/** Photo grid for a build page: the first photo is large, the rest tile; any photo opens the full-screen gallery there. */
export function PhotoGrid({ title, photos }: { title: string; photos: string[] }) {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <>
      <ul className="grid grid-cols-2 gap-2 md:grid-cols-4 md:gap-3">
        {photos.map((src, i) => (
          <li key={src} className={cn("relative aspect-[3/4]", i === 0 && "col-span-2 row-span-2 md:aspect-auto")}>
            <button
              type="button"
              onClick={() => setOpen(i)}
              aria-label={`Открыть фото ${i + 1} из ${photos.length}`}
              className="group relative block size-full cursor-pointer overflow-hidden bg-ink-2"
            >
              <Image
                src={src}
                alt={`${title} — фото ${i + 1}`}
                fill
                priority={i === 0}
                sizes={i === 0 ? "(min-width: 768px) 550px, 100vw" : "(min-width: 768px) 275px, 50vw"}
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </button>
          </li>
        ))}
      </ul>
      <Gallery key={open ?? -1} title={title} photos={open === null ? null : photos} start={open ?? 0} onClose={() => setOpen(null)} />
    </>
  );
}
