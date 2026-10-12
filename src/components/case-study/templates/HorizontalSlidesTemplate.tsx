"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import Image from "next/image";
import { motion, useMotionValue, useReducedMotion } from "motion/react";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { StoryTextBlock } from "../shared/StoryTextBlock";
import { CaseStudyContentSwap } from "../shared/CaseStudyMotion";
import { caseStudyMotion } from "../shared/caseStudyMotion";
import { caseStudyTokens } from "../shared/caseStudyTokens";

export type HorizontalSlide = {
  id: string;
  title: string;
  body?: string;
  /** Replaces this slide's title and body with any component (see `StoryTextBlock`). */
  text?: ReactNode;
  image: { src: string; alt: string; width: number; height: number };
};

/** One long artifact (a journey map, a flow) wider than the page. */
export type HorizontalArtifact = { src: string; alt: string; width: number; height: number };

/**
 * `slides`: a pinned slideshow, one whole slide and its text per viewport of scroll (Figma 89:5440).
 * `artifact`: one long image that pins and moves sideways continuously with scroll (Figma 79:1979).
 */
export type HorizontalSlidesData = { label: string } & (
  | { slides: readonly HorizontalSlide[]; artifact?: never }
  | { artifact: HorizontalArtifact; slides?: never }
);

/** Desktop (≥1024px) without reduced motion pins and scrolls sideways; otherwise content stays in normal flow. */
function usePinned() {
  const reduce = useReducedMotion();
  const [desktop, setDesktop] = useState(false);
  useEffect(() => {
    const query = window.matchMedia("(min-width: 1024px)");
    const update = () => setDesktop(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);
  return desktop && !reduce;
}

/**
 * Horizontal storytelling. Slides: desktop pins the section and each viewport of scroll
 * moves one whole slide in, like a slideshow; the title and body above swap to that
 * slide's. Mobile and reduced motion: slides stack with their text. Artifact: see `ArtifactScroller`.
 */
export function HorizontalSlidesTemplate(props: HorizontalSlidesData) {
  return props.artifact ? <ArtifactScroller label={props.label} artifact={props.artifact} /> : <Slides label={props.label} slides={props.slides} />;
}

function Slides({ label, slides }: { label: string; slides: readonly HorizontalSlide[] }) {
  const reduce = useReducedMotion();
  const timing = caseStudyMotion(reduce);
  const pinned = usePinned();
  const [index, setIndex] = useState(0);
  const [step, setStep] = useState(0);
  const outer = useRef<HTMLDivElement>(null);
  const first = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!pinned) return;
    let frame = 0;
    // One slide per equal share of the pinned scroll distance; the slide changes whole, never mid-way.
    const update = () => {
      frame = 0;
      if (!outer.current) return;
      const distance = outer.current.offsetHeight - window.innerHeight;
      const progress = distance > 0 ? Math.min(1, Math.max(0, -outer.current.getBoundingClientRect().top / distance)) : 0;
      setIndex(Math.min(slides.length - 1, Math.floor(progress * slides.length)));
    };
    // Slide pitch = distance between neighbouring slides, so width and gap both come from CSS.
    const measure = () => {
      const slide = first.current;
      const next = slide?.nextElementSibling as HTMLElement | null;
      if (slide && next) setStep(next.offsetLeft - slide.offsetLeft);
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    const resize = () => { measure(); schedule(); };
    resize();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", resize);
    };
  }, [pinned, slides.length]);

  if (!pinned) {
    return <section aria-label={label} style={caseStudyTokens} className="cs-rules cs-section">
      <div className="flex flex-col gap-(--cs-section-gap)">
        {slides.map(slide => <ScrollReveal key={slide.id} className="flex flex-col gap-(--cs-content-top)">
          <div className="cs-slides-text"><StoryTextBlock heading="section" title={slide.title} body={slide.body} text={slide.text} /></div>
          <SlideImage slide={slide} />
        </ScrollReveal>)}
      </div>
    </section>;
  }

  const active = slides[index];
  return <section aria-label={label} style={caseStudyTokens} className="cs-rules cs-section">
    {/* One viewport of scroll per slide while the stage stays pinned. */}
    <div ref={outer} style={{ height: `${slides.length * 100}svh` }}>
      <div className="cs-slides-stage sticky">
        <ScrollReveal>
          {/* Every slide's text shares one grid cell (hidden), so the tallest sets the height and slides never shift. */}
          <div className="cs-slides-text grid" aria-live="polite">
            {slides.map(slide => <div key={slide.id} aria-hidden="true" className="invisible col-start-1 row-start-1"><StoryTextBlock heading="section" title={slide.title} body={slide.body} text={slide.text} /></div>)}
            <div className="col-start-1 row-start-1">
              <CaseStudyContentSwap contentKey={active.id}>
                <StoryTextBlock heading="section" title={active.title} body={active.body} text={active.text} />
              </CaseStudyContentSwap>
            </div>
          </div>
          <div className="cs-slides-viewport">
            <motion.div className="cs-slides-track" animate={{ x: -index * step }} transition={timing.slide}>
              {slides.map((slide, i) => <div key={slide.id} ref={i === 0 ? first : undefined} aria-hidden={i !== index} className="cs-slide">
                <SlideImage slide={slide} />
              </div>)}
            </motion.div>
            <span aria-hidden="true" className="cs-slides-fade" />
          </div>
        </ScrollReveal>
      </div>
    </div>
  </section>;
}

function SlideImage({ slide }: { slide: HorizontalSlide }) {
  return <div className="overflow-hidden rounded-image border border-border-default">
    <Image src={slide.image.src} alt={slide.image.alt} width={slide.image.width} height={slide.image.height} sizes="(min-width: 1024px) 879px, 100vw" className="block h-auto w-full" />
  </div>;
}

/**
 * Figma 79:1979. The artifact bleeds to both viewport edges but starts at the page margin.
 * On desktop it pins 20px below the nav bar, then vertical scroll moves it sideways until
 * its right edge meets the page margin. Mobile and reduced motion get a native horizontal scroller.
 */
function ArtifactScroller({ label, artifact }: { label: string; artifact: HorizontalArtifact }) {
  const pinned = usePinned();
  const [size, setSize] = useState({ travel: 0, height: 0 });
  const outer = useRef<HTMLDivElement>(null);
  const sticky = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);

  useEffect(() => {
    x.set(0);
    if (!pinned) return;
    let frame = 0;
    // Travel ends when the artifact's right edge meets the section's right edge (the page margin).
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
    <section aria-label={label} style={caseStudyTokens} className="cs-rules cs-section">
      {/* Pinned: the artifact's height plus one pixel of scroll per pixel of sideways travel. */}
      <div ref={outer} style={pinned ? { height: size.height + size.travel } : undefined}>
        <div
          ref={sticky}
          style={{ top: "calc(var(--spacing-header-bar) + var(--spacing) * 5)" }}
          className={`-mx-(--spacing-margin) px-(--spacing-margin) ${pinned ? "sticky overflow-hidden" : "overflow-x-auto"}`}
        >
          {/* Same scroll reveal as the other case-study sections; inside the sticky box so pinning is unaffected. */}
          <ScrollReveal>
            <motion.div ref={track} style={{ x }} className="w-max">
              <Image
                src={artifact.src}
                alt={artifact.alt}
                width={artifact.width}
                height={artifact.height}
                unoptimized
                className="block h-[min(860px,calc(100svh-var(--spacing-header-bar)-var(--spacing)*10))] w-auto max-w-none"
              />
            </motion.div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
