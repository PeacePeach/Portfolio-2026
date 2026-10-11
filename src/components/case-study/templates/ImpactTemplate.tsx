import { useId } from "react";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { CaseStudySectionHeader } from "../shared/CaseStudySectionHeader";
import { ImpactCard, type ImpactCardData } from "../shared/ImpactCard";

export type ImpactData = { title: string; subtitle?: string; cards: readonly ImpactCardData[] };

/** Figma 67:703 / 110:18653. Structure only: a 947 px block, section header over a row of impact cards. */
export function ImpactTemplate({ title, subtitle, cards, className = "" }: ImpactData & { className?: string }) {
  const titleId = useId();
  return (
    <section aria-labelledby={titleId} className={`mx-auto flex max-w-[59.1875rem] flex-col items-center gap-12 ${className}`}>
      <ScrollReveal className="w-full">
        <CaseStudySectionHeader id={titleId} title={title} description={subtitle} />
      </ScrollReveal>
      <ul className="grid w-full grid-cols-1 gap-4 md:grid-cols-3">
        {cards.map((c, i) => (
          <ScrollReveal as="li" key={c.label} delay={i * 0.12}>
            <ImpactCard {...c} />
          </ScrollReveal>
        ))}
      </ul>
    </section>
  );
}
