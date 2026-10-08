"use client";

import { motion } from "motion/react";
import { heroIntro } from "@/design/motion";
import { smoothScrollTo } from "@/lib/smoothScroll";
import { ArrowDown } from "./ui/Icons";
import { cn } from "@/lib/cn";

/** Oversized arrow that scrolls to (and focuses) the target section. */
export function ScrollCue({ targetId, label, className }: { targetId: string; label: string; className?: string }) {
  const { cue } = heroIntro;
  return (
    <motion.button
      type="button"
      aria-label={label}
      onClick={() => {
        const el = document.getElementById(targetId);
        if (el) smoothScrollTo(el);
      }}
      className={cn("group relative block cursor-pointer text-ink", className)}
      initial={{ opacity: 0, y: -24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: cue.duration, ease: cue.ease, delay: cue.delay }}
    >
      <span className="block overflow-hidden">
        <ArrowDown className="h-full w-full transition-transform duration-(--duration-slow) ease-out-expo group-hover:translate-y-[12%]" />
      </span>
    </motion.button>
  );
}
