import type { CSSProperties } from "react";
import { radius } from "@/design-system/tokens/radius";

/**
 * Case-study layout and Figma-specific visual exceptions.
 * Reuse global radius and spacing tokens wherever values match exactly.
 * The neutral/status colors below have no equivalent in the global palette;
 * aliasing primary/secondary would change the standalone template previews.
 */
export const caseStudyTokens: CSSProperties & Record<`--cs-${string}`, string> = {
  // Figma variable "Case study / Content width / Desktop".
  "--cs-content-width-desktop": "1174px",
  "--cs-panel-min-height": "1066px",
  // No exact shared border token. Keep RGB alpha: color-mix changed corner pixels.
  "--cs-border": "1px solid rgb(255 255 255 / 10%)",
  "--cs-radius": radius.surface,
  "--cs-image-radius": "var(--cs-radius)",
  "--cs-primary": "#f5f5f5",
  "--cs-secondary": "#a3a3a3",
  "--cs-bullet-text": "#f9f9f9",
  "--cs-positive": "#65c466",
  "--cs-negative": "#e1747a",
  "--cs-tabs-background": "var(--color-surface-3)",
  "--cs-tab-selected-fill": "#2a2a2a",
  "--cs-tabs-padding": "calc(var(--spacing) * 2)",
  "--cs-tab-group-padding": "var(--spacing)",
  "--cs-tab-height": "34px",
  "--cs-tab-radius": radius.control,
  "--cs-tab-gap": "calc(var(--spacing) * 1.5)",
  "--cs-tab-padding": "calc(var(--spacing) * 8)",
  // Title to content below it: default 64px; `compact` sections use half (32px).
  "--cs-content-top": "calc(var(--spacing) * 16)",
  "--cs-content-top-compact": "calc(var(--spacing) * 8)",
  "--cs-title-description-gap": "calc(var(--spacing) * 3)",
  "--cs-header-evidence-gap": "calc(var(--spacing) * 16)",
  "--cs-column-gap": "calc(var(--spacing) * 12)",
  // Between stacked Before / After rows in one panel (Figma 116:891).
  "--cs-row-gap": "calc(var(--spacing) * 12)",
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
  // Left-aligned simple-section text (Figma 150:4909).
  "--cs-text-left-width": "561px",
  // Horizontal slides (Figma 89:5440): 696px text, 879px slides 16px apart, 337px fade over the next slide.
  "--cs-text-wide-width": "696px",
  // Inset simple section (Figma 43:215): text and content 128px in from each side of the content on desktop.
  "--cs-section-inset": "calc(var(--spacing) * 32)",
  "--cs-slide-width": "879px",
  "--cs-slide-gap": "calc(var(--spacing) * 4)",
  "--cs-slides-fade-width": "337px",
  "--cs-text-column-gap": "calc(var(--spacing) * 24)",
  // Figma 83:3259: 128px between chapters; 96px from a divider or separator to content.
  "--cs-chapter-gap": "calc(var(--spacing) * 32)",
  "--cs-section-gap": "calc(var(--spacing) * 24)",
  "--cs-story-body-gap": "calc(var(--spacing) * 4)",
  // Existing global display roles are responsive/semibold, not fixed 32px regular.
  "--cs-story-title-size": "32px",
  "--cs-content-gutter": "calc(var(--spacing) * 6)",
  // Tell Me About It (Figma 99:39795 / 99:39796). Fills and radii have no global equivalent.
  "--cs-tma-gap": "calc(var(--spacing) * 6)",
  "--cs-tma-field-fill": "rgb(255 255 255 / 2%)",
  "--cs-tma-field-radius": "15px",
  "--cs-tma-prompt-height": "120px",
  "--cs-tma-feedback-height": "275px",
  // Field insets (top right bottom left) place text, chips and actions as in Figma.
  "--cs-tma-prompt-inset": "18px 12px 11px 16px",
  "--cs-tma-feedback-inset": "14px 17px 18px 14px",
  "--cs-tma-send-size": "calc(var(--spacing) * 8)",
  "--cs-tma-send-radius": "5px",
  "--cs-tma-send-fill": "#323232",
  "--cs-tma-chip-fill": "#1e1e1e",
  "--cs-tma-toast-width": "222px",
  "--cs-tma-toast-height": "48px",
  "--cs-tma-toast-icon-size": "20px",
  "--cs-tma-success": "#42be65",
  // Reflection accent bar (Figma 99:38841): 4px, this blue fading to 20%.
  "--cs-reflection-accent": "#357dfb",
};

/** Simple section before/after and wide Before / After panels (Figma 110:18926, 116:891): 568 px desktop screenshots, 16 px apart and 16 px below their pills. */
export const caseStudyWideEvidenceTokens: Record<`--cs-${string}`, string> = {
  "--cs-image-width": "568px",
  "--cs-column-gap": "calc(var(--spacing) * 4)",
  "--cs-evidence-gap": "calc(var(--spacing) * 4)",
  "--cs-final-evidence-gap": "calc(var(--spacing) * 4)",
  // Two 568px columns fill the 1174px panel; the page already provides the side margin.
  "--cs-content-gutter": "0px",
  "--cs-image-radius": radius.image,
};

/** Semantic roles compose existing site utilities. No template owns typography. */
export const caseStudyType = {
  panelTitle: "type-heading-m cs-panel-title",
  panelDescription: "type-body-m cs-panel-description",
  evidencePill: "type-body-xs cs-small-text",
  evidenceBullet: "type-body-xs cs-small-text",
  chapterLabel: "type-body-xs cs-chapter-label",
  storyTitle: "type-display-s cs-story-title",
  sectionTitle: "type-heading-m text-(--cs-bullet-text)",
  storyBody: "type-body-m",
  quote: "type-body-m-italic",
} as const;

/** Swaps the title-to-content gap to `--cs-content-top-compact` for a `compact` section. */
export const caseStudyCompactTokens = { "--cs-content-top": "var(--cs-content-top-compact)" } as CSSProperties;
