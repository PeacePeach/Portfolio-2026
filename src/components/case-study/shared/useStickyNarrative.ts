"use client";

import { useEffect, useState, type RefObject } from "react";

/**
 * Sticky-text-beside-scrolling-visuals behavior: on desktop, the active index is
 * the last step in `stack` (each `[data-narrative-step]`, else each child) whose top has
 * reached halfway between the pinned text (`[data-narrative-sticky]`) and the middle of the viewport.
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
      const marked = stack.current?.querySelectorAll("[data-narrative-step]");
      const bounds = Array.from(marked?.length ? marked : stack.current?.children ?? []).map(node => node.getBoundingClientRect());
      if (!bounds.length) return;
      // Switch when the next visual's top reaches halfway between the pinned text
      // and the middle of the viewport: not as late as the text, not as early as the middle.
      const sticky = stack.current?.parentElement?.querySelector("[data-narrative-sticky]");
      const top = sticky?.getBoundingClientRect().top ?? window.innerHeight * 0.2;
      const line = (top + window.innerHeight / 2) / 2;
      const passed = bounds.filter(rect => rect.top <= line).length;
      setActive(Math.max(0, passed - 1));
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
