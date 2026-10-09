/** Neo Advance tile (Figma 31:6146): size, frames and Neo design tokens, shared by the static frames and the loop. */

export const NEO_TILE = { width: 422, height: 314 } as const;

export type NeoFrame = "cover" | "continue" | "unlocked" | "limit-75" | "limit-200";

export const neoFrames: { id: NeoFrame; figma: string; label: string }[] = [
  { id: "cover", figma: "31:6485", label: "Cover sheet" },
  { id: "continue", figma: "31:6567", label: "Sheet scrolled to Continue" },
  { id: "unlocked", figma: "31:11841", label: "Higher limit unlocked" },
  { id: "limit-75", figma: "31:11648", label: "Current limit $75" },
  { id: "limit-200", figma: "31:11818", label: "Current limit $200" },
];

/** Neo design tokens used by the scene. */
export const neo = {
  bg: "#f1f3f3", // structure/backgroundDefault
  surface: "#ffffff", // structure/surfaceDefault
  track: "#e7e8e9", // structure/surfaceStrong
  border: "#e1e4e5", // content/borderDefault
  ink: "#111111", // content/contentDefault
  subdued: "#697780", // content/contentSubdued
  info: "#006eff", // content/contentInfo
  tile: "linear-gradient(-42.32deg, #2d53d8 37.188%, #66a8ff 97.31%)", // Gradients/Blue
  fill: "linear-gradient(168.65deg, #66a8ff 18.975%, #006eff 80.45%)", // progress fill
  sheetShadow:
    "0 7px 8px -4px rgba(5,28,44,0.06), 0 3px 23px 6px rgba(5,28,44,0.04), 0 12px 17px 2px rgba(5,28,44,0.03)", // shadowXL
  groupShadow: "drop-shadow(0 4px 20px rgba(0,0,0,0.2))",
} as const;
