"use client";

import { useRef } from "react";
import Image from "next/image";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { neoAdvanceFinalDelivery as groups } from "@/content/neoAdvance";
import { caseStudyTokens } from "../shared/caseStudyTokens";
import { NarrativeText, StickyNarrativeText } from "../templates/NarrativeTemplate";
import { useStickyNarrative } from "../shared/useStickyNarrative";

/**
 * Figma 94:5545: the rolling-narrative layout with mobile screens. Text stays
 * pinned while each group's screens scroll by; the second column sits 235px
 * lower, as in Figma, and runs into the next group.
 */
export function NeoCoreFlows() {
  const stack = useRef<HTMLDivElement>(null);
  const { active } = useStickyNarrative(stack);
  const group = groups[active];
  return (
    <section aria-label="Core flows" style={caseStudyTokens} className="cs-rules cs-section mx-auto w-full max-w-[1152px]">
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,320fr)_minmax(0,704fr)] lg:gap-x-32">
        <StickyNarrativeText id={group.id} title={group.title} body={group.body} />
        <div ref={stack} className="flex min-w-0 flex-col gap-12 lg:gap-10.5">
          {groups.map(group => (
            <div key={group.id} data-neo-group={group.id}>
              <ScrollReveal className="mb-6 lg:hidden">
                <NarrativeText title={group.title} body={group.body} />
              </ScrollReveal>
              <div className="flex items-start gap-4 lg:gap-8">
                {group.columns.map((column, index) => (
                  <div key={index} className={`flex w-[231px] min-w-0 shrink flex-col gap-4 lg:gap-10.5 ${index ? "lg:translate-y-[235px]" : ""}`}>
                    {column.map(screen => (
                      <ScrollReveal key={screen.src}>
                        <Image src={screen.src} alt={screen.alt} width={screen.width} height={screen.height} unoptimized className="block h-auto w-full" />
                      </ScrollReveal>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
