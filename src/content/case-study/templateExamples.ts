import type { TwoColumnTextData } from "@/components/case-study/templates/TwoColumnTextTemplate";

const sample = {
  label: "OPTIONAL LABEL XXXXX",
  title: "Sample Headline",
  body: "Neo Advance was intended to set the pattern for future lending products, but those products were still undefined. During early concept exploration, the team was split between optimizing for launch and designing for the future, blocking decisions on entry points, account IA, and shared patterns.",
};

/** Exact specimen content from Figma 83:3445; replace copy, not layout. */
export const twoColumnTextExample = { columns: [sample, sample] } satisfies TwoColumnTextData;
