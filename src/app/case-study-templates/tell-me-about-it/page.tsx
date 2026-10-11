import type { Metadata } from "next";
import { TellMeAboutIt } from "@/components/case-study/shared/tell-me-about-it/TellMeAboutIt";
import { tellMeAboutItFeedbackExample, tellMeAboutItPromptExample } from "@/content/case-study/templateExamples";

export const metadata: Metadata = { title: "Tell Me About It", robots: { index: false } };

/** Both variants at their Figma width (400px); the page, not the component, sets it. */
export default function TellMeAboutItPreviewPage() {
  return <main id="main" className="cs-template-preview">
    <div className="grid grid-cols-[repeat(auto-fit,minmax(0,400px))] justify-center gap-24">
      <TellMeAboutIt {...tellMeAboutItPromptExample} />
      <TellMeAboutIt {...tellMeAboutItFeedbackExample} />
    </div>
  </main>;
}
