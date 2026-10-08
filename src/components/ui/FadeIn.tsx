"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";
import { heroIntro } from "@/design/motion";

/** Secondary intro elements (nav, labels, copy) that follow the headline. */
export function FadeIn({
  children,
  step = 0,
  delay,
  className,
  as = "div",
}: {
  children: ReactNode;
  step?: number;
  delay?: number;
  className?: string;
  as?: "div" | "span" | "p";
}) {
  const { meta } = heroIntro;
  const Comp = motion[as];
  return (
    <Comp
      className={className}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: meta.duration, ease: meta.ease, delay: (delay ?? meta.delay) + step * meta.stagger }}
    >
      {children}
    </Comp>
  );
}
