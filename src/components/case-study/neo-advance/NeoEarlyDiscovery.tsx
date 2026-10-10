import { TwoColumnTextTemplate } from "../templates/TwoColumnTextTemplate";
import { CaseStudyChapterHeader } from "../shared/CaseStudyChapterHeader";
import { neoAdvanceEarlyDiscovery } from "@/content/case-study/neoAdvance";

export function NeoEarlyDiscovery() {
  return <section aria-labelledby="neo-discovery" className="mt-(--spacing-section)">
    <CaseStudyChapterHeader id="neo-discovery">01 _ EARLY DISCOVERY</CaseStudyChapterHeader>
    <TwoColumnTextTemplate {...neoAdvanceEarlyDiscovery} />
  </section>;
}
