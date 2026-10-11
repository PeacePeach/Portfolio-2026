import { caseStudyType } from "./caseStudyTokens";

export type EvidenceBulletData = { tone: "positive" | "negative"; text: string };

// 16px marks on a 16-unit grid, optically centred (Figma check-circle / x-circle).
const marks = { positive: "M4.75 8.25l2.25 2.25 4.25-4.5", negative: "M5.25 5.25l5.5 5.5M10.75 5.25l-5.5 5.5" } as const;

/** The one evidence icon: semantic-colour circle (CSS color), white mark (CSS stroke on the path only). */
function EvidenceIcon({ tone }: { tone: EvidenceBulletData["tone"] }) {
  return <svg aria-hidden viewBox="0 0 16 16" fill="none" className="cs-bullet-icon">
    <circle cx="8" cy="8" r="8" fill="currentColor" />
    <path d={marks[tone]} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>;
}

export function EvidenceBullet({ tone, text }: EvidenceBulletData) {
  return <li className={`cs-bullet ${caseStudyType.evidenceBullet}`} data-tone={tone}>
    <EvidenceIcon tone={tone} />
    <span className="sr-only">{tone === "positive" ? "Benefit: " : "Tradeoff: "}</span>
    <span>{text}</span>
  </li>;
}
