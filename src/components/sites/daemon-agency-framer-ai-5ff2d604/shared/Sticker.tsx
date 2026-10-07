import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * A die-cut sticker (public/images/stickers/<name>.png) at a slight tilt. While `active` is false
 * it sits faded and grey; when it turns true it slaps on in full colour with a bounce. On hover
 * it straightens and lifts. Size comes from `className`.
 */
export function Sticker({ name, active, tilt = 0, className }: { name: string; active: boolean; tilt?: number; className?: string }) {
  return (
    <span
      aria-hidden="true"
      data-active={active || undefined}
      className={cn("sticker block", className)}
      style={{ "--tilt": `${tilt}deg` } as React.CSSProperties}
    >
      <Image src={`/images/stickers/${name}.png`} alt="" width={370} height={370} sizes="120px" className="h-auto w-full select-none" draggable={false} />
    </span>
  );
}
