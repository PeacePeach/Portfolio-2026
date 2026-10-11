"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { animate, motion, useMotionValue, useTransform } from "motion/react";
import { endCaseMorph, morphElapsed, morphTiming as T, type CaseMorph } from "@/lib/caseMorph";
import { BeaconAnalyticsAnimation } from "@/components/scenes/beacon-analytics/BeaconAnalyticsAnimation";
import { TILE, doneAt } from "@/components/scenes/beacon-analytics/timeline";
import { HERO_MIN_UNIT } from "../neo-advance/hero";
import { ANALYTICS_HERO, ANALYTICS_PRIMARY, AnalyticsHero, ISO } from "./AnalyticsHero";

const TILE_RADIUS = 10;
type Rect = { left: number; top: number; width: number; height: number };
const mix = (a: number, b: number, t: number) => a + (b - a) * t;

/**
 * Work tile → Reimagining Analytics, on Neo's clock (see CaseMorphLayer):
 * the tile's light-blue surface grows into the hero band, the Views card
 * travels to the band's centre, growing and tilting into the isometric
 * scene, and the desktop, phone and other cards build up around it. The tile's live frame fades into the finished
 * card as it leaves.
 */
export function AnalyticsMorph({ m }: { m: CaseMorph }) {
  const layer = useRef<HTMLDivElement>(null);
  const band = useRef<HTMLDivElement>(null);
  const sceneHost = useRef<HTMLDivElement>(null);
  const target = useRef<Rect>(m.tile);
  const unit = useRef(1);
  const [enterAt] = useState(() => morphElapsed(m));
  const [done, setDone] = useState(false);

  const surface = useMotionValue(0);
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
  // The tile scene, about its centre: from the tile, flat, to its place in the band, tilted into the scene.
  const flight = useTransform(primary, (v) => {
    const b = target.current;
    const u = unit.current;
    const stageLeft = b.left + (b.width - ANALYTICS_HERO.width * u) / 2;
    const cx = mix(m.tile.left + m.tile.width / 2, stageLeft + ANALYTICS_PRIMARY.x * u, v);
    const cy = mix(m.tile.top + m.tile.height / 2, b.top + ANALYTICS_PRIMARY.y * u, v);
    const s = mix(k, ANALYTICS_PRIMARY.scale * u, v);
    return `translate(${cx - TILE.width / 2}px, ${cy - TILE.height / 2}px) scale(${s}) rotateX(${ISO.tip * v}deg) rotateZ(${ISO.turn * v}deg)`;
  });

  useLayoutEffect(() => {
    const el = band.current;
    if (el) {
      const r = el.getBoundingClientRect();
      target.current = { left: r.left, top: r.top, width: r.width, height: r.height };
      unit.current = Math.max(r.width / ANALYTICS_HERO.width, HERO_MIN_UNIT);
    }
    if (m.scene && sceneHost.current) sceneHost.current.appendChild(m.scene);
  }, [m.scene]);

  useEffect(() => {
    const at = (d: number) => Math.max(0, d - enterAt);
    const runs = [
      animate(scene, 0, { delay: at(T.primary.delay), duration: T.sceneFade.duration * 2, ease: "easeOut" }),
      animate(surface, 1, { delay: at(T.surface.delay), duration: T.surface.duration, ease: T.ease }),
      animate(primary, 1, { delay: at(T.primary.delay), duration: T.primary.duration, ease: T.ease }),
    ];
    const timer = window.setTimeout(() => setDone(true), at(T.end) * 1000);
    return () => {
      runs.forEach((r) => r.stop());
      window.clearTimeout(timer);
    };
  }, [enterAt, primary, scene, surface]);

  useEffect(() => {
    if (done && m.landed) endCaseMorph();
  }, [done, m.landed]);
  useEffect(() => {
    const t = window.setTimeout(endCaseMorph, 4000);
    return () => window.clearTimeout(t);
  }, []);

  return (
    <div ref={layer} aria-hidden="true" className="pointer-events-none fixed inset-0 z-30">
      <motion.div className="absolute inset-0" style={{ clipPath, background: ANALYTICS_HERO.blue }}>
        <AnalyticsHero bandRef={band} blue={false} primary={false} enterAt={enterAt} className="absolute inset-x-0 top-(--spacing-header-bar)" />
        <motion.div
          className="absolute top-0 left-0"
          style={{ width: TILE.width, height: TILE.height, transform: flight }}
        >
          <BeaconAnalyticsAnimation at={doneAt} rounded={false} bare />
          <motion.div
            ref={sceneHost}
            className="absolute top-0 left-0 origin-top-left overflow-hidden"
            style={{ width: m.tile.width, height: m.tile.height, scale: 1 / k, opacity: scene }}
          />
        </motion.div>
      </motion.div>
    </div>
  );
}
