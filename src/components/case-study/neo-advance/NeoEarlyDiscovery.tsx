import { TwoColumnTextTemplate } from "../templates/TwoColumnTextTemplate";
import { CaseStudyChapterHeader } from "../shared/CaseStudyChapterHeader";
import { NarrativeTemplate } from "../templates/NarrativeTemplate";
import { neoAdvanceEarlyDiscovery } from "@/content/case-study/neoAdvance";
import { neoAdvanceNarrative } from "@/content/neoAdvance";

export function NeoEarlyDiscovery() {
  return <section aria-labelledby="neo-discovery">
    <CaseStudyChapterHeader id="neo-discovery">01 _ EARLY DISCOVERY</CaseStudyChapterHeader>
    <TwoColumnTextTemplate {...neoAdvanceEarlyDiscovery} />
    <NarrativeTemplate label="Lending platform research and frameworks" steps={neoAdvanceNarrative} />
  </section>;
}
