"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { site } from "@/content/site";
import { intro } from "@/design/motion";
import { useIntro } from "./intro/IntroContext";
import { markPageSlide, slideBack, slideForward } from "@/lib/pageTransition";

/** The header remounts on every page; the nav fades in once per visit. */
let navRevealed = false;

/**
 * Fixed header (Figma 1:5): HX logo left, Work / About / Resume right.
 * During the intro the loader's initials glide onto the logo, so the logo
 * stays hidden until that hand-off and the links fade in alongside.
 */
export function Header() {
  const { ready, skipped, logoShown } = useIntro();
  // Kept in state so a page restored from the router cache doesn't replay the fade.
  const [instant, setInstant] = useState(() => skipped || navRevealed);
  const navDelay = instant ? 0 : intro.nav.at;

  return (
    <header className="fixed inset-x-0 top-0 z-40 mix-blend-difference" style={{ viewTransitionName: "site-header" }}>
      <div className="container-page flex h-header items-center justify-between gap-6">
        <Link
          href="/"
          {...slideBack}
          aria-label={site.name}
          data-logo
          className="type-brand uppercase text-ink transition-opacity duration-(--duration-fast)"
          style={{ opacity: logoShown ? 1 : 0 }}
        >
          {site.shortName}
        </Link>
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
          <ul className="flex gap-[clamp(1.25rem,3.125vw,3.5rem)]">
            {site.nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  {...(item.href === "/work" ? slideForward : {})}
                  onClick={() => {
                    if (item.href === "/work" && window.location.pathname !== "/work") markPageSlide();
                  }}
                  className="hover-underline type-body-m uppercase text-ink"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </motion.nav>
      </div>
    </header>
  );
}
