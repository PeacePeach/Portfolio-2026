"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, animate, motion, useMotionTemplate, useMotionValue, useReducedMotion } from "motion/react";
import { site } from "@/content/site";
import { intro, optionHover } from "@/design/motion";
import { ArrowRight } from "./ui/Icons";
import { useIntro } from "./intro/IntroContext";

/** Event the Explore section listens to, so in-page links can switch its view. */
export const EXPLORE_VIEW_EVENT = "explore:view";

/**
 * "Get to know me by" panel beside the hero (Figma 2:31). It wipes in from
 * top to bottom once the headline has docked. Hovering or focusing an option
 * opens its hint and blue underline and moves the options below it down
 * (Figma 2:134, restyled in 10:41). Rows above the active one never move, so the pointer stays
 * on the row it is hovering.
 */
export function KnowMe({ className = "" }: { className?: string }) {
  const { heading, options } = site.knowMe;
  const { ready, skipped } = useIntro();
  const reduce = useReducedMotion();
  const [active, setActive] = useState<number | null>(null);

  // Wipe: a soft-edged mask whose edge travels from above the panel to below it.
  const edge = useMotionValue(reduce ? 130 : -30);
  const mask = useMotionTemplate`linear-gradient(to bottom, #000 ${edge}%, transparent calc(${edge}% + 30%))`;
  useEffect(() => {
    if (!ready || reduce) return;
    const controls = animate(edge, 130, {
      duration: intro.panel.duration,
      ease: intro.panel.ease,
      delay: skipped ? intro.panel.withoutLoader : intro.panel.at,
    });
    return () => controls.stop();
  }, [ready, skipped, reduce, edge]);

  const t = reduce ? { duration: 0 } : optionHover;

  return (
    <motion.nav
      aria-label={heading}
      data-mask-reveal
      style={{ maskImage: mask, WebkitMaskImage: mask }}
      className={`w-[14.25rem] type-body-m-tight ${className}`}
    >
      <p className="uppercase text-ink/60">{heading}</p>
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
                onClick={() => {
                  if (option.view) window.dispatchEvent(new CustomEvent(EXPLORE_VIEW_EVENT, { detail: option.view }));
                }}
                className="relative block outline-offset-8"
              >
                <span className="flex items-center gap-2">
                  {option.label}
                  <ArrowRight className="size-[1.125rem] shrink-0" />
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
                        <span className="block type-body-s text-ink/60">{option.hint}</span>
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
    </motion.nav>
  );
}
