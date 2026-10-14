import Link from "next/link";
import { cn } from "@/lib/utils";
import type { Block, FaqItem } from "../root-8a5edab2/blocks";

const LINK = /\[([^\]]+)\]\(([^)]+)\)/g;

/** Renders text with inline [label](/href) links. */
function Inline({ text }: { text: string }) {
  const parts: React.ReactNode[] = [];
  let last = 0;
  for (const m of text.matchAll(LINK)) {
    const at = m.index ?? 0;
    if (at > last) parts.push(text.slice(last, at));
    parts.push(
      <Link key={at} href={m[2]} className="text-lavender underline decoration-violet/60 underline-offset-4 transition-colors hover:text-white hover:decoration-white">
        {m[1]}
      </Link>,
    );
    last = at + m[0].length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return <>{parts}</>;
}

const text = "text-[19px] leading-[1.65] text-white/85";

/** Section heading inside an inner page: the same metal look as the home headings, one size down. */
export const innerHeading = "metal-text font-display text-[clamp(28px,3.2vw,44px)] leading-[1.05] text-balance uppercase";

function Bullet() {
  return <span aria-hidden="true" className="mt-[13px] size-[6px] shrink-0 bg-violet shadow-[0_0_8px_rgba(168,85,247,0.8)]" />;
}

/** Long-form text for landing pages and articles. */
export function Prose({ blocks, className }: { blocks: Block[]; className?: string }) {
  return (
    <div className={cn("flex flex-col gap-5", className)}>
      {blocks.map((b, i) => {
        switch (b.type) {
          case "h2":
            return (
              <h2 key={i} className={cn(innerHeading, "mt-10 first:mt-0")}>
                {b.text}
              </h2>
            );
          case "h3":
            return (
              <h3 key={i} className="mt-3 font-pixel text-[14px] leading-[25.5px] uppercase">
                {b.text}
              </h3>
            );
          case "p":
            return (
              <p key={i} className={text}>
                <Inline text={b.text} />
              </p>
            );
          case "ul":
            return (
              <ul key={i} className="flex flex-col gap-2.5">
                {b.items.map((item) => (
                  <li key={item} className={cn("flex gap-3", text)}>
                    <Bullet />
                    <span>
                      <Inline text={item} />
                    </span>
                  </li>
                ))}
              </ul>
            );
          case "ol":
            return (
              <ol key={i} className="flex flex-col gap-3">
                {b.items.map((item, n) => (
                  <li key={item} className={cn("flex gap-4", text)}>
                    <span aria-hidden="true" className="mt-[3px] w-6 shrink-0 font-pixel text-[13px] leading-6 text-violet">
                      {String(n + 1).padStart(2, "0")}
                    </span>
                    <span>
                      <Inline text={item} />
                    </span>
                  </li>
                ))}
              </ol>
            );
          case "table":
            return (
              <div key={i} className="-mx-5 overflow-x-auto px-5 md:mx-0 md:px-0">
                <table className="w-full min-w-[480px] border-collapse border border-line bg-panel text-left text-[17px] leading-[1.5]">
                  <thead>
                    <tr className="bg-white/[0.04]">
                      {b.head.map((h, c) => (
                        <th key={c} scope="col" className="border border-line px-4 py-3 font-pixel text-[11px] leading-[22px] font-normal uppercase">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {b.rows.map((row, r) => (
                      <tr key={r}>
                        {row.map((cell, c) =>
                          c === 0 ? (
                            <th key={c} scope="row" className="border border-line px-4 py-3 font-normal text-white">
                              {cell}
                            </th>
                          ) : (
                            <td key={c} className="border border-line px-4 py-3 text-white/80">
                              {cell}
                            </td>
                          ),
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          case "builds":
            return null;
          case "note":
            return (
              <p key={i} className={cn("border-l-2 border-violet bg-violet/[0.08] px-5 py-4", text)}>
                <Inline text={b.text} />
              </p>
            );
        }
      })}
    </div>
  );
}

/** Static FAQ list (native <details>), paired with FAQPage JSON-LD on the page. */
export function FaqList({ items }: { items: FaqItem[] }) {
  return (
    <div className="flex flex-col gap-2.5">
      {items.map((item) => (
        <details key={item.q} className="group border border-line bg-panel transition-colors hover:border-violet/40 open:border-violet/40">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-6 px-5 py-5 md:px-7 [&::-webkit-details-marker]:hidden">
            <h3 className="text-[19px] leading-[1.35] font-medium md:text-[21px]">{item.q}</h3>
            <span aria-hidden="true" className="relative size-6 shrink-0 transition-transform duration-300 group-open:rotate-45">
              <span className="absolute top-1/2 left-1/2 h-0.5 w-4 -translate-x-1/2 -translate-y-1/2 bg-violet" />
              <span className="absolute top-1/2 left-1/2 h-4 w-0.5 -translate-x-1/2 -translate-y-1/2 bg-violet" />
            </span>
          </summary>
          <p className="px-5 pb-6 text-[18px] leading-[1.6] text-white/75 md:px-7">{item.a}</p>
        </details>
      ))}
    </div>
  );
}
