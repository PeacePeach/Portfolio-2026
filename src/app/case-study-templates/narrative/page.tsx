import type { Metadata } from "next";
import { NarrativeTemplate } from "@/components/case-study/templates/NarrativeTemplate";
import { neoAdvanceCoreFlows, neoAdvanceDeliveryPanels, neoAdvanceNarrative } from "@/content/neoAdvance";
import { reimaginingAnalyticsProblem } from "@/content/case-study/reimaginingAnalytics";

export const metadata: Metadata = { title: "Narrative template", robots: { index: false } };

export default function NarrativePreviewPage() {
  return <main id="main" className="container-page">
    <NarrativeTemplate label="Rolling, joined images" steps={neoAdvanceNarrative} />
    <hr className="border-line" />
    <NarrativeTemplate {...reimaginingAnalyticsProblem} />
    <hr className="border-line" />
    <NarrativeTemplate label="Rolling, plain images" steps={neoAdvanceDeliveryPanels} imageLayout="plain" />
    <hr className="border-line" />
    <NarrativeTemplate {...neoAdvanceCoreFlows} label="Rolling, staggered phone screens" />
  </main>;
}
