import { ScrollReveal } from "@/components/ui/ScrollReveal";

export type StatCircleData = { value: string; label: string };

/**
 * Mutexa "The Opportunity" (Figma AI-Portfolio 176:4656): a row of headline
 * numbers, each centred in a 240px circle lit from its left in accent blue and
 * fading into the page towards its upper right, 77px apart. Value in the Impact
 * value style (Display XS), label in Body M secondary, 16px apart; circles
 * reveal in turn like Impact cards and stack below `lg`.
 */
export function StatCircles({ stats }: { stats: readonly StatCircleData[] }) {
  return (
    <ul className="flex flex-col items-center gap-8 lg:flex-row lg:justify-center lg:gap-[4.8125rem]">
      {stats.map((s, i) => (
        <ScrollReveal as="li" key={s.label} delay={i * 0.12}>
          <div className="flex size-60 flex-col items-center justify-center rounded-full bg-[linear-gradient(243deg,rgb(26_26_26/0)_33%,rgb(59_102_242)_93.5%)] text-center">
            <p className="type-display-xs text-[2rem]! font-normal! text-primary">{s.value}</p>
            <p className="mt-4 type-body-m text-secondary">{s.label}</p>
          </div>
        </ScrollReveal>
      ))}
    </ul>
  );
}
