import type { Metadata } from "next";
import { StoryTextBlock } from "@/components/case-study/shared/StoryTextBlock";
import { caseStudyTokens } from "@/components/case-study/shared/caseStudyTokens";

export const metadata: Metadata = { title: "Story text block", robots: { index: false } };

const body = "I audited the existing Analytics UI and found 17 different design patterns solving overlapping problems.";

export default function StoryTextPreviewPage() {
  return <main id="main" style={caseStudyTokens} className="cs-rules cs-template-preview grid gap-24 lg:grid-cols-2">
    <div className="max-w-[400px]"><StoryTextBlock label="OPTIONAL LABEL" title="Chapter title with label" body={body} /></div>
    <div className="max-w-[400px]"><StoryTextBlock title="Chapter title" body={body} /></div>
    <StoryTextBlock heading="section" label="OPTIONAL LABEL" title="Section title with label" body={body} />
    <StoryTextBlock heading="section" title="Section title" body={body} />
  </main>;
}
