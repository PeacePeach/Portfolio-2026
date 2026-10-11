import type { TwoColumnTextData } from "@/components/case-study/templates/TwoColumnTextTemplate";
import type { TellMeAboutItFeedbackData, TellMeAboutItPromptData } from "@/components/case-study/shared/tell-me-about-it/TellMeAboutIt";

const sample = {
  label: "OPTIONAL LABEL XXXXX",
  title: "Sample Headline",
  body: "Neo Advance was intended to set the pattern for future lending products, but those products were still undefined. During early concept exploration, the team was split between optimizing for launch and designing for the future, blocking decisions on entry points, account IA, and shared patterns.",
};

/** Exact specimen content from Figma 83:3445; replace copy, not layout. */
export const twoColumnTextExample = { columns: [sample, sample] } satisfies TwoColumnTextData;

/** Figma 99:39795. */
export const tellMeAboutItPromptExample = {
  variant: "prompt",
  eyebrow: "TELL ME ABOUT IT",
  title: "What would you do if you were me?",
  resolved: { label: "HOW I UNBLOCKED", title: "Sample Headline", body: sample.body },
} satisfies TellMeAboutItPromptData;

/** Figma 99:39796. */
export const tellMeAboutItFeedbackExample = {
  variant: "feedback",
  eyebrow: "TELL ME ABOUT IT",
  title: "How do you like this case study?",
  quickReplies: ["Loved it!", "Meh ...", "It’s too long"],
} satisfies TellMeAboutItFeedbackData;

/** Static text beside an interaction, same template. */
export const twoColumnInteractiveExample = {
  columns: [sample, { tellMeAboutIt: tellMeAboutItPromptExample }],
} satisfies TwoColumnTextData;
