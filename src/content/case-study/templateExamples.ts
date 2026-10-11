import type { IntroData } from "@/components/case-study/templates/IntroTemplate";
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

/** Exact specimen content from Figma 83:3038; replace copy, not layout. */
export const introExample = {
  title: "Project Title",
  paragraphs: [
    "Neo Advance sat between overdraft, cash advance, and credit building — without an established product model for any of them to follow.",
    "I led the experience from early ambiguity through launch, defining how the product should work across banking, lending, lifecycle, and collections while guiding a two-designer team through the highest-risk decisions.",
    "The result was a system customers could understand, teams could build against, and the business could evolve over time.",
  ],
  facts: [
    { label: "Duration", items: ["XXXXX"] },
    { label: "Platform", items: ["XX", "XXXX", "XXX"] },
    { label: "Type", items: ["XXXX", "XXXX", "XXXXXXXXXX"] },
    { label: "Role", items: ["XXXX", "XXXX", "XXXX", "XXXX", "XXXX"] },
  ],
} satisfies IntroData;
