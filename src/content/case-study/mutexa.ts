import type { IntroData } from "@/components/case-study/templates/IntroTemplate";

/** Mutexa / EnzyHTP case study intro. */
export const mutexaIntro = {
  title: "Mutexa HTP",
  paragraphs: [
    "Computational chemistry tools were fragmented and difficult to use, forcing scientists to become experts in disconnected software. I led the 0→1 design of an AI-assisted research workflow that helped scientists design, run, and interpret complex experiments more efficiently.",
    "A rapid collaboration with computational scientists from Vanderbilt University.",
  ],
  facts: [
    { label: "Role", items: ["Lead designer"] },
    { label: "Duration", items: ["6 weeks"] },
    { label: "Team", items: ["4 computational chemists", "2 software engineers"] },
    { label: "Platform", items: ["Desktop web"] },
  ],
} satisfies IntroData;
