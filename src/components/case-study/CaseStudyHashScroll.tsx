"use client";

import { useEffect } from "react";

/** How long to keep the target in place while heroes, images and reveals above it settle. */
const SETTLE_MS = 2500;

/**
 * Lands on the section named in the URL hash (/work/[slug]#section). The case
 * study streams in after the browser and router have already tried to scroll,
 * and content above the target keeps growing for a moment, so this scrolls
 * once it mounts and again whenever the page resizes, until the reader scrolls
 * themselves or the page settles.
 */
export function CaseStudyHashScroll() {
  useEffect(() => {
    const id = decodeURIComponent(window.location.hash.slice(1));
    const target = id ? document.getElementById(id) : null;
    if (!target) return;

    const land = () => target.scrollIntoView({ block: "start" });
    land();

    const resize = new ResizeObserver(land);
    resize.observe(document.body);
    const stop = () => {
      resize.disconnect();
      clearTimeout(timer);
      for (const e of inputs) window.removeEventListener(e, stop);
    };
    const inputs = ["wheel", "touchstart", "keydown", "pointerdown"] as const;
    for (const e of inputs) window.addEventListener(e, stop, { passive: true });
    const timer = setTimeout(stop, SETTLE_MS);
    return stop;
  }, []);
  return null;
}
