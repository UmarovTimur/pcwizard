"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { BarButton, KeyButton, Noise, SectionHead } from "../shared/primitives";
import { CircuitTraces } from "../shared/CircuitTraces";
import { pricing } from "./content";

type Currency = "uzs" | "usd";

const CURRENCIES: { value: Currency; label: string }[] = [
  { value: "uzs", label: "Сум" },
  { value: "usd", label: "USD" },
];

const formatPrice = (value: number) => new Intl.NumberFormat("ru-RU").format(value);

function CheckIcon() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" className="mt-[5px] size-4 shrink-0 text-violet">
      <circle cx="8" cy="8" r="7" fill="none" stroke="currentColor" strokeWidth="1" />
      <path d="M5 8.2 L7.1 10.2 L11 6" fill="none" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}

/** Service prices: two plans side by side with a сум / USD switch, then a "not sure what to pick" strip. */
export function Pricing() {
  const [currency, setCurrency] = useState<Currency>("uzs");

  return (
    <section id="pricing" className="relative overflow-hidden border-t border-line pt-[230px] pb-[clamp(72px,8vw,128px)]">
      <Noise />
      {/* Circuit traces with current running along them, above the heading */}
      <CircuitTraces className="top-0" />

      <div className="wrap relative">
        <SectionHead title={pricing.heading} lead={pricing.lead}>
          <div className="flex border border-line bg-panel" role="radiogroup" aria-label="Валюта">
            {CURRENCIES.map((c) => (
              <button
                key={c.value}
                type="button"
                role="radio"
                aria-checked={currency === c.value}
                onClick={() => setCurrency(c.value)}
                className={cn(
                  "h-11 w-[100px] cursor-pointer font-pixel text-[12px] leading-[23.5px] transition-colors duration-300",
                  currency === c.value ? "bg-white text-ink" : "text-white hover:bg-line",
                )}
              >
                {c.label}
              </button>
            ))}
          </div>
        </SectionHead>

        <div className="grid gap-4 lg:grid-cols-2 lg:gap-5">
          {pricing.plans.map((plan) => (
            <article
              key={plan.name}
              className={cn("flex flex-col border bg-panel p-6 md:p-10", plan.featured ? "border-violet/60 shadow-[0_0_44px_rgba(168,85,247,0.16)]" : "border-line")}
            >
              <h3 className="font-display text-[28px] leading-[1.1] uppercase md:text-[34px]">{plan.name}</h3>
              <p className="mt-3 max-w-[38ch] text-[18px] leading-[1.5] text-white/75">{plan.text}</p>
              <p className="mt-6 flex flex-wrap items-baseline gap-x-4 gap-y-1">
                <span className="font-pixel text-[20px] leading-[1.6] whitespace-nowrap text-[#4ade80] [text-shadow:0_0_10px_rgba(74,222,128,0.5)] md:text-[26px]">
                  от {formatPrice(plan.price[currency])} {currency === "usd" ? "$" : "сум"}
                </span>
                <span className="font-mono text-[15px] text-muted">{plan.unit}</span>
              </p>
              <ul className="mt-7 mb-8 grid gap-x-8 gap-y-3 border-t border-line pt-7 sm:grid-cols-2 lg:max-xl:grid-cols-1">
                {plan.features.map((f) => (
                  <li key={f} className="flex gap-3 text-[17px] leading-[1.45] text-white/85">
                    <CheckIcon />
                    {f}
                  </li>
                ))}
              </ul>
              {/* data-service preselects the service in the request popup */}
              <div className="relative mt-auto" data-service={plan.service}>
                <BarButton href={plan.cta.href} variant={plan.featured ? "gradient" : "dots"}>
                  {plan.cta.label}
                </BarButton>
              </div>
            </article>
          ))}
        </div>

        {/* Help strip */}
        <div className="relative mt-4 flex flex-col gap-6 overflow-hidden border border-line bg-panel p-6 md:p-10 lg:mt-5 lg:flex-row lg:items-center lg:justify-between lg:gap-12">
          <div aria-hidden="true" className="absolute inset-y-0 right-0 w-1/2 bg-[radial-gradient(rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:5px_5px] [mask-image:linear-gradient(90deg,transparent,#000)] max-lg:hidden" />
          <div className="relative">
            <h3 className="font-display text-[28px] leading-[1.1] uppercase md:text-[34px]">{pricing.banner.heading}</h3>
            <p className="mt-3 max-w-[62ch] text-[18px] leading-[1.5] text-white/75">{pricing.banner.text}</p>
          </div>
          <KeyButton href={pricing.banner.cta.href} className="relative shrink-0">
            {pricing.banner.cta.label}
          </KeyButton>
        </div>
      </div>
    </section>
  );
}
