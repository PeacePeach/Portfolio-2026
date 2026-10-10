import type { Metadata } from "next";
import { BeforeAfterPreview } from "./BeforeAfterPreview";
import { neoAdvanceTemplateExamples } from "@/content/case-study/neoAdvance";

export const metadata: Metadata = { title: "Before / After template", robots: { index: false } };

/** Unlinked specimen, like /typography. All three Figma evidence variants share the same template. */
export default function BeforeAfterPreviewPage() {
  return <main id="main" className="cs-template-preview">
    <BeforeAfterPreview examples={neoAdvanceTemplateExamples} />
  </main>;
}
