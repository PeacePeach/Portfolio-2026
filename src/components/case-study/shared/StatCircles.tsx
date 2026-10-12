import { ScrollReveal } from "@/components/ui/ScrollReveal";

export type StatCircleData = { value: string; label: string };

/**
 * Mutexa "The Opportunity" (Figma Slides 187:3402): a row of headline numbers,
 * each centred in a 240px circle lit from its lower left in Figma's accent
 * blue (as `ImpactCard`'s icons) and fading into the page at its upper right.
 * Value in the Impact value style, label in Body M; circles reveal in turn
 * like Impact cards and stack below `md`.
 */
export function StatCircles({ stats }: { stats: readonly StatCircleData[] }) {
  return (
    <ul className="flex flex-col items-center gap-8 md:flex-row md:justify-center md:gap-16">
      {stats.map((s, i) => (
        <ScrollReveal as="li" key={s.label} delay={i * 0.12}>
          <div className="flex size-60 flex-col items-center justify-center rounded-full bg-[linear-gradient(55deg,rgb(45_102_244/0.75)_0%,rgb(45_102_244/0)_60%)] text-center">
            <p className="type-display-xs text-[2rem]! font-normal! text-primary">{s.value}</p>
            <p className="mt-2 type-body-m text-primary">{s.label}</p>
          </div>
        </ScrollReveal>
      ))}
    </ul>
  );
}
