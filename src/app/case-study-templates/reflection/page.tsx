import type { Metadata } from "next";
import { ReflectionTemplate } from "@/components/case-study/templates/ReflectionTemplate";

export const metadata: Metadata = { title: "Reflection template", robots: { index: false } };

export default function ReflectionPreviewPage() {
  return <main id="main" className="container-page py-24">
    <ReflectionTemplate
      headline="A reflection is one sentence the reader should leave with."
      body="The body explains where that lesson came from: what the work first assumed, what changed, and what the stronger approach made possible."
    />
    <ReflectionTemplate
      accent="none"
      headline="The same reflection without the accent bar."
      body="Use accent none when the headline should stand alone."
    />
  </main>;
}
