import type { Metadata } from "next";
import { PlaceholderPage } from "@/components/PlaceholderPage";
import { site } from "@/content/site";

export const metadata: Metadata = { title: `About — ${site.name}` };

export default function AboutPage() {
  return <PlaceholderPage title="About" note="About page to come." />;
}
