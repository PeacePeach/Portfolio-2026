"use client";

import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { animate, motion } from "motion/react";
import { usePathname } from "next/navigation";
import { site } from "@/content/site";
import { intro } from "@/design/motion";
import { RollText } from "@/components/ui/RollText";
import { IntroContext, type IntroState } from "./IntroContext";

const useIsoLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

/**
 * Opening sequence (Figma frame 1:7): the name and a percentage counter on
 * the dark page colour, the name rolling down to its initials, the initials
 * gliding into the header logo, then the home page showing through.
 * Provides intro state so the header and hero can time their entrances.
 * Skipped for prefers-reduced-motion (and hidden by CSS before JS runs).
 */
export function Intro({ children }: { children: ReactNode }) {
  // The loader opens the home page only; deep links go straight in.
  const pathname = usePathname();
  const [enabled] = useState(() => (site.loader.enabled as boolean) && pathname === "/");
  const [state, setState] = useState<IntroState>({ ready: !enabled, skipped: !enabled, logoShown: !enabled });
  const [showLoader, setShowLoader] = useState(enabled);

  useIsoLayoutEffect(() => {
    if (!enabled) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setState({ ready: true, skipped: true, logoShown: true });
      setShowLoader(false);
    }
  }, [enabled]);

  return (
    <IntroContext.Provider value={state}>
      {children}
      {showLoader ? (
        <Loader
          onComplete={() => setState((s) => ({ ...s, ready: true }))}
          onHandoff={() => setState((s) => ({ ...s, logoShown: true }))}
          onDone={() => setShowLoader(false)}
        />
      ) : null}
    </IntroContext.Provider>
  );
}

