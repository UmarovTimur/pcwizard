"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { BarButton, Cross, KeyButton, Noise, Placeholder, Tag } from "../shared/primitives";
import { Reveal } from "../shared/motion";
import { pricing } from "./content";

type Currency = "uzs" | "usd";

const CURRENCIES: { value: Currency; label: string }[] = [
  { value: "uzs", label: "Сум" },
  { value: "usd", label: "USD" },
];

const formatPrice = (value: number) => new Intl.NumberFormat("ru-RU").format(value);

function CheckIcon() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" className="mt-[3px] size-4 shrink-0 text-muted">
      <circle cx="8" cy="8" r="7" fill="none" stroke="currentColor" strokeWidth="1" />
      <path d="M5 8.2 L7.1 10.2 L11 6" fill="none" stroke="currentColor" strokeWidth="1" />
    </svg>
  );
}

/** Hand-drawn style arrow + circled note pointing at the currency toggle. */
function DiscountNote({ text }: { text: string }) {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute -top-[62px] left-[206px] h-[103px] w-[108px] max-md:hidden">
      <svg viewBox="0 0 108 103" className="absolute inset-0 size-full text-white/70">
        <ellipse cx="72" cy="30" rx="34" ry="22" transform="rotate(25 72 30)" fill="none" stroke="currentColor" strokeWidth="1" />
        <path d="M60 52 C 55 80, 30 92, 4 88" fill="none" stroke="currentColor" strokeWidth="1" />
        <path d="M10 83 L3 88 L11 92" fill="none" stroke="currentColor" strokeWidth="1" />
      </svg>
      <span className="absolute top-4 left-[51px] rotate-[25deg] font-[family-name:var(--font-caveat)] text-[17px] leading-[20.5px] whitespace-nowrap text-white/70">
        {text}
      </span>
    </div>
  );
}

export function Pricing() {
  const [currency, setCurrency] = useState<Currency>("uzs");

  return (
    <section id="pricing" className="relative flex flex-col items-center overflow-hidden pt-[200px]">
      <Noise />
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 hidden md:block">
        <span className="absolute inset-y-0 left-[calc(50%-365px)] w-px bg-line" />
        <span className="absolute inset-y-0 left-1/2 w-px bg-line" />
        <span className="absolute inset-y-0 left-[calc(50%+365px)] w-px bg-line" />
      </div>

      {/* Header row */}
      <div className="relative z-[2] grid w-full gap-5 border-t border-line px-5 md:w-full md:max-w-[1100px] md:grid-cols-2 md:px-0">
        <Cross className="top-0 left-0" />
        <Cross className="top-0 left-full" />
        <div className="flex flex-col gap-5 pt-[30px] pr-2.5 md:pl-[30px]">
          <Tag>{pricing.tag}</Tag>
          <Reveal as="h2" className="max-w-[520px] font-display text-[clamp(38px,4.2vw,60px)] leading-[1.02] uppercase">
            {pricing.heading}
          </Reveal>
        </div>
        <div className="flex flex-col justify-end gap-[30px] pb-[60px] md:pl-2.5">
          <p className="max-w-[220px] text-[17px] leading-[27px] font-light tracking-[0.02em]">{pricing.lead}</p>
          <div className="relative flex" role="radiogroup" aria-label="Валюта">
            {CURRENCIES.map((c) => (
              <button
                key={c.value}
                type="button"
                role="radio"
                aria-checked={currency === c.value}
                onClick={() => setCurrency(c.value)}
                className={cn(
                  "h-10 w-[94px] font-pixel text-[12px] leading-[23.5px] transition-colors duration-300",
                  currency === c.value ? "bg-white text-ink" : "bg-transparent text-white hover:bg-line",
                )}
              >
                {c.label}
              </button>
            ))}
            <DiscountNote text={pricing.currencyNote} />
          </div>
        </div>
      </div>

      {/* Plans */}
      <div className="relative z-[2] grid w-full border-t border-line px-5 md:w-full md:max-w-[1100px] md:grid-cols-2 md:px-0">
        <Cross className="top-0 left-0" />
        <Cross className="top-0 left-1/2" />
        <Cross className="top-0 left-full" />
        {pricing.plans.map((plan) => {
          const price = plan.price[currency];
          return (
            <article key={plan.name} className="flex flex-col border-line bg-ink md:border-l md:first:border-l-0">
              <div className="flex flex-col gap-[18px] p-[30px]">
                <h3 className="font-display text-[28px] leading-[1.1] uppercase md:text-[32px]">{plan.name}</h3>
                <p className="max-w-[250px] text-base leading-[25.5px] font-light tracking-[0.02em]">{plan.text}</p>
                <div className="flex items-start gap-1">
                  <span className="font-pixel text-[11px] leading-[25.5px]">{currency === "usd" ? "$" : "UZS"}</span>
                  <span className="font-display text-[34px] leading-[1.1] tabular-nums md:text-[40px] lg:text-[50px]">{formatPrice(price)}</span>
                  <span className="mt-2 ml-2.5 font-mono text-[13px] leading-5 uppercase">
                    {plan.unit[0]}
                    <br />
                    {plan.unit[1]}
                  </span>
                </div>
              </div>
              <div className="relative px-[30px]">
                <BarButton href={plan.cta.href} variant={plan.cta.variant}>
                  {plan.cta.label}
                </BarButton>
              </div>
              <ul className="flex flex-col gap-3 px-[30px] pt-[30px] pb-10">
                {plan.features.map((f) => (
                  <li key={f} className="flex gap-2.5 font-mono text-[15px] leading-[24px] text-muted uppercase">
                    <CheckIcon />
                    {f}
                  </li>
                ))}
              </ul>
            </article>
          );
        })}
      </div>

      {/* Banner */}
      <div className="relative z-[2] flex w-full flex-col gap-8 overflow-hidden border-y border-line bg-ink px-5 pt-[30px] pb-[50px] md:w-full md:max-w-[1100px] md:flex-row md:px-[30px]">
        <Cross className="top-0 left-0" />
        <Cross className="top-0 left-full" />
        <Cross className="top-full left-0" />
        <Cross className="top-full left-full" />
        <div aria-hidden="true" className="absolute inset-y-0 right-0 w-1/2 bg-[radial-gradient(rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:5px_5px] max-md:hidden" />
        <div className="relative flex w-full max-w-[520px] flex-col gap-[30px]">
          <div className="flex flex-col gap-5">
            <h3 className="max-w-[420px] font-display text-[32px] leading-[1.05] uppercase md:text-[42px]">{pricing.banner.heading}</h3>
            <p className="max-w-[400px] text-[17px] leading-[27px] font-light tracking-[0.02em] text-muted">{pricing.banner.text}</p>
          </div>
          <KeyButton href={pricing.banner.cta.href}>{pricing.banner.cta.label}</KeyButton>
        </div>
        <Placeholder label="Иллюстрация 300×350" tone="dark" className="relative h-[266px] w-full md:absolute md:right-[30px] md:-top-[30px] md:h-[350px] md:w-[300px]" />
      </div>
    </section>
  );
}
