import { KeyButton, Placeholder, Section, SectionHead } from "../shared/primitives";
import { team } from "./content";

/** The team: a group photo beside the list of people — name, role and a line from each. */
export function Team() {
  // Hidden until the examples in content.ts are replaced with real people and a photo
  if (!team.show) return null;
  return (
    <Section id="team">
      <div className="wrap relative">
        <SectionHead title={team.heading}>
          <KeyButton href={team.cta.href}>{team.cta.label}</KeyButton>
        </SectionHead>

        <div className="grid gap-4 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] lg:gap-5">
          <Placeholder label="Фото команды 1600×1000" tone="dark" className="aspect-[16/10] w-full border border-line lg:aspect-auto lg:min-h-[520px]" />
          <ul className="grid border border-line bg-panel sm:grid-cols-2 lg:grid-cols-1">
            {team.members.map((m, i) => (
              <li key={i} className="flex flex-col justify-center gap-1.5 border-line p-6 max-sm:not-first:border-t sm:max-lg:nth-[n+3]:border-t sm:max-lg:even:border-l md:px-8 lg:not-first:border-t">
                <p className="font-pixel text-[13px] leading-[23px] uppercase">{m.name}</p>
                <p className="font-mono text-[14px] leading-[21px] text-muted">{m.role}</p>
                <p className="mt-1.5 text-[17px] leading-[1.5] text-white/85">{m.quote}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  );
}
