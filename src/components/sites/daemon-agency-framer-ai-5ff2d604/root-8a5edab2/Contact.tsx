"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";
import { Cross, KeyButton, Noise, Tag } from "../shared/primitives";
import { Achievement } from "../shared/Achievement";
import { Reveal } from "../shared/motion";
import { PixelField } from "../shared/PixelField";
import { contact } from "./content";

const fieldLabel = "px-2.5 font-mono text-[13px] leading-[19.5px] tracking-[-0.03em] text-muted";
const fieldInput =
  "w-full bg-transparent py-3 pr-2.5 pl-2.5 text-sm font-light tracking-[0.02em] text-white placeholder:text-white/40 focus:outline-none";

export function Contact() {

  return (
    <section id="contact" className="relative flex flex-col items-center overflow-hidden py-[200px]">
      <Noise />
      {/* Pixels rise from the bottom edge and continue into the footer */}
      <PixelField className="absolute inset-x-0 bottom-0 h-[420px]" start={0.15} />
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 hidden md:block">
        <span className="absolute inset-y-0 left-[calc(50%-365px)] w-px bg-line" />
        <span className="absolute inset-y-0 left-1/2 w-px bg-line" />
        <span className="absolute inset-y-0 left-[calc(50%+365px)] w-px bg-line" />
      </div>

      <div className="relative z-[2] flex w-full flex-col gap-5 border-t border-line px-5 pt-[30px] pb-[50px] md:w-[1100px] md:px-[30px]">
        <Cross className="top-0 left-0" />
        <Cross className="top-0 left-full" />
        <Tag>{contact.tag}</Tag>
        {/* Desktop: one line sized to span the full 1040px content width */}
        <Reveal as="h2" className="w-full font-display text-[40px] leading-[44px] tracking-[-0.02em] uppercase md:text-[54px] md:leading-[58px] md:whitespace-nowrap">
          {contact.heading}
        </Reveal>
        <p className="max-w-[420px] text-[15px] leading-6 font-light tracking-[0.02em]">{contact.lead}</p>
      </div>

      <ContactForm framed className="relative z-[2] w-full border-y border-line bg-ink md:w-[1100px]" />
    </section>
  );
}

/** The request form, shared by the contact section and the contact popup. */
/** `framed`: grid crosses for the full-width section; otherwise the submit button sits bottom-right (popup). */
export function ContactForm({ className, framed = false }: { className?: string; framed?: boolean }) {
  const [sent, setSent] = useState(false);
  const f = contact.fields;

  return (
    <form
      className={cn("grid md:grid-cols-2", className)}
      onSubmit={(e) => {
        e.preventDefault();
        setSent(true);
      }}
    >
      {framed && (
        <>
          <Cross className="top-0 left-0" />
          <Cross className="top-0 left-1/2" />
          <Cross className="top-0 left-full" />
          <Cross className="top-full left-0" />
          <Cross className="top-full left-1/2" />
          <Cross className="top-full left-full" />
        </>
      )}

      <label className="flex flex-col gap-2.5 border-b border-line pt-5 md:border-r">
        <span className={fieldLabel}>{f.name.label}</span>
        <input name="name" required autoComplete="name" placeholder={f.name.placeholder} className={fieldInput} />
      </label>
      <label className="flex flex-col gap-2.5 border-b border-line pt-5">
        <span className={fieldLabel}>{f.phone.label}</span>
        <input name="phone" type="tel" required autoComplete="tel" placeholder={f.phone.placeholder} className={fieldInput} />
      </label>
      <label className="flex flex-col gap-2.5 border-b border-line pt-5 md:border-r">
        <span className={fieldLabel}>{f.service.label}</span>
        <span className="relative">
          <select name="service" defaultValue="" className={`${fieldInput} appearance-none pr-10 invalid:text-white/40`} required>
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
      <label className="flex flex-col gap-2.5 border-b border-line pt-5">
        <span className={fieldLabel}>{f.budget.label}</span>
        <input name="budget" placeholder={f.budget.placeholder} className={fieldInput} />
      </label>
      <label className="flex flex-col gap-2.5 pt-5 md:border-r md:border-line">
        <span className={fieldLabel}>{f.message.label}</span>
        <textarea name="message" rows={4} placeholder={f.message.placeholder} className={`${fieldInput} min-h-[100px] resize-y`} />
      </label>
      <div className={cn("flex items-start p-5", framed ? "md:p-0" : "md:items-end md:justify-end md:p-[30px]")}>
        {sent ? (
          <>
            <p className="p-2.5 font-mono text-[13px] leading-[20.8px] text-muted uppercase">{contact.sent}</p>
            <Achievement title={contact.achievement.title} text={contact.achievement.text} />
          </>
        ) : (
          <KeyButton>{contact.submit}</KeyButton>
        )}
      </div>
    </form>
  );
}
