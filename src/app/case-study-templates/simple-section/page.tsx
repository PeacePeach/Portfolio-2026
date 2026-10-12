import type { Metadata } from "next";
import { BarChart2 } from "react-feather";
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
    <SimpleSectionTemplate
      align="left"
      heading="section"
      title="Doorway Testing"
      body="I used lightweight doorway tests to challenge high-confidence, low-evidence business ideas—validating whether users understood and valued the concept before investing in the full experience."
    >
      <div className="flex h-[25rem] items-center justify-center border border-line bg-surface type-body-m text-secondary">Container</div>
    </SimpleSectionTemplate>
    <hr className="border-line" />
    <SimpleSectionTemplate
      align="left"
      title="Custom text slot"
      text={<p className="flex items-center gap-3 type-heading-m"><BarChart2 aria-hidden="true" size={20} />Any component can replace the text</p>}
    >
      <div className="flex h-[25rem] items-center justify-center border border-line bg-surface type-body-m text-secondary">Container</div>
    </SimpleSectionTemplate>
    <hr className="border-line" />
    <SimpleSectionTemplate
      layout="horizontal"
      label="OPTIONAL LABEL"
      title="Text beside one artifact, centred against it"
    >
      <div className="flex h-[23.75rem] items-center justify-center border border-line bg-surface type-body-m text-secondary">Container</div>
    </SimpleSectionTemplate>
    <hr className="border-line" />
    <SimpleSectionTemplate {...reimaginingAnalyticsReframing} />
  </main>;
}
