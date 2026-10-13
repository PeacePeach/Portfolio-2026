"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { getProject } from "@/content";
import { site } from "@/content/site";
import { intro, swap } from "@/design/motion";
import { useCaseStudyChapters, type CaseStudyChapter } from "./case-study/shared/caseStudyChapters";
import { useIntro } from "./intro/IntroContext";
import { markPageSlide, slideBack, slideForward } from "@/lib/pageTransition";

/** The header remounts on every page; the nav fades in once per visit. */
let navRevealed = false;

/**
 * Fixed header (Figma 110:21956, bar 72 px): HX logo left, Work / Leadership /
 * Resume right (12 px, 40 px apart), on the page background with a background
 * blur, so it stays readable over whatever scrolls under it. The current
 * section's link is full white, the others 60 % (Figma 41:24828).
 * During the intro the loader's initials glide onto the logo, so the logo
 * stays hidden until that hand-off and the links fade in alongside.
 * On a case study, once Chapter 01 reaches the nav the left side also shows
 * the case-study progress (Figma 110:21962); above it the bar is unchanged.
 */
export function Header() {
  const { ready, skipped, logoShown } = useIntro();
  // Kept in state so a page restored from the router cache doesn't replay the fade.
  const [instant, setInstant] = useState(() => skipped || navRevealed);
  const navDelay = instant ? 0 : intro.nav.at;
  const pathname = usePathname();
  const isCurrent = (href: string) => pathname === href || pathname.startsWith(`${href}/`);
  const project = pathname.startsWith("/work/") ? getProject(pathname.split("/")[2] ?? "") : undefined;

  return (
    <header
      className="fixed inset-x-0 top-0 z-40 bg-background backdrop-blur-[25px]"
      style={{ viewTransitionName: "site-header" }}
    >
      <div className="container-page flex h-header-bar items-center justify-between gap-6">
        <div className="flex min-w-0 items-center gap-16">
        <Link
          href="/"
          {...slideBack}
          aria-label={site.name}
          data-logo
          className="type-brand uppercase text-primary transition-opacity duration-(--duration-fast)"
          style={{ opacity: logoShown ? 1 : 0 }}
        >
          {site.shortName}
        </Link>
          {project && <ChapterProgress title={project.title} />}
        </div>
        <motion.nav
          data-reveal
          aria-label="Primary"
          initial={instant ? false : { opacity: 0 }}
          animate={{ opacity: ready || instant ? 1 : 0 }}
          onAnimationComplete={() => {
            if (!ready) return;
            navRevealed = true;
            setInstant(true);
          }}
          transition={{ duration: intro.nav.duration, ease: intro.nav.ease, delay: navDelay }}
        >
          <ul className="flex gap-10">
            {site.nav.map((item) => {
              const current = isCurrent(item.href);
              const external = "external" in item && item.external;
              return (
                <li key={item.href}>
                  <Link
                    href={external ? site.resumeUrl : item.href}
                    {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
                    aria-current={current ? "page" : undefined}
                    {...(item.href === "/work" ? slideForward : {})}
                    onClick={() => {
                      if (item.href === "/work" && window.location.pathname !== "/work") markPageSlide();
                    }}
                    className={`hover-underline type-body-xs leading-[1.4] uppercase transition-colors duration-(--duration-base) ${
                      current ? "text-primary" : "text-secondary hover:text-primary"
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </motion.nav>
      </div>
    </header>
  );
}

/**
 * Case-study progress beside the logo (Figma 110:21962): "Case study: name",
 * then one dot and number per numbered chapter on the page, joined by dotted
 * connectors. A chapter is current once its header reaches the line anchored
 * sections land on (their scroll-margin-top, just under the nav), so clicking
 * a chapter and scrolling to it agree. Hidden until Chapter 01 gets there, and
 * below lg, where the bar has no room for it.
 */
function ChapterProgress({ title }: { title: string }) {
  const chapters = useCaseStudyChapters();
  const current = useCurrentChapter(chapters);
  const reduce = useReducedMotion();

  const goTo = (chapter: CaseStudyChapter) => {
    const el = document.getElementById(chapter.id);
    if (!el) return;
    const offset = parseFloat(getComputedStyle(el).scrollMarginTop) || 0;
    const top = chapterTop(el) + window.scrollY - offset;
    window.scrollTo({ top, behavior: reduce ? "auto" : "smooth" });
  };

  return (
    <AnimatePresence>
      {current >= 0 && (
        <motion.nav
          key="progress"
          aria-label="Case study chapters"
          className="hidden items-center gap-6 lg:flex"
          initial={{ opacity: 0, y: reduce ? 0 : swap.offset / 2 }}
          animate={{ opacity: 1, y: 0, transition: reduce ? { duration: 0 } : swap.enter }}
          exit={{ opacity: 0, transition: reduce ? { duration: 0 } : swap.exit }}
        >
          <p className="type-label-s whitespace-nowrap uppercase text-secondary">Case study: {title}</p>
          <ol className="flex items-center gap-1">
            {chapters.map((chapter, i) => {
              const reached = i <= current;
              return (
                <li key={chapter.id} className="flex items-center gap-1">
                  {i > 0 && (
                    <span
                      aria-hidden
                      className={`h-px w-[11px] bg-[repeating-linear-gradient(90deg,currentColor_0_2px,transparent_2px_4px)] transition-colors duration-(--duration-base) ${
                        reached ? "text-secondary" : "text-tertiary"
                      }`}
                    />
                  )}
                  <a
                    href={`#${chapter.id}`}
                    aria-label={`Chapter ${chapter.number}: ${chapter.label}`}
                    aria-current={i === current ? "step" : undefined}
                    onClick={(event) => {
                      event.preventDefault();
                      goTo(chapter);
                    }}
                    className={`flex items-center gap-1 type-body-xs leading-[1.4] whitespace-nowrap transition-colors duration-(--duration-base) ${
                      reached ? "text-primary" : "text-tertiary hover:text-primary"
                    }`}
                  >
                    <span
                      aria-hidden
                      className={`size-1.5 rounded-full transition-colors duration-(--duration-base) ${
                        i === current ? "bg-highlight" : reached ? "bg-check" : "bg-tertiary"
                      }`}
                    />
                    {chapter.number}
                  </a>
                </li>
              );
            })}
          </ol>
        </motion.nav>
      )}
    </AnimatePresence>
  );
}

/** Top of a chapter: its header block, which the chapter reveal never moves. */
function chapterTop(el: HTMLElement) {
  return (el.closest(".cs-chapter") ?? el).getBoundingClientRect().top;
}

/** Index of the last chapter whose header has reached its anchor line; -1 above Chapter 01. */
function useCurrentChapter(chapters: CaseStudyChapter[]) {
  const [current, setCurrent] = useState(-1);
  useEffect(() => {
    let frame = 0;
    const measure = () => {
      frame = 0;
      let next = -1;
      chapters.forEach((chapter, i) => {
        const el = document.getElementById(chapter.id);
        if (!el) return;
        const offset = parseFloat(getComputedStyle(el).scrollMarginTop) || 0;
        if (chapterTop(el) <= offset + 1) next = i;
      });
      setCurrent(next);
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };
    measure();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [chapters]);
  return current;
}
