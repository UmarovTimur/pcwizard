import Image from "next/image";
import Link from "next/link";
import { Cross, Noise } from "../shared/primitives";
import { PixelField } from "../shared/PixelField";
import { PixelStars } from "../shared/PixelStars";
import { brand, footer } from "./content";

export function Footer() {
  return (
    <footer className="relative flex justify-center overflow-hidden bg-ink pb-[clamp(120px,14vw,200px)]">
      <Noise />
      {/* Pixel field at the very bottom of the page, under the footer content, densest at the edge */}
      <PixelField className="absolute inset-x-0 bottom-0 h-[clamp(200px,22vw,320px)]" start={0.25} />
      <PixelStars seed={3} count={6} />
      <div className="relative z-[2] grid w-full border-t border-line px-5 md:w-full md:max-w-[1100px] md:grid-cols-2 md:px-0">
        <Cross className="top-0 left-0" />
        <Cross className="top-0 left-1/2" />
        <Cross className="top-0 left-full" />

        {/* Left column */}
        <div className="flex flex-col border-line md:border-x">
          <div className="flex flex-col gap-3 border-b border-line px-[30px] pt-[30px] pb-[30px]">
            <Link href="/" aria-label={`${brand.name} — на главную`} className="w-fit">
              <Image src="/brand/logo.png" alt={brand.name} width={366} height={160} className="h-20 w-auto md:h-24" />
            </Link>
            <p className="max-w-[340px] text-base leading-[25.5px] font-light tracking-[0.02em]">{footer.text}</p>
          </div>
          {/* Contacts: phone, Telegram, Instagram only */}
          <div className="flex flex-col gap-4 border-b border-line px-[30px] py-[30px]">
            <a href={`tel:${footer.phone.replace(/\s/g, "")}`} className="w-fit font-display text-[26px] leading-[1.1] whitespace-nowrap hover:text-lavender sm:text-[34px] lg:text-[38px]">
              {footer.phone}
            </a>
            <ul className="flex gap-6">
              {footer.socials.map((s) => (
                <li key={s.label}>
                  <a href={s.href} target="_blank" rel="noopener noreferrer" className="font-pixel text-[13px] leading-[21.5px] uppercase underline decoration-violet decoration-2 underline-offset-[7px] hover:text-lavender hover:decoration-lavender">
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <p className="px-[30px] py-[30px] font-mono text-[15px] text-white/80">
            ©{new Date().getFullYear()} {footer.rights}
          </p>
        </div>

        {/* Right column */}
        <div className="flex flex-col justify-end border-line md:border-r">
          <ul className="grid grid-cols-2 border-t border-line">
            {footer.links.map((l, i) => (
              <li key={l.label} className={i % 2 === 0 ? "border-r border-b border-line" : "border-b border-line"}>
                <Link href={l.href} className="block px-4 py-3.5 font-pixel text-[11px] leading-[23.5px] uppercase lg:px-[30px] lg:text-[13px] transition-colors hover:bg-white/[0.04]">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
          <p className="flex items-center gap-4 px-[30px] py-[30px] font-mono text-[15px] text-white/80">
            <a href="#" className="hover:text-white">
              {footer.legal[0]}
            </a>
            <span aria-hidden="true" className="size-[5px] bg-white" />
            <a href="#" className="hover:text-white">
              {footer.legal[1]}
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
