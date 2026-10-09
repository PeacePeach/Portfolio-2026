/**
 * Beacon Analytics tile (Figma 41:23982, "Animation _ Brightcove insights"):
 * one Views card that holds still while its number counts up and its line
 * draws in, then fades back to empty and starts again.
 */

export const TILE = { width: 422, height: 314 } as const;

/** Seconds. */
export const beats = {
  /** Empty card before the count starts. */
  wait: 0.5,
  /** Count and line draw together. */
  draw: 2.6,
  /** Finished card. */
  hold: 2.6,
  /** Number, trend and line fade out. */
  out: 0.5,
  /** Number fades back in at 0. */
  in: 0.3,
} as const;
export const LOOP = beats.wait + beats.draw + beats.hold + beats.out + beats.in;

/** The finished card, for stills. */
export const doneAt = beats.wait + beats.draw + 0.6;
