import { TwoColumnTextTemplate } from "../templates/TwoColumnTextTemplate";
import { CaseStudyChapterHeader } from "../shared/CaseStudyChapterHeader";
import { neoAdvanceValidationStory } from "@/content/case-study/neoAdvance";
import { NeoThemePanel } from "./NeoThemePanel";

export function NeoValidation() {
  return <section aria-labelledby="neo-validation" className="mt-(--spacing-section) pb-24">
    <CaseStudyChapterHeader id="neo-validation">03 _ HI-FI EXPLORATION</CaseStudyChapterHeader>
    <TwoColumnTextTemplate {...neoAdvanceValidationStory} />
    <NeoThemePanel />
  </section>;
}
