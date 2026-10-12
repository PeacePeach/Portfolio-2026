/**
 * Brightcove Beacon case study hero (Figma AI-Portfolio 174:2581): seven
 * Beacon CMS screens in three rows ("Group 336 2"), turned 28.76° and
 * cropped by a band in the Work tile's sand colour. Figma's band is
 * 1280 × 595; this one is 125 px taller, with the screens moved down by
 * the same amount, so less of the top row is cut. Screen positions are
 * the group's own layout, mapped through Figma's transform into band
 * pixels; each screen turns about its own top-left corner.
 */

import { ASPECT as TILE_ASPECT, BACKGROUND, ORIGIN as TILE_ORIGIN, WIDTH as TILE_SCREENSHOT } from "@/components/scenes/brightcove/timeline";

export const BEACON_HERO = { width: 1280, height: 720, background: BACKGROUND } as const;

/** Below this the band stops shrinking (360 px tall) and crops its sides instead, as Neo's does. */
export const BEACON_HERO_MIN_UNIT = 360 / BEACON_HERO.height;

/** Figma's group transform: its scale, its turn, and where the group's corner sits in the band. */
const GROUP = { scale: 1761.537841796875 / 2425, cos: 0.8766382336616516, sin: 0.4811501204967499, x: -515, y: 270.56 + 125 };
const k = GROUP.scale;

export const TILT = (-Math.atan2(GROUP.sin, GROUP.cos) * 180) / Math.PI;
export const SCREEN_RADIUS = 15 * k;

/**
 * Screen shadow, deeper than Figma's: a contact edge, a mid shadow and a long
 * soft one, tinted to the sand band. Offsets point straight down the page,
 * so they are turned back into each screen's own (tilted) axes.
 */
export const SHADOW_TINT = "52,36,22";
export const SHADOW_LAYERS = [
  { y: 1, blur: 2, alpha: 0.12 },
  { y: 6, blur: 14, alpha: 0.16 },
  { y: 22, blur: 44, alpha: 0.22 },
] as const;
export const screenShadow = (u: (n: number) => string) => {
  const t = (-TILT * Math.PI) / 180;
  return SHADOW_LAYERS.map(
    (l) => `${u(-Math.sin(t) * l.y)} ${u(Math.cos(t) * l.y)} ${u(l.blur)} rgba(${SHADOW_TINT},${l.alpha})`,
  ).join(", ");
};

export type BeaconScreen = {
  id: string;
  src: string;
  alt: string;
  /** top-left corner and size, in band pixels */
  x: number;
  y: number;
  w: number;
  h: number;
};

const dir = "/case-studies/brightcove-beacon/hero";
/** A screen at (gx, gy), gw × gh, in the group's own pixels. */
const at = (id: string, file: string, gx: number, gy: number, gw: number, gh: number): BeaconScreen => ({
  id,
  src: `${dir}/${file}.webp`,
  alt: "",
  x: GROUP.x + k * (GROUP.cos * gx + GROUP.sin * gy),
  y: GROUP.y + k * (-GROUP.sin * gx + GROUP.cos * gy),
  w: gw * k,
  h: gh * k,
});

/**
 * The screen the Work tile's screenshot turns into: the Xstream.ly page
 * type editor, the same layout as the TV Series page the tile zooms out
 * of. The hero shows it cropped (Figma's image crop, the same as the
 * tile's); the tile shows the whole screenshot.
 */
export const BEACON_PRIMARY = {
  ...at("page-type", "page-type", 1429, 416, 705.003, 377.177),
  alt: "Beacon CMS screens laid out at an angle: the welcome page, a page type editor, series and movie libraries and a monetization modal",
};

/** The tile's whole screenshot and the primary's, and where the hero's crop sits in them (fractions of the screenshot). */
export const PRIMARY_FULL = {
  from: "/scenes/brightcove/cms.webp",
  to: `${dir}/page-type-full.webp`,
  crop: { left: 0.0577211, top: 0.0929535 },
  width: BEACON_PRIMARY.w / 0.9420291,
  height: BEACON_PRIMARY.h / 0.9070465,
} as const;

/** The tile's screenshot when it rests on its whole-screen frame, in tile pixels. */
export const TILE_SHOT = { left: TILE_ORIGIN.x, top: TILE_ORIGIN.y, width: TILE_SCREENSHOT.to, height: TILE_SCREENSHOT.to * TILE_ASPECT } as const;

/** Rows from back to front, as Figma stacks them; the primary sits in the middle row. */
export const SECONDARY: BeaconScreen[] = [
  at("series-a", "series", 500, 10, 552.84, 381.227),
  at("player", "player", 1077, 10, 520.527, 381.289),
  at("series-b", "series", 1621, 10, 552.84, 381.227),
  at("monetization-modal", "monetization-modal", 1185, 816, 531, 311.133),
  at("movies", "movies", 1740, 816, 665, 460.768),
  at("home", "home", 729, 416, 675.509, 374.935),
];

/** Unique image files, for preloading before the transition. */
export const BEACON_HERO_IMAGES = [...new Set([PRIMARY_FULL.from, PRIMARY_FULL.to, BEACON_PRIMARY.src, ...SECONDARY.map((s) => s.src)])];

const rad = (TILT * Math.PI) / 180;
/** A screen's visible centre in the band (its turned centre). */
function centre(s: BeaconScreen) {
  const cos = Math.cos(rad);
  const sin = Math.sin(rad);
  return { x: s.x + cos * (s.w / 2) - sin * (s.h / 2), y: s.y + sin * (s.w / 2) + cos * (s.h / 2) };
}

/** Entrance order: rings outward from the primary, as on Neo Advance. */
export const RINGS = 4;
const p = centre(BEACON_PRIMARY);
const byDistance = SECONDARY.map((s) => {
  const q = centre(s);
  return { id: s.id, d: Math.hypot(q.x - p.x, q.y - p.y) };
}).sort((m, n) => m.d - n.d);
export const ring: Record<string, number> = Object.fromEntries(
  byDistance.map((s, i) => [s.id, Math.floor((i * RINGS) / byDistance.length)]),
);
