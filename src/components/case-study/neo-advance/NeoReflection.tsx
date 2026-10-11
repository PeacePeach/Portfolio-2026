import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { neoAdvanceReflection as reflection } from "@/content/neoAdvance";
import { neoAdvanceClosing } from "@/content/case-study/neoAdvance";
import { TwoColumnTextTemplate } from "../templates/TwoColumnTextTemplate";
import { CaseStudyChapterHeader } from "../shared/CaseStudyChapterHeader";
import { caseStudyTokens, caseStudyType } from "../shared/caseStudyTokens";

/** Figma 89:5173: reflection quote, then feedback and the next case study. */
export function NeoReflection() {
  return <section aria-labelledby="neo-reflection">
    <CaseStudyChapterHeader id="neo-reflection">05 _ REFLECTION</CaseStudyChapterHeader>
    <section aria-label="Reflection" style={caseStudyTokens} className="cs-rules cs-section">
      {/* Figma 99:38841: 4px rounded bar (#357dfb → 20%), 16px to the quote, 33px to the body. */}
      <ScrollReveal className="mx-auto flex max-w-[500px] flex-col gap-[33px]">
        <blockquote className={`${caseStudyType.storyTitle} flex gap-4 text-(--cs-primary)`}>
          <span aria-hidden className="w-1 shrink-0 rounded-full bg-linear-to-b from-[#357dfb] to-[rgb(53_125_251/0.2)]" />
          <span>{reflection.quote}</span>
        </blockquote>
        <p className={`${caseStudyType.storyBody} cs-story-text-body`}>{reflection.body}</p>
      </ScrollReveal>
    </section>
    <TwoColumnTextTemplate {...neoAdvanceClosing} />
  </section>;
}
