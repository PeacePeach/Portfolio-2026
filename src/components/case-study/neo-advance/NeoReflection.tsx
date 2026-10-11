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
      <ScrollReveal className="cs-story-text mx-auto max-w-[500px]">
        <blockquote className={`${caseStudyType.storyTitle} border-l-4 border-(--cs-secondary) pl-4 text-(--cs-bullet-text)`}>{reflection.quote}</blockquote>
        <p className={`${caseStudyType.storyBody} cs-story-text-body`}>{reflection.body}</p>
      </ScrollReveal>
    </section>
    <TwoColumnTextTemplate {...neoAdvanceClosing} />
  </section>;
}
