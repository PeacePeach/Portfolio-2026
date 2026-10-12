import type { Metadata } from "next";
import { FollowUpTemplate } from "@/components/case-study/templates/FollowUpTemplate";
import { reimaginingAnalyticsFollowUp } from "@/content/case-study/reimaginingAnalytics";

export const metadata: Metadata = { title: "Follow-up template", robots: { index: false } };

export default function FollowUpPreviewPage() {
  return <main id="main" className="container-page py-24">
    <FollowUpTemplate {...reimaginingAnalyticsFollowUp} />
  </main>;
}
