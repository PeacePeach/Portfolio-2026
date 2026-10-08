"use client";

import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { animate, motion } from "motion/react";
import { site } from "@/content/site";
import { intro } from "@/design/motion";
import { RollText } from "@/components/ui/RollText";
import { IntroContext } from "./IntroContext";

const useIsoLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

/**
 * Opening sequence: a light loader with the name and a percentage counter,
 * the name collapsing to initials, then the dark page dropping in on a
 * curved curtain. Provides `ready` so the hero can time its own entrance.
 * Skipped entirely for prefers-reduced-motion (and hidden by CSS before JS).
 */
export function Intro({ children }: { children: ReactNode }) {
  const [state, setState] = useState<{ ready: boolean; skipped: boolean }>({
    ready: !site.loader.enabled,
    skipped: !site.loader.enabled,
  });
  const [showLoader, setShowLoader] = useState<boolean>(site.loader.enabled);

  useIsoLayoutEffect(() => {
    if (!site.loader.enabled) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setState({ ready: true, skipped: true });
      setShowLoader(false);
    }
  }, []);

  return (
    <IntroContext.Provider value={state}>
      {children}
      {showLoader ? (
        <Loader
          onComplete={() => setState({ ready: true, skipped: false })}
          onDone={() => setShowLoader(false)}
        />
      ) : null}
    </IntroContext.Provider>
  );
}

function Loader({ onComplete, onDone }: { onComplete: () => void; onDone: () => void }) {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<"loading" | "exit">("loading");
  const overlayRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLSpanElement>(null);
  const letters = useRef(new Map<number, HTMLSpanElement | null>());

  const name = site.loader.name;
  const keep = keptIndices(name);

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
      if (canFinish) value = 100;
      else value = Math.min(99, value + (steps[i++ % steps.length] || 0));
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

    // Hero entrance is timed from the moment the counter lands on 100%.
    onComplete();

    // Collapse the remaining initials into a centered monogram.
    at(intro.collapse.at, () => {
      const offsets = collapseOffsets(nameRef.current, letters.current, keep);
      for (const [i, dx] of Object.entries(offsets)) {
        const el = letters.current.get(Number(i));
        if (el) animate(el, { x: dx }, { duration: intro.collapse.duration, ease: intro.collapse.ease });
      }
    });

    // Curtain: the overlay is clipped away from the top by a curved edge.
    at(intro.curtain.at, () => {
      const el = overlayRef.current;
      if (!el) return;
      animate(0, 1, {
        duration: intro.curtain.duration,
        ease: intro.curtain.ease,
        onUpdate: (p) => (el.style.clipPath = curtainPath(p, window.innerWidth, window.innerHeight)),
        onComplete: onDone,
      });
    });
    return () => timers.forEach(clearTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  const exiting = phase === "exit";
  const { exit, counterExit } = intro;

  return (
    <div
      ref={overlayRef}
      data-loader
      aria-hidden="true"
      className="fixed inset-0 z-[100] bg-paper text-paper-ink"
    >
      <div className="absolute inset-x-0 top-[49%] flex -translate-y-1/2 justify-center">
        <span ref={nameRef} className="wide relative inline-block text-loader uppercase">
          <RollText
            text={name}
            play={exiting}
            delay={exit.at}
            stagger={exit.stagger}
            duration={exit.duration}
            ease={exit.ease}
            next={(c, i) => (keep.has(i) ? c : "")}
            letterRef={(i) => (el) => {
              letters.current.set(i, el);
            }}
          />
        </span>
      </div>

      <div className="wide absolute right-[3.9vw] bottom-[8vh] overflow-hidden text-[clamp(1.75rem,6.3vw,7rem)] leading-none tabular-nums">
        <motion.span
          className="block"
          initial={false}
          animate={{ y: exiting ? "-110%" : "0%" }}
          transition={{ duration: counterExit.duration, ease: counterExit.ease, delay: counterExit.at }}
        >
          {String(progress).padStart(3, "0")}%
        </motion.span>
      </div>
      <span className="sr-only" role="status">
        Loading {progress}%
      </span>
    </div>
  );
}

/** Initials (first letter of each word) and a trailing period stay. */
function keptIndices(name: string) {
  const keep = new Set<number>();
  const chars = Array.from(name);
  chars.forEach((c, i) => {
    if (c !== " " && (i === 0 || chars[i - 1] === " ")) keep.add(i);
  });
  if (chars[chars.length - 1] === ".") keep.add(chars.length - 1);
  return keep;
}

/** Horizontal offsets that pack the kept letters together, centered on the name. */
function collapseOffsets(container: HTMLElement | null, letters: Map<number, HTMLSpanElement | null>, keep: Set<number>) {
  if (!container) return {};
  const box = container.getBoundingClientRect();
  const kept = [...keep]
    .sort((a, b) => a - b)
    .map((i) => ({ i, rect: letters.get(i)?.getBoundingClientRect() }))
    .filter((k): k is { i: number; rect: DOMRect } => !!k.rect);
  const total = kept.reduce((w, k) => w + k.rect.width, 0);
  let x = box.left + box.width / 2 - total / 2;
  const out: Record<number, number> = {};
  for (const k of kept) {
    out[k.i] = x - k.rect.left;
    x += k.rect.width;
  }
  return out;
}

/**
 * Visible region of the overlay for curtain progress p (0→1): everything
 * below an edge that travels from top to bottom, bowing downward in the
 * middle mid-way through, flat at both ends.
 */
function curtainPath(p: number, w: number, h: number) {
  const y = p * h;
  const bow = Math.sin(Math.PI * p) * intro.curtain.bulge * h;
  return `path("M0 ${y} Q ${w / 2} ${y + bow * 2} ${w} ${y} L ${w} ${h} L 0 ${h} Z")`;
}
