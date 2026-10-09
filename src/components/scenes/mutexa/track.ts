/**
 * Mutexa tile (Figma 34:12825, "Animation _ Mutexa"): the camera track.
 *
 * In Figma the cards sit in one group rotated -32.21° on a fixed purple
 * background, and the five frames show that group at five positions. Here
 * everything is in the group's own unrotated ("local") pixels: two columns of
 * 260 px cards, 8 px apart. The camera is the point of the composition that
 * sits at the centre of the 422 × 314 tile; the stage translates the group so
 * that point lands at the centre.
 *
 * The loop opens with the cards rising a little into frame 1 as they fade
 * in over the background, and closes by letting them drift on past frame 5
 * as they fade out, so it returns to frame 1 without rewinding.
 */

export const TILE = { width: 422, height: 314 } as const;
export const CENTER = { x: TILE.width / 2, y: TILE.height / 2 };

/** Figma rotation -32.21° (clockwise on screen). */
export const ROTATION = 32.210031984082;
const rad = (ROTATION * Math.PI) / 180;
const cos = Math.cos(rad);
const sin = Math.sin(rad);

export type CardId =
  | "planner"
  | "progress"
  | "gui"
  | "metrics"
  | "insights"
  | "efield"
  | "files";

/** Card rectangles in local pixels (from the Figma group's own axes). */
export const cards: Record<
  CardId,
  { x: number; y: number; w: number; h: number }
> = {
  planner: { x: 0, y: 0, w: 260, h: 704 },
  efield: { x: 0, y: 712, w: 260, h: 257 },
  files: { x: 0, y: 977, w: 260, h: 277 },
  progress: { x: 268, y: 0, w: 260, h: 122 },
  gui: { x: 268, y: 131, w: 260, h: 325 },
  metrics: { x: 268, y: 464, w: 260, h: 347 },
  insights: { x: 268, y: 819, w: 260, h: 527 },
};

/** Camera keyframes: the local point at the tile centre in each Figma frame (Groups 16–20). */
const keys = [
  { x: 136.0, y: 38.4 }, // 1 AI Planner
  { x: 382.2, y: 311.2 }, // 2 GUI view
  { x: 382.4, y: 690.4 }, // 3 Normalized metrics
  { x: 179.2, y: 911.8 }, // 4 Electric field
  { x: 157.2, y: 1171.5 }, // 5 Downloadable files
];
/** How far the cards travel while fading in before frame 1 and out after frame 5. */
const lead = { in: 60, out: 70 };
const path = [
  { x: keys[0].x, y: keys[0].y - lead.in },
  ...keys,
  { x: keys[4].x, y: keys[4].y + lead.out },
];

/** Seconds spent travelling into each next point (longer legs get more time). */
const legs = [0.8, 2.0, 2.0, 1.7, 1.6, 1.0];
export const LOOP = legs.reduce((a, b) => a + b, 0);

/** When the camera is centred on each Figma keyframe. */
export const keyTimes = legs
  .reduce<number[]>((acc, d, i) => [...acc, acc[i] + d], [0])
  .slice(1, keys.length + 1);

/** Card group opacity: fades in at the start of the loop and out at the end. */
export const fade = { in: 0.45, out: 0.5 };
export function trackOpacity(t: number) {
  const time = ((t % LOOP) + LOOP) % LOOP;
  return Math.min(1, time / fade.in, Math.max(0, (LOOP - time) / fade.out));
}

/**
 * Hermite blend between keyframes with a small (not zero) speed at each end:
 * the camera eases down around a focal card and carries on, never stopping.
 */
const k = 0.3;
const blend = (u: number) =>
  (u ** 3 - 2 * u ** 2 + u) * k +
  (-2 * u ** 3 + 3 * u ** 2) +
  (u ** 3 - u ** 2) * k;

export function camera(t: number) {
  let time = ((t % LOOP) + LOOP) % LOOP;
  for (let i = 0; i < legs.length; i++) {
    if (time <= legs[i] || i === legs.length - 1) {
      const e = blend(Math.min(time / legs[i], 1));
      return {
        x: path[i].x + (path[i + 1].x - path[i].x) * e,
        y: path[i].y + (path[i + 1].y - path[i].y) * e,
      };
    }
    time -= legs[i];
  }
  return path[0];
}

/** Where the group's local origin lands in the tile for a camera point. */
export function groupOffset(cam: { x: number; y: number }) {
  return {
    x: CENTER.x - (cos * cam.x - sin * cam.y),
    y: CENTER.y - (sin * cam.x + cos * cam.y),
  };
}

/* ---- Focus ---------------------------------------------------------------- */

/**
 * A card is in focus while the camera is within `zone` local px of it. The five
 * cards the camera actually centres on use 0 (the camera is over the card);
 * the two it only passes use a wider zone.
 */
const zones: Record<CardId, number> = {
  planner: 0,
  gui: 0,
  metrics: 0,
  efield: 0,
  files: 0,
  progress: 60,
  insights: 60,
};

/** Start a card's animation a little before the camera arrives. */
const LEAD = 0.15;

function distance(id: CardId, cam: { x: number; y: number }) {
  const r = cards[id];
  const dx = Math.max(r.x - cam.x, 0, cam.x - (r.x + r.w));
  const dy = Math.max(r.y - cam.y, 0, cam.y - (r.y + r.h));
  return Math.hypot(dx, dy);
}

function onScreen(id: CardId, t: number) {
  if (trackOpacity(t) === 0) return false;
  const r = cards[id];
  const cam = camera(t);
  for (let i = 0; i <= 8; i++)
    for (let j = 0; j <= 8; j++) {
      const dx = r.x + (r.w * i) / 8 - cam.x;
      const dy = r.y + (r.h * j) / 8 - cam.y;
      const x = CENTER.x + cos * dx - sin * dy;
      const y = CENTER.y + sin * dx + cos * dy;
      if (x >= -4 && x <= TILE.width + 4 && y >= -4 && y <= TILE.height + 4)
        return true;
    }
  return false;
}

const STEP = 0.01;
const wrap = (t: number) => ((t % LOOP) + LOOP) % LOOP;

/**
 * Per card: when its animation starts (`start`) and how long it may hold its
 * end state before it resets (`hold`), which happens while it is off-screen.
 */
export const schedule = Object.fromEntries(
  (Object.keys(cards) as CardId[]).map((id) => {
    const n = Math.round(LOOP / STEP);
    const inZone = (i: number) => distance(id, camera(i * STEP)) <= zones[id];
    let enter = 0;
    for (let i = 0; i < n; i++)
      if (inZone(i) && !inZone(i - 1)) enter = i * STEP;
    const start = wrap(enter - LEAD);
    // Walk back from the start to the last moment the card was off-screen.
    let hold = LOOP;
    for (let back = 0; back < LOOP; back += STEP) {
      if (!onScreen(id, start - back)) {
        hold = LOOP - back;
        break;
      }
    }
    return [id, { start, hold }];
  }),
) as Record<CardId, { start: number; hold: number }>;

/**
 * Seconds since the card's animation started, or -1 while it waits in its
 * initial state.
 */
export function phaseAt(id: CardId, t: number) {
  const { start, hold } = schedule[id];
  const since = wrap(t - start);
  return since < hold ? since : -1;
}
