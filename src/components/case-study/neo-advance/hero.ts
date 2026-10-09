/**
 * Neo Advance case study hero (Figma 51:24883, "Group 21"): a flat blue band,
 * 1280 × 485 at 1280 wide, under the nav, with twelve product screens tilted
 * 20.26° and cropped by the band. Positions are Figma's, in band pixels from
 * the band's top-left; each screen turns about its own top-left corner.
 */

export const HERO = { width: 1280, height: 485, blue: "#2e54d8" } as const;

/** Below this the band stops shrinking (360 px tall) and crops its sides instead. */
export const HERO_MIN_UNIT = 360 / HERO.height;

/** Figma's drop shadow on every screen, in band pixels. */
export const SCREEN_SHADOW = { y: 8, blur: 15, alpha: 0.25 } as const;

const tilt = "matrix(0.9381, 0.34635, -0.34635, 0.9381, 0, 0)";
const tiltWide = "matrix(0.93848, 0.34532, -0.34738, 0.93772, 0, 0)";

export type HeroScreen = {
  id: string;
  src: string;
  alt: string;
  x: number;
  y: number;
  w: number;
  h: number;
  transform: string;
};

const dir = "/case-studies/neo-advance";

/**
 * The screen the Work tile's sheet turns into. The tile shows its sheet from
 * 53 px below the screen's top (the close button and status area sit above).
 */
export const PRIMARY: HeroScreen = {
  id: "interstitial",
  src: `${dir}/interstitial.webp`,
  alt: "Neo Advance will cover you: the transfer screen",
  x: 654.2,
  y: 285.65,
  w: 217,
  h: 382,
  transform: tilt,
};

/** Primary screen in phone pixels (the tile's CoverSheet is 375 wide), and the sheet's offset in it. */
export const PRIMARY_PHONE = { width: 375, height: 660, sheetTop: 53, sheetRadius: 15 } as const;

/** The other eleven screens, in Figma's layer order. */
export const SECONDARY: HeroScreen[] = [
  { id: "hub-tasks", src: `${dir}/hub-tasks.webp`, alt: "", x: 844, y: -228.43, w: 217, h: 508, transform: tilt },
  { id: "hub", src: `${dir}/hub.webp`, alt: "", x: 1154.71, y: -327.97, w: 217, h: 509, transform: tilt },
  { id: "chequing", src: `${dir}/chequing.webp`, alt: "", x: 964.56, y: 187.04, w: 217, h: 508, transform: tilt },
  { id: "lcm-daily-1", src: `${dir}/lcm-daily.webp`, alt: "", x: 672.53, y: -506, w: 217, h: 509, transform: tilt },
  { id: "lcm-daily-2", src: `${dir}/lcm-daily.webp`, alt: "", x: -7.22, y: -147, w: 217, h: 509, transform: tilt },
  { id: "feature-info", src: `${dir}/feature-info.webp`, alt: "", x: 482.38, y: 9.02, w: 217, h: 599, transform: tilt },
  {
    id: "unlock-1",
    src: `${dir}/unlock-increase.webp`,
    alt: "",
    x: 261.65,
    y: 608.47,
    w: 217.65,
    h: 509.21,
    transform: tiltWide,
  },
  {
    id: "unlock-2",
    src: `${dir}/unlock-increase.webp`,
    alt: "",
    x: 1279.37,
    y: 74,
    w: 217.65,
    h: 509.21,
    transform: tiltWide,
  },
  { id: "daily-tab", src: `${dir}/daily-tab.webp`, alt: "", x: 367.7, y: -422.4, w: 217, h: 508, transform: tilt },
  {
    id: "unlock-3",
    src: `${dir}/unlock-increase.webp`,
    alt: "",
    x: 95.37,
    y: 317.76,
    w: 217.65,
    h: 509.21,
    transform: tiltWide,
  },
  { id: "available", src: `${dir}/available-sheet.webp`, alt: "", x: 177.9, y: 91.68, w: 217, h: 201, transform: tilt },
];

/** Unique image files, for preloading before the transition. */
export const HERO_IMAGES = [...new Set([PRIMARY, ...SECONDARY].map((s) => s.src))];

/** Where the screen's visible centre sits in the band (its rotated centre, clamped into the band). */
function centre(s: HeroScreen) {
  const [a, b, c, d] = s.transform.match(/-?[\d.]+/g)!.map(Number);
  const cx = s.x + a * (s.w / 2) + c * (s.h / 2);
  const cy = s.y + b * (s.w / 2) + d * (s.h / 2);
  return { x: cx, y: Math.min(Math.max(cy, 0), HERO.height) };
}

/**
 * Entrance order for the secondary screens: rings outward from the primary,
 * so they surface around it rather than arriving from different directions.
 */
export const RINGS = 4;
const p = centre(PRIMARY);
const byDistance = SECONDARY.map((s) => {
  const q = centre(s);
  return { id: s.id, d: Math.hypot(q.x - p.x, q.y - p.y) };
}).sort((m, n) => m.d - n.d);
export const ring: Record<string, number> = Object.fromEntries(
  byDistance.map((s, i) => [s.id, Math.floor((i * RINGS) / byDistance.length)]),
);
