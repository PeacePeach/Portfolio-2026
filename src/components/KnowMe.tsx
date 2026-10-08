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
 * (Figma 2:134). Rows above the active one never move, so the pointer stays
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
      className={`w-[14.6em] text-option ${className}`}
    >
      <p className="font-sans text-small">{heading}</p>
      <ul className="mt-[1.6em]" onMouseLeave={() => setActive(null)}>
        {options.map((option, i) => {
          const open = active === i;
          const after = active !== null && i > active;
          return (
            <motion.li
              key={option.label}
              layout="position"
              transition={{ layout: t }}
              // Default rows sit 16 px apart; rows below an open one 12 + 12 px, 24 px after it.
              className={`${i > 0 ? (after ? (i === active! + 1 ? "mt-[1.2em]" : "mt-[0.6em]") : "mt-[0.8em]") : ""} ${
                after ? "pb-[0.6em]" : ""
              }`}
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
                <span className="flex items-center gap-[0.4em] font-sans">
                  {option.label}
                  <ArrowRight className="size-[0.9em] shrink-0" />
                  <span className="sr-only">: {option.hint}</span>
                </span>
                <AnimatePresence initial={false}>
                  {open && (
                    <motion.span
                      key="hint"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={t}
                      className="block overflow-hidden"
                    >
                      <span aria-hidden="true" className="block pt-[0.4em] pb-[0.6em]">
                        <span className="block font-sans text-small font-normal text-ink/80">{option.hint}</span>
                      </span>
                      <motion.span
                        aria-hidden="true"
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        exit={{ scaleX: 0 }}
                        transition={t}
                        className="block h-[3px] origin-left bg-linear-to-r from-highlight to-highlight/20"
                      />
                    </motion.span>
                  )}
                </AnimatePresence>
              </Link>
            </motion.li>
          );
        })}
      </ul>
    </motion.nav>
  );
}
