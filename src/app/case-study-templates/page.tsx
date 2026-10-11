import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Case-study templates", robots: { index: false } };

export default function CaseStudyTemplatesPage() {
  return <main id="main" className="cs-template-preview">
    <h1 className="type-display-s">Case-study templates</h1>
    <p className="mt-6 type-body-m text-secondary">Reusable layouts with shared typography, spacing and motion.</p>
    <ul className="mt-12 flex flex-col gap-6 type-body-m">
      <li><Link className="hover-underline" href="/case-study-templates/intro">Intro — title, copy and facts</Link></li>
      <li><Link className="hover-underline" href="/case-study-templates/simple-section">Simple section — story text over full-width content, or before/after</Link></li>
      <li><Link className="hover-underline" href="/case-study-templates/narrative">Narrative — text pinned beside images, rolling or static, joined, separate or plain</Link></li>
      <li><Link className="hover-underline" href="/case-study-templates/impact">Impact — section header and impact cards</Link></li>
      <li><Link className="hover-underline" href="/case-study-templates/two-column-text">Two-column text — static or Tell Me About It columns</Link></li>
      <li><Link className="hover-underline" href="/case-study-templates/tell-me-about-it">Tell Me About It — prompt and feedback variants</Link></li>
    </ul>
  </main>;
}
