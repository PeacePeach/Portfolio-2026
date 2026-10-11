import type { Metadata } from "next";
import { SimpleSectionTemplate } from "@/components/case-study/templates/SimpleSectionTemplate";
import { reimaginingAnalyticsReframing } from "@/content/case-study/reimaginingAnalytics";

export const metadata: Metadata = { title: "Simple section template", robots: { index: false } };

export default function SimpleSectionPreviewPage() {
  return <main id="main" className="container-page">
    <SimpleSectionTemplate
      label="OPTIONAL LABEL"
      title="Sample Headline"
      body="Story text sits centred over any full-width content passed as children."
    >
      <div className="flex h-[25rem] items-center justify-center border border-line bg-surface type-body-m text-secondary">Container</div>
    </SimpleSectionTemplate>
    <hr className="border-line" />
    <SimpleSectionTemplate {...reimaginingAnalyticsReframing} />
  </main>;
}
