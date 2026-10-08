/**
 * Remembers that the next page was reached through the page slide, so it can
 * wait for the slide before revealing its content. Client-only, in memory.
 */
let slideAt = -Infinity;

export function markPageSlide() {
  slideAt = performance.now();
}

/** True while the page that just slid in is mounting (any instance, so a streamed-in tree still waits). */
export function cameBySlide(): boolean {
  return typeof performance !== "undefined" && performance.now() - slideAt < 1500;
}

/** Link props that make a navigation slide the page left (see globals.css). */
export const slideForward = { transitionTypes: ["nav-forward"] };
export const slideBack = { transitionTypes: ["nav-back"] };
