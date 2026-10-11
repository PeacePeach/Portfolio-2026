import type { Metadata } from "next";
import { TwoColumnTextTemplate } from "@/components/case-study/templates/TwoColumnTextTemplate";
import { twoColumnInteractiveExample, twoColumnTextExample } from "@/content/case-study/templateExamples";

export const metadata: Metadata = { title: "Two-column text template", robots: { index: false } };

export default function TwoColumnTextPreviewPage() {
  return <main id="main" className="cs-text-template-preview">
    <TwoColumnTextTemplate {...twoColumnTextExample} />
    <TwoColumnTextTemplate {...twoColumnInteractiveExample} />
  </main>;
}
