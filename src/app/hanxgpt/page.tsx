import type { Metadata } from "next";
import { PlaceholderPage } from "@/components/PlaceholderPage";
import { site } from "@/content/site";

export const metadata: Metadata = { title: `HanXGPT — ${site.name}` };

/** Placeholder until HanXGPT is built. */
export default function HanXGPTPage() {
  return <PlaceholderPage title="HanXGPT" note="HanXGPT to come." />;
}