function Loader({
  onComplete,
  onHandoff,
  onDone,
}: {
  onComplete: () => void;
  onHandoff: () => void;
  onDone: () => void;
}) {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<"loading" | "exit">("loading");
  const bgRef = useRef<HTMLDivElement>(null);
  const groupRef = useRef<HTMLDivElement>(null);
  const initials = useRef<HTMLSpanElement[]>([]);

  const lines = site.loader.lines;

  // Lock scrolling and start at the top while the loader is up.
  useEffect(() => {
    const html = document.documentElement;
    const prev = html.style.overflow;
    html.style.overflow = "hidden";
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    window.scrollTo(0, 0);
    return () => {
      html.style.overflow = prev;
    };
  }, []);

  // Counter: climbs in uneven steps, waits for fonts and the window load
  // event, and never finishes faster than intro.loader.minDuration.
  useEffect(() => {
    let value = 0;
    let loaded = document.readyState === "complete";
    const onLoad = () => (loaded = true);
    window.addEventListener("load", onLoad);
    let fontsReady = false;
    document.fonts?.ready.then(() => (fontsReady = true));
    const started = performance.now();
    const steps = [0, 0, 5, 0, 5, 0, 4, 0, 5, 0, 4, 0, 4, 6, 4, 6, 4, 2, 6, 0, 7, 5, 6, 4, 2, 6, 7];
    let i = 0;
    const id = window.setInterval(() => {
      const elapsed = (performance.now() - started) / 1000;
      const canFinish = elapsed >= intro.loader.minDuration && loaded && fontsReady;
      value = canFinish ? 100 : Math.min(99, value + (steps[i++ % steps.length] || 0));
      setProgress(value);
      if (value === 100) {
        window.clearInterval(id);
        setPhase("exit");
      }
    }, intro.loader.tick * 1000);
    return () => {
      window.clearInterval(id);
      window.removeEventListener("load", onLoad);
    };
  }, []);

  useEffect(() => {
    if (phase !== "exit") return;
    const timers: number[] = [];
    const at = (s: number, fn: () => void) => timers.push(window.setTimeout(fn, s * 1000));
    const letters = () => initials.current.filter(Boolean);

    // Header and hero time their entrances from the moment we hit 100%.
    onComplete();

    // Rest positions, measured before anything moves.
    let rest: DOMRect[] = [];
    at(intro.collapse.at - 0.05, () => {
      rest = letters().map((el) => el.getBoundingClientRect());
    });

    // 1. Initials slide together into one word at the centre.
    at(intro.collapse.at, () => {
      const group = groupRef.current?.getBoundingClientRect();
      if (!group) return;
      const total = rest.reduce((w, r) => w + r.width, 0);
      let x = group.left + group.width / 2 - total / 2;
      const top = group.top + group.height / 2 - rest[0].height / 2;
      letters().forEach((el, i) => {
        animate(el, { x: x - rest[i].left, y: top - rest[i].top }, { duration: intro.collapse.duration, ease: intro.collapse.ease });
        x += rest[i].width;
      });
    });

    // 2. The word glides to the header logo and shrinks to its size.
    at(intro.logo.at, () => {
      const logo = document.querySelector<HTMLElement>("[data-logo]");
      const first = letters()[0];
      if (!logo || !first) return;
      const target = logo.getBoundingClientRect();
      const scale =
        parseFloat(getComputedStyle(logo).fontSize) / parseFloat(getComputedStyle(first).fontSize);
      const centerY = target.top + target.height / 2;
      let x = target.left;
      letters().forEach((el, i) => {
        el.style.transformOrigin = "0 0";
        const h = rest[i].height * scale;
        animate(
          el,
          { x: x - rest[i].left, y: centerY - h / 2 - rest[i].top, scale },
          { duration: intro.logo.duration, ease: intro.logo.ease },
        );
        x += rest[i].width * scale;
      });
    });

    // 3. The loader background fades and the page shows through.
    at(intro.reveal.at, () => {
      if (bgRef.current) animate(bgRef.current, { opacity: 0 }, { duration: intro.reveal.duration, ease: intro.reveal.ease });
    });

    // 4. The real header logo takes over; the loader goes away.
    at(intro.handoff.at, () => {
      onHandoff();
      letters().forEach((el) => animate(el, { opacity: 0 }, { duration: intro.handoff.duration }));
    });
    at(intro.handoff.at + intro.handoff.duration + 0.05, onDone);

    return () => timers.forEach(clearTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  const exiting = phase === "exit";
  const { exit, counterExit } = intro;
  // Letters roll out left to right across both lines.
  const starts = lines.map((_, i) => lines.slice(0, i).join("").length);

  return (
    <div data-loader aria-hidden="true" className="pointer-events-none fixed inset-0 z-[100]">
      <div ref={bgRef} className="pointer-events-auto absolute inset-0 bg-canvas" />
      <div className="absolute inset-0 flex translate-x-[1.98vw] translate-y-[2.76svh] items-center justify-center">
        <div ref={groupRef} className="relative type-display-l text-primary uppercase">
          {lines.map((word, li) => {
            const start = starts[li];
            const last = li === lines.length - 1;
            return (
              <div key={word} className="flex items-baseline">
                <RollText
                  text={word}
                  play={exiting}
                  delay={exit.at + start * exit.stagger}
                  stagger={exit.stagger}
                  duration={exit.duration}
                  ease={exit.ease}
                  next={(c, i) => (i === 0 ? c : "")}
                  letterRef={(i) => (el) => {
                    if (i === 0 && el) initials.current[li] = el;
                  }}
                />
                {last ? (
                  <span className="ml-[0.36em] inline-block min-w-[2.6em] overflow-hidden type-display-s text-tertiary tabular-nums">
                    <motion.span
                      className="block"
                      initial={false}
                      animate={{ y: exiting ? "-110%" : "0%" }}
                      transition={{ duration: counterExit.duration, ease: counterExit.ease, delay: counterExit.at }}
                    >
                      {progress}%
                    </motion.span>
                  </span>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>
      <span className="sr-only" role="status">
        Loading {progress}%
      </span>
    </div>
  );
}
