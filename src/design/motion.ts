/**
 * Motion tokens for Motion for React. Mirrors the --ease-* / --duration-*
 * tokens in globals.css so CSS transitions and JS animations feel the same.
 */
import type { Transition } from "motion/react";

export const ease = {
  outExpo: [0.16, 1, 0.3, 1],
  inOutQuart: [0.76, 0, 0.24, 1],
  standard: [0.25, 0.1, 0.25, 1],
} as const;

export const duration = {
  fast: 0.18,
  base: 0.32,
  slow: 0.7,
  image: 1.2,
} as const;

/**
 * Hero entrance choreography (seconds).
 * PROVISIONAL: the reference site could not be loaded from the build
 * environment, so these values are a starting point, not a match.
 * Tune them here once a screen recording of the reference is available.
 */
export const heroIntro = {
  /** pause before anything moves */
  delay: 0.25,
  /** each headline line rises from behind a mask */
  line: { duration: 1.1, stagger: 0.09, ease: ease.outExpo },
  /** nav, index labels and supporting copy after the headline lands */
  meta: { delay: 0.75, duration: 0.8, stagger: 0.06, ease: ease.outExpo },
  /** arrow last */
  cue: { delay: 1.05, duration: 0.9, ease: ease.outExpo },
} as const;

/** Content swaps inside the Explore section (mode + capability changes). */
export const swap: { enter: Transition; exit: Transition; stagger: number; offset: number } = {
  enter: { duration: 0.5, ease: ease.outExpo },
  exit: { duration: 0.16, ease: ease.standard },
  stagger: 0.05,
  offset: 14, // px of vertical travel
};

/** Programmatic smooth scroll (scroll cue). */
export const scrollTo = { duration: 1.1, ease: ease.inOutQuart } as const;
