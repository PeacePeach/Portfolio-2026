import { TwoColumnTextTemplate } from "../templates/TwoColumnTextTemplate";
import { CaseStudyChapterHeader } from "../shared/CaseStudyChapterHeader";
import { NeoJourneyMap } from "./NeoJourneyMap";
import { neoAdvanceConceptExploration } from "@/content/case-study/neoAdvance";

export function NeoConceptExploration() {
  return <section aria-labelledby="neo-concept">
    <CaseStudyChapterHeader id="neo-concept">02 _ CONCEPT EXPLORATION</CaseStudyChapterHeader>
    <TwoColumnTextTemplate {...neoAdvanceConceptExploration} />
    <NeoJourneyMap />
  </section>;
}
