import type { Metadata } from "next";
import { IntroTemplate } from "@/components/case-study/templates/IntroTemplate";
import { introExample, introLeftExample } from "@/content/case-study/templateExamples";

export const metadata: Metadata = { title: "Intro template", robots: { index: false } };

export default function IntroPreviewPage() {
  return <main id="main" className="container-page">
    <IntroTemplate {...introExample} />
    <IntroTemplate {...introLeftExample} />
  </main>;
}
