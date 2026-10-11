import { TwoColumnTextTemplate } from "../templates/TwoColumnTextTemplate";
import { CaseStudyChapterHeader } from "../shared/CaseStudyChapterHeader";
import { NeoNarrative } from "./NeoNarrative";
import { neoAdvanceEarlyDiscovery } from "@/content/case-study/neoAdvance";

export function NeoEarlyDiscovery() {
  return <section aria-labelledby="neo-discovery">
    <CaseStudyChapterHeader id="neo-discovery">01 _ EARLY DISCOVERY</CaseStudyChapterHeader>
    <TwoColumnTextTemplate {...neoAdvanceEarlyDiscovery} />
    <NeoNarrative />
  </section>;
}
