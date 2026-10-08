import type { Metadata } from "next";
import { PlaceholderPage } from "@/components/PlaceholderPage";
import { site } from "@/content/site";

export const metadata: Metadata = { title: `Resume — ${site.name}` };

/** Replace with a link to the resume file once it is added to /public. */
export default function ResumePage() {
  return <PlaceholderPage title="Resume" note="Resume to come." />;
}
