/**
 * Remembers that the next page was reached through the page slide, so it can
 * wait for the slide before revealing its content. Client-only, in memory.
 */
let slideIn = false;

export function markPageSlide() {
  slideIn = true;
}

export function consumePageSlide(): boolean {
  const value = slideIn;
  slideIn = false;
  return value;
}

/** Link props that make a navigation slide the page left (see globals.css). */
export const slideForward = { transitionTypes: ["nav-forward"] };
export const slideBack = { transitionTypes: ["nav-back"] };
