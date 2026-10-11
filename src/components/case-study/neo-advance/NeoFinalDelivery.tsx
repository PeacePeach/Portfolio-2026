import { CaseStudyChapterHeader } from "../shared/CaseStudyChapterHeader";
import { NeoCoreFlows } from "./NeoCoreFlows";
import { NarrativeTemplate } from "../templates/NarrativeTemplate";
import { neoAdvanceDeliveryPanels } from "@/content/neoAdvance";

export function NeoFinalDelivery() {
  return <section aria-labelledby="neo-final">
    <CaseStudyChapterHeader id="neo-final">04 _ FINAL DESIGN</CaseStudyChapterHeader>
    <NeoCoreFlows />
    <NarrativeTemplate label="Delivery frameworks" steps={neoAdvanceDeliveryPanels} imageLayout="plain" />
  </section>;
}
