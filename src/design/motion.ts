/**
 * Motion tokens for Motion for React. Mirrors the --ease-* / --duration-*
 * tokens in globals.css so CSS transitions and JS animations feel the same.
 */
import type { Transition } from "motion/react";

export const ease = {
  outExpo: [0.16, 1, 0.3, 1],
  inOutQuart: [0.76, 0, 0.24, 1],
  inOutCubic: [0.65, 0, 0.35, 1],
  curtain: [0.55, 0, 0.3, 1],
  standard: [0.25, 0.1, 0.25, 1],
} as const;

export const duration = {
  fast: 0.18,
  base: 0.32,
  slow: 0.7,
  image: 1.2,
} as const;

/**
 * Opening sequence. Letter timing was measured frame by frame from a
 * recording of the reference site; the logo glide and the headline dock
 * follow Han's Figma frames (loader 1:7 → home 1:5 → docked 2:283).
 *
 *   loader   dark screen, two-line name + 0→100% counter, hold at 100%
 *   exit     every letter rolls up out of its mask, left to right; only
 *            each word's first letter rolls back in; the counter rolls out
 *   collapse the initials slide together into "HX" at the centre
 *   logo     HX glides to the top-left and shrinks into the header logo
 *   reveal   the loader background fades and the home page shows through
 *   roll     each headline line flips through a copy of itself
 *   dock     once the roll ends, the headline block slides to the left
 *
 * Times are seconds after the counter reaches 100%, except `loader`.
 */
export const intro = {
  loader: {
    /** minimum time for the counter to climb, even if the page is ready */
    minDuration: 2.25,
    /** counter update interval */
    tick: 0.1,
    /** hold at 100% before the name starts to leave */
    hold: 0.65,
  },
  exit: { at: 0.65, duration: 0.45, stagger: 0.045, ease: ease.inOutQuart },
  counterExit: { at: 0.75, duration: 0.35, ease: ease.inOutQuart },
  collapse: { at: 1.3, duration: 0.65, ease: ease.inOutQuart },
  logo: { at: 2.15, duration: 1.0, ease: ease.inOutQuart },
  reveal: { at: 2.45, duration: 0.7, ease: ease.standard },
  /** loader HX hands over to the real header logo */
  handoff: { at: 3.15, duration: 0.25 },
  nav: { at: 2.9, duration: 0.7, ease: ease.outExpo },
  roll: { at: 2.75, lineStagger: 0.25, charStagger: 0.025, duration: 0.42, ease: ease.inOutQuart },
  copy: { at: 3.3, duration: 0.8, ease: ease.outExpo },
  dock: { at: 4.35, duration: 1.1, ease: ease.inOutQuart },
  /** "Get to know me by" panel: wiped in top to bottom as the dock eases to rest. */
  panel: { at: 5.15, withoutLoader: 0.6, duration: 1.2, ease: [0.33, 0, 0.2, 1] },
} as const;

/** When the loader is skipped (reduced motion, or disabled), reveals start here. */
export const introWithoutLoader = 0.1;

/** Hover on the Know me by options: hint opens, underline draws, rows below move. */
export const optionHover = { duration: 0.4, ease: ease.outExpo } as const; // = --duration-underline

/** Content swaps inside the Explore section (mode + capability changes). */
export const swap: { enter: Transition; exit: Transition; stagger: number; offset: number } = {
  enter: { duration: 0.5, ease: ease.outExpo },
  exit: { duration: 0.16, ease: ease.standard },
  stagger: 0.05,
  offset: 14, // px of vertical travel
};

/** Programmatic smooth scroll (scroll cue). */
export const scrollTo = { duration: 1.1, ease: ease.inOutQuart } as const;
