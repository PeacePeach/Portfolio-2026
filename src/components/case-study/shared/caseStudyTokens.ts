import type { CSSProperties } from "react";
import { radius } from "@/design-system/tokens/radius";

/**
 * Case-study layout and Figma-specific visual exceptions.
 * Reuse global radius and spacing tokens wherever values match exactly.
 * The neutral/status colors below have no equivalent in the global palette;
 * aliasing primary/secondary would change the standalone template previews.
 */
export const caseStudyTokens: CSSProperties & Record<`--cs-${string}`, string> = {
  "--cs-panel-width": "1174px",
  "--cs-panel-min-height": "1066px",
  // No exact shared border token. Keep RGB alpha: color-mix changed corner pixels.
  "--cs-border": "1px solid rgb(255 255 255 / 10%)",
  "--cs-radius": radius.surface,
  "--cs-primary": "#f5f5f5",
  "--cs-secondary": "#a3a3a3",
  "--cs-bullet-text": "#f9f9f9",
  "--cs-positive": "#65c466",
  "--cs-negative": "#e1747a",
  "--cs-tabs-background": "#1d1d1d",
  "--cs-tab-selected-fill": "#2a2a2a",
  "--cs-tabs-height": "83px",
  "--cs-tab-height": "34px",
  "--cs-tab-radius": radius.control,
  "--cs-tab-gap": "calc(var(--spacing) * 1.5)",
  "--cs-tab-padding": "calc(var(--spacing) * 8)",
  "--cs-content-top": "calc(var(--spacing) * 16)",
  "--cs-title-description-gap": "calc(var(--spacing) * 3)",
  "--cs-header-evidence-gap": "calc(var(--spacing) * 16)",
  "--cs-column-gap": "calc(var(--spacing) * 12)",
  "--cs-evidence-gap": "calc(var(--spacing) * 6)",
  "--cs-final-evidence-gap": "calc(var(--spacing) * 6 - 1px)",
  "--cs-bullet-gap": "calc(var(--spacing) * 3)",
  "--cs-icon-gap": "calc(var(--spacing) * 2)",
  "--cs-icon-size": "calc(var(--spacing) * 4)",
  "--cs-icon-padding": "calc(var(--spacing) * 0.75)",
  "--cs-image-width": "202px",
  "--cs-pair-image-width": "var(--cs-image-width)",
  "--cs-image-pair-gap": "calc(var(--spacing) * 4)",
  "--cs-group-bullet-gap": "calc(var(--spacing) * 2)",
  "--cs-pill-padding-x": "calc(var(--spacing) * 2.5)",
  "--cs-pill-padding-y": "var(--spacing)",
  // No global pill-radius variable; retain the existing fully rounded treatment.
  "--cs-pill-radius": "999px",
  "--cs-small-line-height": "1.4",
  "--cs-text-column-width": "400px",
  "--cs-text-column-gap": "calc(var(--spacing) * 24)",
  "--cs-text-section-padding": "calc(var(--spacing) * 24)",
  "--cs-story-body-gap": "calc(var(--spacing) * 4)",
  // Existing global display roles are responsive/semibold, not fixed 32px regular.
  "--cs-story-title-size": "32px",
  "--cs-content-gutter": "calc(var(--spacing) * 6)",
};

/** Semantic roles compose existing site utilities. No template owns typography. */
export const caseStudyType = {
  panelTitle: "type-heading-m cs-panel-title",
  panelDescription: "type-body-m cs-panel-description",
  evidencePill: "type-body-xs cs-small-text",
  evidenceBullet: "type-body-xs cs-small-text",
  chapterLabel: "type-body-xs cs-chapter-label",
  storyTitle: "type-display-s cs-story-title",
  storyBody: "type-body-m",
} as const;
