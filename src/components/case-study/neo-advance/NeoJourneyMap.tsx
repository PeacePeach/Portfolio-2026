"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, useMotionValue, useReducedMotion } from "motion/react";
import { neoAdvanceJourneyMap as journey } from "@/content/neoAdvance";
import { caseStudyTokens } from "../shared/caseStudyTokens";

/**
 * Figma 79:1979. The map bleeds to both viewport edges but starts at the page margin.
 * On desktop it pins 20px below the nav bar, then vertical
 * scroll moves it sideways until its right edge meets the page margin. Mobile and
 * reduced motion get a native horizontal scroller instead.
 */
export function NeoJourneyMap() {
  const reduce = useReducedMotion();
  const [desktop, setDesktop] = useState(false);
  const [size, setSize] = useState({ travel: 0, height: 0 });
  const outer = useRef<HTMLDivElement>(null);
  const sticky = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const pinned = desktop && !reduce;

  useEffect(() => {
    const query = window.matchMedia("(min-width: 1024px)");
    const update = () => setDesktop(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    x.set(0);
    if (!pinned) return;
    let frame = 0;
    // Travel ends when the map's right edge meets the section's right edge (the page margin).
    const measure = () => setSize({
      travel: Math.max(0, (track.current?.scrollWidth ?? 0) - (outer.current?.clientWidth ?? 0)),
      height: sticky.current?.offsetHeight ?? 0,
    });
    const update = () => {
      frame = 0;
      if (!outer.current || !sticky.current) return;
      const top = parseFloat(getComputedStyle(sticky.current).top);
      const distance = Math.max(0, (track.current?.scrollWidth ?? 0) - outer.current.clientWidth);
      const progress = distance ? Math.min(1, Math.max(0, (top - outer.current.getBoundingClientRect().top) / distance)) : 0;
      x.set(-progress * distance);
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    const resize = () => { measure(); schedule(); };
    resize();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", resize);
    const observer = new ResizeObserver(resize);
    if (track.current) observer.observe(track.current);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", resize);
    };
  }, [pinned, x]);

  return (
    <section aria-label={journey.label} style={caseStudyTokens} className="cs-rules cs-section">
      {/* Pinned: the map's height plus one pixel of scroll per pixel of sideways travel. */}
      <div ref={outer} style={pinned ? { height: size.height + size.travel } : undefined}>
        <div
          ref={sticky}
          style={{ top: "calc(var(--spacing-header-bar) + var(--spacing) * 5)" }}
          className={`-mx-(--spacing-margin) px-(--spacing-margin) ${pinned ? "sticky overflow-hidden" : "overflow-x-auto"}`}
        >
          <motion.div ref={track} style={{ x }} className="w-max">
            <Image
              src={journey.src}
              alt={journey.alt}
              width={journey.width}
              height={journey.height}
              unoptimized
              className="block h-[min(860px,calc(100svh-var(--spacing-header-bar)-var(--spacing)*10))] w-auto max-w-none"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
