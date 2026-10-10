import { caseStudyType } from "./caseStudyTokens";

export function EvidencePill({ label, emphasis = "secondary" }: { label: string; emphasis?: "primary" | "secondary" }) {
  return <span className={`cs-pill ${caseStudyType.evidencePill}`} data-emphasis={emphasis}>{label}</span>;
}
