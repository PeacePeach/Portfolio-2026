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
 * Opening sequence, measured frame by frame from a screen recording of the
 * reference site (20–30 fps sampling, so values are accurate to ~50 ms).
 *
 *   loader   light screen, name + 000→100% counter (~2.25 s), hold ~0.65 s
 *   exit     every letter rolls up out of a mask, left to right; only the
 *            initials and the final period roll back in; counter rolls out
 *   collapse the remaining initials slide together into a monogram
 *   curtain  the dark page drops in from the top with a curved bottom edge
 *   roll     each hero line flips through a duplicate copy of itself,
 *            letter by letter, lines staggered top to bottom
 *   details  meta label, supporting copy and scroll button settle last
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
  counterExit: { at: 0.85, duration: 0.35, ease: ease.inOutQuart },
  collapse: { at: 1.7, duration: 0.45, ease: ease.inOutQuart },
  curtain: {
    at: 1.65,
    duration: 0.85,
    ease: ease.curtain,
    /** depth of the curved edge, as a fraction of viewport height */
    bulge: 0.06,
    /** the page drifts down into place as the curtain lands */
    parallax: { from: "-12vh", duration: 1.4, ease: ease.outExpo },
  },
  roll: { at: 2.05, lineStagger: 0.25, charStagger: 0.025, duration: 0.42, ease: ease.inOutQuart },
  meta: { at: 2.3, duration: 0.7, ease: ease.outExpo },
  copy: { at: 2.6, duration: 0.8, stagger: 0.06, ease: ease.outExpo },
  cue: { at: 2.45, duration: 0.9, ease: ease.outExpo },
} as const;

/** When the loader is skipped (reduced motion, or disabled), reveals start here. */
export const introWithoutLoader = 0.1;

/** Content swaps inside the Explore section (mode + capability changes). */
export const swap: { enter: Transition; exit: Transition; stagger: number; offset: number } = {
  enter: { duration: 0.5, ease: ease.outExpo },
  exit: { duration: 0.16, ease: ease.standard },
  stagger: 0.05,
  offset: 14, // px of vertical travel
};

/** Programmatic smooth scroll (scroll cue). */
export const scrollTo = { duration: 1.1, ease: ease.inOutQuart } as const;
