"use client";

import { motion } from "motion/react";
import { intro, introWithoutLoader } from "@/design/motion";
import { smoothScrollTo } from "@/lib/smoothScroll";
import { useIntro } from "./intro/IntroContext";
import { cn } from "@/lib/cn";

/**
 * Circular scroll button: the ring draws itself, then the arrow drops in.
 * Clicking scrolls to (and focuses) the target section.
 */
export function ScrollCue({ targetId, label, className }: { targetId: string; label: string; className?: string }) {
  const { ready, skipped } = useIntro();
  const delay = skipped ? introWithoutLoader + 0.4 : intro.cue.at;
  const t = { duration: intro.cue.duration, ease: intro.cue.ease, delay };

  return (
    <button
      type="button"
      aria-label={label}
      onClick={() => {
        const el = document.getElementById(targetId);
        if (el) smoothScrollTo(el);
      }}
      className={cn("group block aspect-square cursor-pointer rounded-full text-ink", className)}
    >
      <svg viewBox="0 0 100 100" className="absolute inset-0 size-full -rotate-90" aria-hidden="true">
        <motion.circle
          data-reveal
          cx="50"
          cy="50"
          r="49"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          vectorEffect="non-scaling-stroke"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: ready ? 1 : 0 }}
          transition={t}
        />
      </svg>
      <span className="absolute inset-[30%] overflow-hidden">
        <motion.span
          data-reveal
          className="block size-full"
          initial={{ y: "-110%" }}
          animate={{ y: ready ? "0%" : "-110%" }}
          transition={{ ...t, delay: delay + 0.15 }}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            className="size-full transition-transform duration-(--duration-slow) ease-out-expo group-hover:translate-y-[12%]"
            aria-hidden="true"
          >
            <path d="M12 3v17M5 13l7 7 7-7" stroke="currentColor" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
          </svg>
        </motion.span>
      </span>
    </button>
  );
}
