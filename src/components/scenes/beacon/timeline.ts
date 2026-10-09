/**
 * Beacon tile (Figma 35:19621, "Animation _ Beacon"): one CMS screenshot that
 * starts zoomed in (Group 21) and settles to the whole screen (Group 22).
 * Both frames pin the screenshot's top-left corner at (26, 53) in the tile.
 */

export const TILE = { width: 422, height: 314 } as const;

/** The screenshot's top-left corner in the tile, in both frames. */
export const ORIGIN = { x: 26, y: 53 } as const;

/** Screenshot width in each frame; the height follows its 4096 × 2276 aspect. */
export const WIDTH = { from: 975, to: 411 } as const;
export const ASPECT = 2276 / 4096;

/** Seconds: hold on frame 1, shrink, hold on frame 2, fade back to frame 1. */
export const beats = { hold: 1.4, shrink: 2.6, rest: 2.2, back: 0.8 } as const;
export const LOOP = beats.hold + beats.shrink + beats.rest + beats.back;

/** When each Figma frame is fully on screen. */
export const frameTimes = [0, beats.hold + beats.shrink] as const;
