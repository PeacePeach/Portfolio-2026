import { TwoColumnTextTemplate } from "../templates/TwoColumnTextTemplate";
import { CaseStudyChapterHeader } from "../shared/CaseStudyChapterHeader";
import { NeoThemePanel } from "./NeoThemePanel";
import { neoAdvanceHiFiExploration } from "@/content/case-study/neoAdvance";

export function NeoHiFiExploration() {
  return <section aria-labelledby="neo-hifi">
    <CaseStudyChapterHeader id="neo-hifi">03 _ HI-FI EXPLORATION</CaseStudyChapterHeader>
    <TwoColumnTextTemplate {...neoAdvanceHiFiExploration} />
    <NeoThemePanel />
  </section>;
}
