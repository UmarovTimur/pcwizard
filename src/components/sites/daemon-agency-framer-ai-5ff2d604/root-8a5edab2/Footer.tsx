import Image from "next/image";
import Link from "next/link";
import { Noise } from "../shared/primitives";
import { PixelField } from "../shared/PixelField";
import { PixelStars } from "../shared/PixelStars";
import { cn } from "@/lib/utils";
import { SocialIcon, type SocialName } from "../shared/SocialIcon";
import { brand, footer } from "./content";

// Icon tile faces: Telegram blue (as on the hero button) and the site's violet-to-fuchsia for Instagram
const tile: Record<SocialName, string> = {
  telegram: "bg-[#229ed9] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.35),inset_0_-4px_0_0_rgb(14,94,138)]",
  instagram: "bg-[image:var(--accent-gradient-x)] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.35),inset_0_-4px_0_0_rgb(76,29,149)]",
};

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-line bg-ink pb-[clamp(140px,16vw,240px)]">
      <Noise />
      {/* Pixel field at the very bottom of the page, under the footer content, densest at the edge */}
      <PixelField className="absolute inset-x-0 bottom-0 h-[clamp(200px,22vw,320px)]" start={0.25} />
      <PixelStars seed={3} count={6} />

      <div className="wrap relative z-[2]">
        <div className="grid gap-10 py-12 md:py-16 lg:grid-cols-[minmax(0,1fr)_auto] lg:gap-x-14 xl:grid-cols-[minmax(0,1fr)_auto_minmax(0,1.15fr)] xl:gap-x-20">
          <div className="flex flex-col gap-4">
            <Link href="/" aria-label={`${brand.name} — на главную`} className="w-fit">
              <Image src="/brand/logo.png" alt={brand.name} width={366} height={160} className="h-20 w-auto md:h-24" />
            </Link>
            <p className="max-w-[40ch] text-[17px] leading-[1.55] text-white/80">{footer.text}</p>
          </div>

          {/* Contacts: phone, Telegram, Instagram only */}
          <div className="flex flex-col gap-5">
            <a href={`tel:${footer.phone.replace(/\s/g, "")}`} className="w-fit font-display text-[28px] leading-[1.1] whitespace-nowrap hover:text-lavender sm:text-[32px]">
              {footer.phone}
            </a>
            <ul className="flex flex-wrap gap-x-6 gap-y-3">
              {footer.socials.map((s) => (
                <li key={s.label}>
                  {/* Key-style icon tile in the network's colour, with its name beside it */}
                  <a href={s.href} target="_blank" rel="noopener noreferrer" className="group flex items-center gap-3 font-pixel text-[13px] leading-[21.5px] uppercase transition-colors hover:text-lavender">
                    <span
                      className={cn(
                        "grid size-11 place-items-center pb-1 text-white transition-transform duration-150 group-hover:-translate-y-0.5 group-active:translate-y-0.5",
                        tile[s.icon],
                      )}
                    >
                      <SocialIcon name={s.icon} className="h-[18px]" />
                    </span>
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <nav aria-label="Разделы сайта в подвале" className="lg:max-xl:col-span-2">
            <ul className="grid grid-cols-2 gap-x-8 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-2 2xl:grid-cols-3">
              {footer.links.map((l) => (
                <li key={l.label} className="border-b border-line">
                  <Link href={l.href} className="block py-3 font-pixel text-[12px] leading-[23.5px] uppercase [word-spacing:-0.3em] transition-colors hover:text-lavender">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <p className="border-t border-line pt-6 font-mono text-[15px] text-white/70">
          ©{new Date().getFullYear()} {footer.rights}
        </p>
      </div>
    </footer>
  );
}
