import type { Metadata } from "next";
import { ImpactTemplate } from "@/components/case-study/templates/ImpactTemplate";
import { neoAdvanceImpact } from "@/content/neoAdvance";
import { reimaginingAnalyticsImpact } from "@/content/case-study/reimaginingAnalytics";

export const metadata: Metadata = { title: "Impact template", robots: { index: false } };

export default function ImpactPreviewPage() {
  return <main id="main" className="container-page flex flex-col gap-32 py-32">
    <ImpactTemplate {...neoAdvanceImpact} />
    <ImpactTemplate {...reimaginingAnalyticsImpact} />
  </main>;
}
