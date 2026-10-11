"use client";

import { useEffect, useState, type RefObject } from "react";

/**
 * Sticky-text-beside-scrolling-visuals behavior: on desktop, the active index is
 * the child of `stack` crossing the viewport center. It holds until that child
 * leaves the 45–55% band, so the text doesn't flicker at boundaries.
 */
export function useStickyNarrative(stack: RefObject<HTMLElement | null>) {
  const [desktop, setDesktop] = useState(false);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const query = window.matchMedia("(min-width: 1024px)");
    const update = () => setDesktop(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (!desktop) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const bounds = Array.from(stack.current?.children ?? []).map(node => node.getBoundingClientRect());
      if (!bounds.length) return;
      const center = window.innerHeight / 2;
      setActive(current => {
        const rect = bounds[current];
        if (rect && rect.bottom >= center * 0.9 && rect.top <= center * 1.1) return current;
        const next = bounds.findIndex(rect => rect.top <= center && rect.bottom > center);
        return next >= 0 ? next : bounds[0].top > center ? 0 : bounds.length - 1;
      });
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    const observer = new ResizeObserver(schedule);
    if (stack.current) observer.observe(stack.current);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [desktop, stack]);

  return { desktop, active };
}
