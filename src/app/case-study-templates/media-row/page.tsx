import type { Metadata } from "next";
import { MediaRowTemplate } from "@/components/case-study/templates/MediaRowTemplate";
import { neoAdvanceHow } from "@/content/neoAdvance";

export const metadata: Metadata = { title: "Media row template", robots: { index: false } };

export default function MediaRowPreviewPage() {
  return <main id="main" className="container-page py-24">
    <MediaRowTemplate {...neoAdvanceHow} />
  </main>;
}
