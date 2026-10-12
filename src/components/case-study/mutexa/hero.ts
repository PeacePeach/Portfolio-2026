/**
 * Mutexa case study hero (Figma AI-Portfolio 174:2841): ten Mutexa cards
 * ("Group 636494"), each turned 18.62° anticlockwise about its own centre
 * and cropped by a 1280 × 595 band in Figma's purple. Card centres and
 * sizes are Figma's, in band pixels.
 */

export const MUTEXA_HERO = { width: 1280, height: 595, background: "#5f67f6" } as const;

/** Below this the band stops shrinking (360 px tall) and crops its sides instead, as Neo's does. */
export const MUTEXA_HERO_MIN_UNIT = 360 / MUTEXA_HERO.height;

export const TILT = -18.62;
export const CARD_RADIUS = 8;

export type MutexaCard = {
  id: string;
  src: string;
  alt: string;
  /** centre and unturned size, in band pixels */
  cx: number;
  cy: number;
  w: number;
  h: number;
  /** Figma rounds these frames itself; the other images carry their own corners */
  rounded?: boolean;
  /** Figma's 8 px white frame */
  framed?: boolean;
};

const dir = "/case-studies/mutexa/hero";
/** A card from Figma's bounding box (left, top, width, height) and its unturned size. */
const at = (
  id: string,
  file: string,
  box: [number, number, number, number],
  w: number,
  h: number,
  extra: Partial<MutexaCard> = {},
): MutexaCard => ({
  id,
  src: `${dir}/${file}.webp`,
  alt: "",
  cx: box[0] + box[2] / 2,
  cy: box[1] + box[3] / 2,
  w,
  h,
  ...extra,
});

/** The card the Work tile's Electric Field card turns into. */
export const MUTEXA_PRIMARY = at("electric-field", "electric-field", [526.978, -31.6, 517.141, 497.66], 416, 385, {
  rounded: true,
  alt: "Mutexa cards laid out at an angle: an AI planner, a molecular viewer, normalized metrics, the electric field, insights and workflow steps",
});

/** Back to front, as Figma stacks them, all above the primary. */
export const SECONDARY: MutexaCard[] = [
  at("files", "files", [85.424, 532.68, 489.007, 404.17], 420, 285),
  at("metrics", "metrics", [-4.6, 211.49, 645.014, 445.802], 589, 272),
  at("insights-a", "insights", [779.045, -619, 571.372, 648.669], 420, 543),
  at("insights-b", "insights", [569, 617.98, 571.372, 648.669], 420, 543),
  at("residue-a", "residue-modeling", [492.923, 437.55, 307.408, 194.291], 288, 108),
  at("residue-b", "residue-modeling", [813, 454.24, 307.408, 194.291], 288, 108),
  at("loop", "loop-refinement", [775.329, 342.41, 307.408, 194.291], 288, 108, { rounded: true }),
  at("structure", "structure-optimization", [530.594, 549.37, 307.408, 194.291], 288, 108),
  at("gap-detection", "gap-detection", [956, -52, 460.955, 647.598], 289, 586, { rounded: true, framed: true }),
  at("planner", "planner", [-192, -344.79, 742.383, 734.842], 589, 577),
  at("gui", "gui", [375.656, -480.79, 542.361, 572.526], 416, 464),
];

/** Unique image files, for preloading before the transition. */
export const MUTEXA_HERO_IMAGES = [...new Set([MUTEXA_PRIMARY.src, ...SECONDARY.map((c) => c.src)])];

/** Entrance order: rings outward from the primary, as on Neo Advance and Brightcove Beacon. */
export const RINGS = 4;
const byDistance = SECONDARY.map((c) => ({ id: c.id, d: Math.hypot(c.cx - MUTEXA_PRIMARY.cx, c.cy - MUTEXA_PRIMARY.cy) })).sort(
  (m, n) => m.d - n.d,
);
export const ring: Record<string, number> = Object.fromEntries(
  byDistance.map((c, i) => [c.id, Math.floor((i * RINGS) / byDistance.length)]),
);
