import { Marquee } from "./motion";

/** Full-bleed marquee of a single giant display word (section intros). `heading` overrides the hidden h2 text. */
export function BigMarquee({ text, heading, duration = 20 }: { text: string; heading?: string; duration?: number }) {
  return (
    <div className="relative w-full">
      <h2 className="sr-only">{heading ?? text}</h2>
      <Marquee duration={duration} gap={100} className="w-full">
        {[0, 1].map((i) => (
          <span
            key={i}
            aria-hidden="true"
            className="font-pixel text-[clamp(56px,8.4vw,120px)] leading-[1.65] whitespace-nowrap text-white [text-shadow:0_0_18px_rgba(168,85,247,0.55),0_0_42px_rgba(217,70,239,0.25)]"
          >
            {text}
          </span>
        ))}
      </Marquee>
    </div>
  );
}
