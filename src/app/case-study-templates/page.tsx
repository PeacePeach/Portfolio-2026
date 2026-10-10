import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Case-study templates", robots: { index: false } };

export default function CaseStudyTemplatesPage() {
  return <main id="main" className="cs-template-preview">
    <h1 className="type-display-s">Case-study templates</h1>
    <p className="mt-6 type-body-m text-secondary">Reusable layouts with shared typography, spacing and motion.</p>
    <ul className="mt-12 flex flex-col gap-6 type-body-m">
      <li><Link className="hover-underline" href="/case-study-templates/before-after">Before / After — three variations</Link></li>
      <li><Link className="hover-underline" href="/case-study-templates/two-column-text">Two-column text — optional labels, titles and body copy</Link></li>
    </ul>
  </main>;
}
