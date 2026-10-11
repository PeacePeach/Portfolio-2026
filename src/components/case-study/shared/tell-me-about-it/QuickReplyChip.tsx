import type { ComponentPropsWithoutRef } from "react";
import { caseStudyType } from "../caseStudyTokens";

/**
 * Interaction-only chip (Figma 99:39876). Shares the evidence pill's type,
 * padding and radius tokens but stays a button. Promote to the design system
 * only when another interaction needs it.
 */
export function QuickReplyChip({ selected, ...props }: ComponentPropsWithoutRef<"button"> & { selected: boolean }) {
  return <button type="button" aria-pressed={selected} className={`cs-tma-chip ${caseStudyType.evidencePill}`} {...props} />;
}
