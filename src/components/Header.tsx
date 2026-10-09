"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";
import { site } from "@/content/site";
import { intro } from "@/design/motion";
import { useIntro } from "./intro/IntroContext";
import { markPageSlide, slideBack, slideForward } from "@/lib/pageTransition";

/** The header remounts on every page; the nav fades in once per visit. */
let navRevealed = false;

/**
 * Fixed header (Figma 1:5, bar from 45:24842): HX logo left, Work / About /
 * Resume right, on a 50 % canvas bar with a background blur, so it stays
 * readable over whatever scrolls under it. The current section's link is
 * full white, the others 60 % (Figma 41:24828).
 * During the intro the loader's initials glide onto the logo, so the logo
 * stays hidden until that hand-off and the links fade in alongside.
 */
export function Header() {
  const { ready, skipped, logoShown } = useIntro();
  // Kept in state so a page restored from the router cache doesn't replay the fade.
  const [instant, setInstant] = useState(() => skipped || navRevealed);
  const navDelay = instant ? 0 : intro.nav.at;
  const pathname = usePathname();
  const isCurrent = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header
      className="fixed inset-x-0 top-0 z-40 bg-[rgba(13,13,13,0.5)] backdrop-blur-[25px]"
      style={{ viewTransitionName: "site-header" }}
    >
      <div className="container-page flex h-header-bar items-center justify-between gap-6">
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
            {site.nav.map((item) => {
              const current = isCurrent(item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={current ? "page" : undefined}
                    {...(item.href === "/work" ? slideForward : {})}
                    onClick={() => {
                      if (item.href === "/work" && window.location.pathname !== "/work") markPageSlide();
                    }}
                    className={`hover-underline font-sans text-[0.875rem] leading-[1.3] tracking-[-0.03em] uppercase transition-colors duration-(--duration-base) ${
                      current ? "text-ink" : "text-ink/60 hover:text-ink"
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
