import type { TellMeAboutItFeedbackData } from "../shared/tell-me-about-it/TellMeAboutIt";
import { TwoColumnTextTemplate } from "./TwoColumnTextTemplate";

export type FollowUpData = {
  /** Left: Tell Me About It feedback (Figma 99:39796). */
  feedback: Omit<TellMeAboutItFeedbackData, "variant">;
  /** This case study's slug. Right: Up Next picks the next case study's Work tile (Figma 99:39393). */
  current: string;
};

/**
 * Figma 99:39434 / 99:39393: the case study's closing follow-up, reader feedback
 * beside the next case study. A preset of `TwoColumnTextTemplate`, so layout,
 * spacing, reveal and responsive stacking stay shared.
 */
export function FollowUpTemplate({ feedback, current }: FollowUpData) {
  return <TwoColumnTextTemplate columns={[{ tellMeAboutIt: { variant: "feedback", ...feedback } }, { upNext: { after: current } }]} />;
}
