import { CaseStudyChapterHeader } from "../shared/CaseStudyChapterHeader";
import { NeoCoreFlows } from "./NeoCoreFlows";
import { NeoNarrative } from "./NeoNarrative";
import { neoAdvanceDeliveryPanels } from "@/content/neoAdvance";

export function NeoFinalDelivery() {
  return <section aria-labelledby="neo-final">
    <CaseStudyChapterHeader id="neo-final">04 _ FINAL DESIGN</CaseStudyChapterHeader>
    <NeoCoreFlows />
    <NeoNarrative panels={neoAdvanceDeliveryPanels} label="Delivery frameworks" still />
  </section>;
}
