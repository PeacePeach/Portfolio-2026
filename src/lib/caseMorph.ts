import { useSyncExternalStore } from "react";

/**
 * Shared-element transition from a Work tile into its case study. The Work
 * tile starts it; a fixed layer in the /work layout (which survives the route
 * change) plays it; the case study page hides its own hero until the layer
 * hands over. Client-only, in memory.
 */
export type CaseMorph = {
  slug: string;
  /** the tile, in viewport pixels, when it was clicked */
  tile: { left: number; top: number; width: number; height: number };
  /** a frozen copy of the tile's scene, shown while the primary screen takes over */
  scene: HTMLElement | null;
  /** performance.now() at the click */
  start: number;
  /** the case study's hero has mounted (under the layer) */
  landed: boolean;
};

/**
 * Timeline, in seconds after the click (see the storyboard in the thread):
 * the sidebar leaves, the blue surface grows into the hero, the tile's sheet
 * holds then settles into its screen, the other screens surface around it,
 * then the text arrives.
 */
export const morphTiming = {
  leave: { duration: 0.3 },
  /** route change, once the Work page has faded */
  navigate: 0.32,
  sceneFade: { delay: 0.04, duration: 0.2 },
  surface: { delay: 0.15, duration: 0.75 },
  gradient: { delay: 0.15, duration: 0.5 },
  primary: { delay: 0.22, duration: 0.68 },
  screens: { delay: 0.45, ring: 0.065, duration: 0.4, rise: 12, scale: 0.96 },
  text: { delay: 0.75, stagger: 0.05, duration: 0.35, rise: 12 },
  /** everything above has finished */
  end: 1.05,
  /** soft start, long confident settle; no overshoot */
  ease: [0.6, 0, 0.15, 1] as const,
  settle: [0.22, 1, 0.36, 1] as const,
};

/** Case studies with a hero the Work tile can morph into. */
export const morphTargets = new Set(["neo-advance"]);

let current: CaseMorph | null = null;
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

export function startCaseMorph(m: Omit<CaseMorph, "landed">) {
  current = { ...m, landed: false };
  emit();
}

export function landCaseMorph() {
  if (!current || current.landed) return;
  current = { ...current, landed: true };
  emit();
}

export function endCaseMorph() {
  if (!current) return;
  current = null;
  emit();
}

const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => listeners.delete(l);
};

export function useCaseMorph() {
  return useSyncExternalStore(
    subscribe,
    () => current,
    () => null,
  );
}

/**
 * With reduced motion the tile skips the morph: the case study just fades in
 * briefly. Set by the tile, read once by the case study as it mounts.
 */
let fadeAt = -Infinity;
export function markCaseFade() {
  fadeAt = performance.now();
}
export function cameByFade() {
  return typeof performance !== "undefined" && performance.now() - fadeAt < 1500;
}

/** Seconds since the morph began, or Infinity when there is none. */
export function morphElapsed(m: CaseMorph | null) {
  return m ? (performance.now() - m.start) / 1000 : Infinity;
}
