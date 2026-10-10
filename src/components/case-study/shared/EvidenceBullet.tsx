import { Check, X } from "react-feather";
import { caseStudyType } from "./caseStudyTokens";

export type EvidenceBulletData = { tone: "positive" | "negative"; text: string };

export function EvidenceBullet({ tone, text }: EvidenceBulletData) {
  const Icon = tone === "positive" ? Check : X;
  return <li className={`cs-bullet ${caseStudyType.evidenceBullet}`} data-tone={tone}>
    <Icon aria-hidden className="cs-bullet-icon" />
    <span className="sr-only">{tone === "positive" ? "Benefit: " : "Tradeoff: "}</span>
    <span>{text}</span>
  </li>;
}
