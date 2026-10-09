"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowRight } from "react-feather";
import { site } from "@/content/site";
import { intro, optionHover } from "@/design/motion";
import { markPageSlide, slideForward } from "@/lib/pageTransition";
import { Reveal } from "./ui/Reveal";
import { useIntro } from "./intro/IntroContext";

/**
 * "Get to know me by" panel beside the hero (Figma 2:31). It reveals top to
 * bottom once the headline has docked. Hovering or focusing an option opens
 * its hint and blue underline and moves the options below it down (Figma
 * 2:134, restyled in 10:41). Rows above the active one never move, so the
 * pointer stays on the row it is hovering. Each option slides the page over
 * to the Work page, opened on that view.
 */
export function KnowMe({ className = "" }: { className?: string }) {
  const { heading, options } = site.knowMe;
  const { ready, skipped } = useIntro();
  const reduce = useReducedMotion();
  const [active, setActive] = useState<number | null>(null);

  const t = reduce ? { duration: 0 } : optionHover;

  return (
    <Reveal
      play={ready}
      delay={skipped ? intro.panel.withoutLoader : intro.panel.at}
      className={`w-[14.25rem] type-body-m-tight ${className}`}
    >
      <nav aria-label={heading}>
        <p className="uppercase text-secondary">{heading}</p>
        <ul className="mt-9" onMouseLeave={() => setActive(null)}>
          {options.map((option, i) => {
            const open = active === i;
            return (
              <motion.li
                key={option.label}
                layout="position"
                transition={{ layout: t }}
                // Rows sit 16 px apart; an open row grows and pushes the rows below it down.
                className={i > 0 ? "mt-4" : ""}
              >
                <Link
                  href={option.href}
                  onMouseEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  onBlur={() => setActive(null)}
                  {...slideForward}
                  onClick={markPageSlide}
                  className="relative block outline-offset-8"
                >
                  <span className="flex items-center gap-2">
                    {option.label}
                    <ArrowRight size={18} strokeWidth={1.33} className="shrink-0" aria-hidden="true" />
                    <span className="sr-only">: {option.hint}</span>
                  </span>
                  <AnimatePresence initial={false}>
                    {open && (
                      <motion.span
                        key="hint"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        // Collapse after the underline has started retracting, so its exit stays visible.
                        exit={{ height: 0, opacity: 0, transition: { ...t, delay: reduce ? 0 : 0.2 } }}
                        transition={t}
                        className="block overflow-hidden"
                      >
                        <span aria-hidden="true" className="block pt-2 pb-3">
                          <span className="block type-body-s text-secondary">{option.hint}</span>
                        </span>
                        {/* Room for the underline below */}
                        <span aria-hidden="true" className="block h-(--underline-thickness)" />
                      </motion.span>
                    )}
                  </AnimatePresence>
                  {/* Same line as .hover-underline: draws in from the left, retracts to the right. */}
                  <motion.span
                    aria-hidden="true"
                    initial={false}
                    animate={{ scaleX: open ? 1 : 0, originX: open ? 0 : 1 }}
                    transition={t}
                    className="pointer-events-none absolute inset-x-0 bottom-0 block h-(--underline-thickness) rounded-full [background-image:var(--underline-gradient)]"
                  />
                </Link>
              </motion.li>
            );
          })}
        </ul>
      </nav>
    </Reveal>
  );
}
