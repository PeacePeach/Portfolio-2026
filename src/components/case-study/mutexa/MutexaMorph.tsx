"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { animate, motion, useMotionValue, useTransform } from "motion/react";
import { endCaseMorph, morphElapsed, morphTiming as T, type CaseMorph } from "@/lib/caseMorph";
import { BACKGROUND, ROTATION, TILE, cards } from "@/components/scenes/mutexa/track";
import { MutexaHero } from "./MutexaHero";
import { CARD_RADIUS, MUTEXA_HERO, MUTEXA_HERO_MIN_UNIT, MUTEXA_PRIMARY, TILT } from "./hero";

const TILE_RADIUS = 10;
type Rect = { left: number; top: number; width: number; height: number };
const mix = (a: number, b: number, t: number) => a + (b - a) * t;

/**
 * Work tile → Mutexa, on Neo's clock (see CaseMorphLayer): the tile's purple
 * surface grows into the hero band as its gradient settles to the band's
 * flat purple, the Electric Field card rises from the tile's centre at the
 * tile's turn and settles into its place in the hero, and the other cards
 * surface around it.
 */
export function MutexaMorph({ m }: { m: CaseMorph }) {
  const layer = useRef<HTMLDivElement>(null);
  const band = useRef<HTMLDivElement>(null);
  const sceneHost = useRef<HTMLDivElement>(null);
  const target = useRef<Rect>(m.tile);
  const unitRef = useRef(1);
  const [enterAt] = useState(() => morphElapsed(m));
  const [done, setDone] = useState(false);

  const surface = useMotionValue(0);
  const gradient = useMotionValue(1);
  const primary = useMotionValue(0);
  const scene = useMotionValue(1);
  const k = m.tile.width / TILE.width; // tile px → screen px

  const rect = (v: number): Rect => {
    const a = m.tile;
    const b = target.current;
    return { left: mix(a.left, b.left, v), top: mix(a.top, b.top, v), width: mix(a.width, b.width, v), height: mix(a.height, b.height, v) };
  };
  const clipPath = useTransform(surface, (v) => {
    const r = rect(v);
    const w = layer.current?.clientWidth ?? window.innerWidth;
    const h = layer.current?.clientHeight ?? window.innerHeight;
    return `inset(${r.top}px ${w - r.left - r.width}px ${h - r.top - r.height}px ${r.left}px round ${mix(TILE_RADIUS, 0, v)}px)`;
  });
  const gLeft = useTransform(surface, (v) => rect(v).left);
  const gTop = useTransform(surface, (v) => rect(v).top);
  const gWidth = useTransform(surface, (v) => rect(v).width);
  const gHeight = useTransform(surface, (v) => rect(v).height);

  // The card, about its centre: from the tile's centre at the tile card's size and turn, to its place in the hero.
  const startScale = (cards.efield.w * k) / MUTEXA_PRIMARY.w;
  const flight = useTransform(primary, (v) => {
    const b = target.current;
    const u = unitRef.current;
    const stageLeft = b.left + (b.width - MUTEXA_HERO.width * u) / 2;
    const x = mix(m.tile.left + m.tile.width / 2, stageLeft + MUTEXA_PRIMARY.cx * u, v);
    const y = mix(m.tile.top + m.tile.height / 2, b.top + MUTEXA_PRIMARY.cy * u, v);
    return `translate(${x - MUTEXA_PRIMARY.w / 2}px, ${y - MUTEXA_PRIMARY.h / 2}px) rotate(${mix(ROTATION, TILT, v)}deg) scale(${mix(startScale, u, v)})`;
  });
  // It surfaces as the tile's frozen scene fades.
  const primaryOpacity = useTransform(primary, [0, 0.25], [0, 1]);

  useLayoutEffect(() => {
    const el = band.current;
    if (el) {
      const r = el.getBoundingClientRect();
      target.current = { left: r.left, top: r.top, width: r.width, height: r.height };
      unitRef.current = Math.max(r.width / MUTEXA_HERO.width, MUTEXA_HERO_MIN_UNIT);
    }
    if (m.scene && sceneHost.current) sceneHost.current.appendChild(m.scene);
  }, [m.scene]);

  useEffect(() => {
    const at = (d: number) => Math.max(0, d - enterAt);
    const runs = [
      animate(scene, 0, { delay: at(T.sceneFade.delay), duration: T.sceneFade.duration, ease: "easeOut" }),
      animate(surface, 1, { delay: at(T.surface.delay), duration: T.surface.duration, ease: T.ease }),
      animate(gradient, 0, { delay: at(T.gradient.delay), duration: T.gradient.duration, ease: "easeInOut" }),
      animate(primary, 1, { delay: at(T.primary.delay), duration: T.primary.duration, ease: T.ease }),
    ];
    const timer = window.setTimeout(() => setDone(true), at(T.end) * 1000);
    return () => {
      runs.forEach((r) => r.stop());
      window.clearTimeout(timer);
    };
  }, [enterAt, gradient, primary, scene, surface]);

  // Hand over once the motion has settled and the page's hero is in place; never hang on.
  useEffect(() => {
    if (done && m.landed) endCaseMorph();
  }, [done, m.landed]);
  useEffect(() => {
    const t = window.setTimeout(endCaseMorph, 4000);
    return () => window.clearTimeout(t);
  }, []);

  return (
    <div ref={layer} aria-hidden="true" className="pointer-events-none fixed inset-0 z-30">
      <motion.div className="absolute inset-0" style={{ clipPath, background: MUTEXA_HERO.background }}>
        <motion.div
          className="absolute"
          style={{ left: gLeft, top: gTop, width: gWidth, height: gHeight, backgroundImage: BACKGROUND, opacity: gradient }}
        />
        <MutexaHero bandRef={band} paint={false} primary={false} enterAt={enterAt} className="absolute inset-x-0 top-(--spacing-header-bar)" />
        <motion.div
          className="absolute top-0 left-0 overflow-hidden"
          style={{ width: MUTEXA_PRIMARY.w, height: MUTEXA_PRIMARY.h, borderRadius: CARD_RADIUS, transform: flight, opacity: primaryOpacity }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={MUTEXA_PRIMARY.src} alt="" draggable={false} className="block size-full max-w-none object-cover" />
        </motion.div>
        <motion.div ref={sceneHost} className="absolute overflow-hidden" style={{ ...m.tile, borderRadius: TILE_RADIUS, opacity: scene }} />
      </motion.div>
    </div>
  );
}
