"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { site } from "@/content/site";
import { intro } from "@/design/motion";
import { useIntro } from "./intro/IntroContext";

/**
 * Fixed header (Figma 1:5): HX logo left, Work / About / Resume right.
 * During the intro the loader's initials glide onto the logo, so the logo
 * stays hidden until that hand-off and the links fade in alongside.
 */
export function Header() {
  const { ready, skipped, logoShown } = useIntro();
  const navDelay = skipped ? 0 : intro.nav.at;

  return (
    <header className="fixed inset-x-0 top-0 z-40 mix-blend-difference">
      <div className="container-page flex h-header items-center justify-between gap-6">
        <Link
          href="/"
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
          initial={{ opacity: 0 }}
          animate={{ opacity: ready ? 1 : 0 }}
          transition={{ duration: intro.nav.duration, ease: intro.nav.ease, delay: navDelay }}
        >
          <ul className="flex gap-[clamp(1.25rem,3.125vw,3.5rem)]">
            {site.nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="relative type-body-m uppercase text-ink after:absolute after:-bottom-1 after:left-0 after:h-px after:w-full after:origin-right after:scale-x-0 after:bg-current after:transition-transform after:duration-(--duration-base) after:ease-out-expo hover:after:origin-left hover:after:scale-x-100"
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
