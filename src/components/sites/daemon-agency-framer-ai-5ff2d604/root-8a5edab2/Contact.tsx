"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";
import { KeyButton, Noise, SectionHead, ShardBullet } from "../shared/primitives";
import { Achievement } from "../shared/Achievement";
import { PixelCity } from "../shared/PixelCity";
import { site } from "@/lib/site";
import { sendLead } from "@/lib/lead";
import { cleanLead, leadText, type Lead } from "@/lib/lead-text";
import { contact, footer, hero } from "./content";

const fieldLabel = "px-5 font-mono text-[15px] leading-[22.5px] tracking-[-0.03em] text-muted";
const fieldInput = "w-full bg-transparent px-5 py-3 text-[18px] text-white placeholder:text-white/40 focus:outline-none";
// The field itself has no outline: its whole cell shows the focus instead
const fieldCell = "flex flex-col gap-2.5 border-line pt-5 transition-[background-color,box-shadow] focus-within:bg-white/[0.04] focus-within:shadow-[inset_0_-2px_0_var(--color-violet)]";
/** Pixel-font link with a violet underline (Telegram, Instagram). */
export const socialLink =
  "font-pixel text-[13px] leading-[21.5px] uppercase underline decoration-violet decoration-2 underline-offset-[7px] hover:text-lavender hover:decoration-lavender";

/** The closing section: the ask on top, then the request form with the direct contacts and the key promises beside it. */
export function Contact() {
  return (
    <section id="contact" className="relative overflow-hidden border-t border-line pt-[270px] pb-[clamp(72px,8vw,128px)]">
      <Noise />
      {/* Drifting pixel rooftops above the heading */}
      <PixelCity className="top-0 opacity-70" />

      <div className="wrap relative z-[2]">
        <SectionHead stacked title={contact.heading} lead={contact.lead} />

        <div className="grid gap-4 lg:grid-cols-[minmax(0,7fr)_minmax(0,4fr)] lg:gap-5">
          <ContactForm className="border border-line bg-panel" />

          {/* Contacts: phone, Telegram, Instagram only */}
          <aside className="flex flex-col gap-5 border border-line bg-panel p-6 md:p-8">
            <p className="font-mono text-[15px] text-muted">{contact.direct}</p>
            <a href={`tel:${footer.phone.replace(/\s/g, "")}`} className="w-fit font-display text-[28px] leading-[1.1] whitespace-nowrap hover:text-lavender sm:text-[32px] lg:text-[26px] xl:text-[32px]">
              {footer.phone}
            </a>
            <ul className="flex flex-wrap gap-x-6 gap-y-3">
              {footer.socials.map((s) => (
                <li key={s.label}>
                  <a href={s.href} target="_blank" rel="noopener noreferrer" className={socialLink}>
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
            <ul className="mt-auto flex flex-col gap-3.5 border-t border-line pt-6">
              {hero.trust.map((t) => (
                <li key={t} className="flex items-start gap-3 font-pixel text-[12px] leading-[22px] uppercase [word-spacing:-0.3em]">
                  <ShardBullet className="mt-[3px] h-[15px]" />
                  {t}
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </div>
    </section>
  );
}

/**
 * The request form, shared by the contact section and the contact popup.
 * `service`: preselected option, ignored unless it is one of the listed services.
 */
export function ContactForm({ className, service }: { className?: string; service?: string }) {
  // idle → sending → sent, or "fallback" with the request text when it could not be delivered from the site
  const [state, setState] = useState<{ step: "idle" | "sending" | "sent" } | { step: "fallback"; lead: Lead }>({ step: "idle" });
  const f = contact.fields;
  const preset = service && f.service.options.includes(service) ? service : "";

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const field = (name: string) => String(data.get(name) ?? "");
    const lead = cleanLead({
      name: field("name"),
      phone: field("phone"),
      service: field("service"),
      budget: field("budget"),
      message: field("message"),
      page: window.location.pathname,
    });
    setState({ step: "sending" });
    const ok = await sendLead(lead).catch(() => false);
    setState(ok ? { step: "sent" } : { step: "fallback", lead });
  };

  return (
    <form className={cn("grid md:grid-cols-2", className)} onSubmit={onSubmit}>
      <label className={cn(fieldCell, "border-b md:border-r")}>
        <span className={fieldLabel}>{f.name.label}</span>
        <input name="name" required autoComplete="name" placeholder={f.name.placeholder} className={fieldInput} />
      </label>
      <label className={cn(fieldCell, "border-b")}>
        <span className={fieldLabel}>{f.phone.label}</span>
        <input name="phone" type="tel" inputMode="tel" required autoComplete="tel" placeholder={f.phone.placeholder} className={fieldInput} />
      </label>
      <label className={cn(fieldCell, "border-b md:border-r")}>
        <span className={fieldLabel}>{f.service.label}</span>
        <span className="relative">
          <select name="service" defaultValue={preset} className={`${fieldInput} appearance-none pr-10 invalid:text-white/40`} required>
            <option value="" disabled>
              {f.service.placeholder}
            </option>
            {f.service.options.map((o) => (
              <option key={o} value={o} className="bg-ink text-white">
                {o}
              </option>
            ))}
          </select>
          <ChevronDown aria-hidden="true" className="pointer-events-none absolute top-1/2 right-5 size-4 -translate-y-1/2 text-white/50" strokeWidth={1.25} />
        </span>
      </label>
      <label className={cn(fieldCell, "border-b")}>
        <span className={fieldLabel}>{f.budget.label}</span>
        <input name="budget" placeholder={f.budget.placeholder} className={fieldInput} />
      </label>
      <label className={cn(fieldCell, "md:border-r")}>
        <span className={fieldLabel}>{f.message.label}</span>
        <textarea name="message" rows={4} placeholder={f.message.placeholder} className={`${fieldInput} min-h-[100px] resize-y`} />
      </label>
      <div className="flex flex-col items-start gap-4 p-5 md:justify-end md:p-[30px]" aria-live="polite">
        {state.step === "sent" && (
          <>
            <p className="font-mono text-[15px] leading-[24px] text-muted uppercase">{contact.sent}</p>
            <Achievement title={contact.achievement.title} text={contact.achievement.text} />
          </>
        )}
        {state.step === "fallback" && (
          <>
            <p className="text-[17px] leading-[1.5] text-white/85">{contact.fallback.text}</p>
            <KeyButton href={`${site.telegram}?text=${encodeURIComponent(leadText(state.lead))}`} tone="accent" external>
              {contact.fallback.label}
            </KeyButton>
            <p className="font-mono text-[15px] text-muted">
              {contact.fallback.call}{" "}
              <a href={`tel:${footer.phone.replace(/\s/g, "")}`} className="text-white underline decoration-white/50 underline-offset-[6px] hover:text-lavender">
                {footer.phone}
              </a>
            </p>
          </>
        )}
        {(state.step === "idle" || state.step === "sending") && (
          <KeyButton disabled={state.step === "sending"} className="md:self-end">
            {state.step === "sending" ? contact.sending : contact.submit}
          </KeyButton>
        )}
      </div>
    </form>
  );
}
