import type { TwoColumnTextData } from "@/components/case-study/templates/TwoColumnTextTemplate";

/** Early discovery: the stuck point, then a Tell Me About It prompt that reveals how it was unblocked. */
export const neoAdvanceEarlyDiscovery = {
  columns: [
    {
      label: "WHERE WE WERE STUCK",
      title: "The Chicken-and-Egg Problem",
      body: "Neo Advance was intended to set the pattern for future lending products, but those products were still undefined. During early concept exploration, the team was split between optimizing for launch and designing for the future, blocking decisions on entry points, account IA, and shared patterns.",
    },
    {
      tellMeAboutIt: {
        variant: "prompt",
        eyebrow: "TELL ME ABOUT IT",
        title: "What would you do if you were me?",
        resolved: {
          label: "HOW I UNBLOCKED",
          title: "Defined the Lending Platform Template",
          body: "In 2 days, I benchmarked Neo Advance alongside future lending products—term loans, HELOCs, and mortgages—to identify the common platform patterns they would all need. I then translated those patterns into a reusable template for Neo Advance, aligning 3 product leads and 2 founders on account IA, entry points, and core lending experiences.",
        },
      },
    },
  ],
} satisfies TwoColumnTextData;
