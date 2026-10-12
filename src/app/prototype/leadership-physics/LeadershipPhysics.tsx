"use client";

import { useEffect, useRef } from "react";

/*
 * Leadership physics: an isolated experiment (not production code, not shared).
 *
 * Four elastic membranes (Ambiguity, Direction, Cohesion, Calibration) drift and
 * deform inside a system-wide Complexity field. Each membrane is a ring of radial
 * springs around a drifting centre: every ring point has a radius that eases toward
 * an organic, slowly changing target and is coupled to its neighbours (rope / water
 * membrane feel). Nodes push ring points outward on contact (local bulge, capped)
 * and are then hard-clamped inside the ring, so they can never escape. When the
 * pressure goes, the springs ease the ring back.
 *
 * Plain Canvas 2D + a small hand-written solver: no new dependency.
 */

const BOUNDARIES = ["Ambiguity", "Direction", "Cohesion", "Calibration"] as const;
const NODES_PER_BOUNDARY = 9;
const RING_POINTS = 72;

// Colours mirror globals.css tokens (canvas cannot read Tailwind classes).
const C = {
  primary: "#f0efec",
  secondary: "#c3c2b8",
  tertiary: "#898782",
  highlight: "#2d54dd",
};

type Ring = {
  label: string;
  ax: number; // home anchor
  ay: number;
  cx: number; // drifting centre
  cy: number;
  R: number;
  rho: Float32Array; // current radius per angle
  vel: Float32Array;
  target: Float32Array;
  harm: { k: number; a: number; w: number; p: number }[];
  drift: { fx: number; fy: number; px: number; py: number };
  pressure: number; // 0..1, for stroke emphasis
};

type Node = {
  ring: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  wander: number; // wander heading
  hot: number; // 0..1 hover/drag blend
};

const TAU = Math.PI * 2;

function rand(seed: number) {
  // deterministic so server/client and reloads look the same
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

/** Radius of a ring at an arbitrary angle, linearly interpolated. */
function rhoAt(ring: Ring, angle: number) {
  let a = angle % TAU;
  if (a < 0) a += TAU;
  const f = (a / TAU) * RING_POINTS;
  const i = Math.floor(f) % RING_POINTS;
  const j = (i + 1) % RING_POINTS;
  const t = f - Math.floor(f);
  return ring.rho[i] * (1 - t) + ring.rho[j] * t;
}

/** Complexity: one smooth, slowly turning vector field over the whole canvas. */
function field(x: number, y: number, t: number, scale: number) {
  const s = 1 / scale;
  const a =
    Math.sin(x * s * 1.3 + t * 0.11) +
    Math.cos(y * s * 1.7 - t * 0.08) +
    Math.sin((x + y) * s * 0.9 + t * 0.05);
  return a * 1.2;
}

export function LeadershipPhysics() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const statsRef = useRef<HTMLPreElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current!;
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    const reduceQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let reduced = reduceQuery.matches;
    const showStats = new URLSearchParams(window.location.search).has("stats");

    let W = 0;
    let H = 0;
    let dpr = 1;
    let unit = 1; // layout scale (px)
    let fontFamily = "sans-serif";
    let rings: Ring[] = [];
    let nodes: Node[] = [];
    let time = 0;

    const pointer = { x: -1e4, y: -1e4, inside: false };
    let hover: Node | null = null;
    let drag: Node | null = null;
    let dragOffset = { x: 0, y: 0 };

    // ---- Layout ------------------------------------------------------------

    function anchors() {
      // 2 x 2 everywhere; on tall portrait screens the cells are tall, so blobs
      // are sized by the short side of each cell.
      const padX = W * 0.06;
      const padTop = H * 0.1;
      const padBottom = H * 0.06;
      const cw = (W - padX * 2) / 2;
      const ch = (H - padTop - padBottom) / 2;
      const R = Math.min(cw, ch) * 0.34;
      const jitter = [
        [-0.05, 0.02],
        [0.04, -0.03],
        [0.03, 0.04],
        [-0.04, -0.02],
      ];
      return BOUNDARIES.map((_, i) => {
        const col = i % 2;
        const row = Math.floor(i / 2);
        return {
          x: padX + cw * (col + 0.5) + jitter[i][0] * cw,
          y: padTop + ch * (row + 0.5) + jitter[i][1] * ch,
          R,
        };
      });
    }

    function build() {
      const rnd = rand(7);
      const a = anchors();
      rings = BOUNDARIES.map((label, i) => {
        const ring: Ring = {
          label,
          ax: a[i].x,
          ay: a[i].y,
          cx: a[i].x,
          cy: a[i].y,
          R: a[i].R,
          rho: new Float32Array(RING_POINTS).fill(a[i].R),
          vel: new Float32Array(RING_POINTS),
          target: new Float32Array(RING_POINTS),
          harm: [2, 3, 4, 5].map((k) => ({
            k,
            a: (0.075 / (k - 1)) * (0.7 + rnd() * 0.6),
            w: (0.12 + rnd() * 0.18) * (rnd() < 0.5 ? -1 : 1),
            p: rnd() * TAU,
          })),
          drift: { fx: 0.05 + rnd() * 0.04, fy: 0.04 + rnd() * 0.04, px: rnd() * TAU, py: rnd() * TAU },
          pressure: 0,
        };
        return ring;
      });
      nodes = [];
      rings.forEach((ring, ri) => {
        for (let n = 0; n < NODES_PER_BOUNDARY; n++) {
          const ang = rnd() * TAU;
          const d = Math.sqrt(rnd()) * ring.R * 0.6;
          nodes.push({
            ring: ri,
            x: ring.cx + Math.cos(ang) * d,
            y: ring.cy + Math.sin(ang) * d,
            vx: 0,
            vy: 0,
            r: ring.R * (0.07 + rnd() * 0.05),
            wander: rnd() * TAU,
            hot: 0,
          });
        }
      });
      updateTargets();
      rings.forEach((r) => r.rho.set(r.target));
    }

    function resize() {
      const rect = wrap.getBoundingClientRect();
      const prevW = W;
      const prevH = H;
      const prevRings = rings.map((r) => ({ cx: r.cx, cy: r.cy, R: r.R }));
      W = Math.max(1, rect.width);
      H = Math.max(1, rect.height);
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      canvas.style.width = `${W}px`;
      canvas.style.height = `${H}px`;
      unit = Math.min(W, H);
      fontFamily = getComputedStyle(document.body).fontFamily || "sans-serif";

      if (!rings.length || !prevW || !prevH) {
        build();
        return;
      }
      // Rescale the live system around each ring's centre instead of rebuilding.
      const a = anchors();
      rings.forEach((ring, i) => {
        const k = a[i].R / prevRings[i].R;
        ring.ax = a[i].x;
        ring.ay = a[i].y;
        ring.R = a[i].R;
        ring.cx = a[i].x;
        ring.cy = a[i].y;
        for (let p = 0; p < RING_POINTS; p++) ring.rho[p] *= k;
      });
      nodes.forEach((n) => {
        const o = prevRings[n.ring];
        const ring = rings[n.ring];
        const k = ring.R / o.R;
        n.x = ring.cx + (n.x - o.cx) * k;
        n.y = ring.cy + (n.y - o.cy) * k;
        n.r *= k;
      });
      updateTargets();
    }

    // ---- Physics -----------------------------------------------------------

    function updateTargets() {
      const t = reduced ? 0 : time;
      for (const ring of rings) {
        const dx = Math.sin(t * ring.drift.fx + ring.drift.px) * ring.R * 0.1;
        const dy = Math.cos(t * ring.drift.fy + ring.drift.py) * ring.R * 0.08;
        ring.cx = ring.ax + dx;
        ring.cy = ring.ay + dy;
        for (let i = 0; i < RING_POINTS; i++) {
          const th = (i / RING_POINTS) * TAU;
          let m = 1;
          for (const h of ring.harm) m += h.a * Math.sin(h.k * th + h.w * t + h.p);
          ring.target[i] = ring.R * m;
        }
      }
    }

    function step(dt: number) {
      if (!reduced) time += dt;
      updateTargets();

      // Ring springs: toward organic target + neighbour coupling (rope tension).
      const kTarget = 9;
      const kNeighbour = 140;
      const damping = 4.2;
      for (const ring of rings) {
        const { rho, vel, target } = ring;
        for (let i = 0; i < RING_POINTS; i++) {
          const l = rho[(i - 1 + RING_POINTS) % RING_POINTS];
          const r = rho[(i + 1) % RING_POINTS];
          const acc = kTarget * (target[i] - rho[i]) + kNeighbour * (l + r - 2 * rho[i]) - damping * vel[i];
          vel[i] += acc * dt;
        }
        for (let i = 0; i < RING_POINTS; i++) rho[i] += vel[i] * dt;
        ring.pressure *= Math.exp(-dt * 3);
      }

      // Nodes: wander + Complexity field + drag.
      const fieldScale = unit * 0.18;
      const wanderForce = unit * 0.012;
      const fieldForce = reduced ? 0 : unit * 0.01;
      const nodeDamping = reduced ? 3.5 : 1.2;
      const maxSpeed = unit * 0.06;
      for (const n of nodes) {
        if (n === drag) {
          const tx = pointer.x + dragOffset.x;
          const ty = pointer.y + dragOffset.y;
          // critically damped follow, so collisions still see a real velocity
          n.vx = (tx - n.x) * 18;
          n.vy = (ty - n.y) * 18;
        } else {
          if (!reduced) {
            n.wander += (Math.sin(time * 0.7 + n.r) * 0.6 + (Math.random() - 0.5) * 1.5) * dt;
            n.vx += Math.cos(n.wander) * wanderForce * dt;
            n.vy += Math.sin(n.wander) * wanderForce * dt;
            const f = field(n.x, n.y, time, fieldScale);
            n.vx += Math.cos(f) * fieldForce * dt;
            n.vy += Math.sin(f) * fieldForce * dt;
          }
          n.vx -= n.vx * nodeDamping * dt;
          n.vy -= n.vy * nodeDamping * dt;
          const sp = Math.hypot(n.vx, n.vy);
          if (sp > maxSpeed) {
            n.vx *= maxSpeed / sp;
            n.vy *= maxSpeed / sp;
          }
        }
        n.x += n.vx * dt;
        n.y += n.vy * dt;
      }

      // Node-node collisions (all pairs; 36 nodes = 630 pairs, trivial).
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j];
          const dx = b.x - a.x;
          const dy = b.y - a.y;
          const min = a.r + b.r;
          const d2 = dx * dx + dy * dy;
          if (d2 >= min * min || d2 === 0) continue;
          const d = Math.sqrt(d2);
          const nx = dx / d;
          const ny = dy / d;
          const overlap = min - d;
          // dragged node behaves as infinite mass
          const wa = a === drag ? 0 : b === drag ? 1 : 0.5;
          const wb = b === drag ? 0 : a === drag ? 1 : 0.5;
          a.x -= nx * overlap * wa;
          a.y -= ny * overlap * wa;
          b.x += nx * overlap * wb;
          b.y += ny * overlap * wb;
          const rel = (b.vx - a.vx) * nx + (b.vy - a.vy) * ny;
          if (rel < 0) {
            const imp = -(1 + 0.6) * rel;
            a.vx -= nx * imp * wa;
            a.vy -= ny * imp * wa;
            b.vx += nx * imp * wb;
            b.vy += ny * imp * wb;
          }
        }
      }

      // Node vs membrane: push ring out locally (capped bulge), then hard clamp.
      const pad = 2;
      for (const n of nodes) {
        const ring = rings[n.ring];
        const dx = n.x - ring.cx;
        const dy = n.y - ring.cy;
        const d = Math.hypot(dx, dy) || 0.0001;
        const ang = Math.atan2(dy, dx);
        const need = d + n.r + pad;
        const have = rhoAt(ring, ang);
        if (need > have) {
          const pen = need - have;
          // A dragged node presses the membrane out; a free node mostly gets
          // pushed back in, so the membrane can relax once the hand lets go.
          const yieldShare = n === drag ? 0.85 : 0.3;
          const sigma = (n.r * 2.4) / Math.max(d, n.r); // angular width of the bulge
          const span = Math.ceil((sigma * 2.5 * RING_POINTS) / TAU);
          const centre = (ang / TAU) * RING_POINTS;
          const c0 = Math.round(centre);
          for (let o = -span; o <= span; o++) {
            const idx = (((c0 + o) % RING_POINTS) + RING_POINTS) % RING_POINTS;
            const da = ((c0 + o - centre) / RING_POINTS) * TAU;
            const g = Math.exp(-(da * da) / (sigma * sigma));
            const cap = ring.target[idx] + ring.R * 0.38;
            ring.rho[idx] = Math.min(cap, ring.rho[idx] + pen * g * yieldShare);
            if (n === drag && ring.vel[idx] < 0) ring.vel[idx] *= 1 - g * 0.6;
          }
          ring.pressure = Math.min(1, ring.pressure + pen / ring.R);
        }
        // Hard containment: whatever the ring did, the node stays inside it.
        const limit = rhoAt(ring, ang) - n.r - pad;
        if (d > limit) {
          const ux = dx / d;
          const uy = dy / d;
          n.x = ring.cx + ux * limit;
          n.y = ring.cy + uy * limit;
          const vn = n.vx * ux + n.vy * uy;
          if (vn > 0) {
            n.vx -= vn * ux * 1.3;
            n.vy -= vn * uy * 1.3;
          }
        }
      }
    }

    // ---- Drawing -----------------------------------------------------------

    function ringPoint(ring: Ring, i: number, extra = 0) {
      const th = (i / RING_POINTS) * TAU;
      const r = ring.rho[((i % RING_POINTS) + RING_POINTS) % RING_POINTS] + extra;
      return [ring.cx + Math.cos(th) * r, ring.cy + Math.sin(th) * r] as const;
    }

    function tracePath(ring: Ring) {
      // Smooth closed curve through midpoints.
      const [x0, y0] = ringPoint(ring, 0);
      const [x1, y1] = ringPoint(ring, 1);
      ctx.moveTo((x0 + x1) / 2, (y0 + y1) / 2);
      for (let i = 1; i <= RING_POINTS; i++) {
        const [cx, cy] = ringPoint(ring, i);
        const [nx, ny] = ringPoint(ring, i + 1);
        ctx.quadraticCurveTo(cx, cy, (cx + nx) / 2, (cy + ny) / 2);
      }
      ctx.closePath();
    }

    function drawField() {
      const spacing = Math.max(26, unit * 0.045);
      const len = spacing * 0.32;
      const scale = unit * 0.18;
      ctx.beginPath();
      for (let y = spacing / 2; y < H; y += spacing) {
        for (let x = spacing / 2; x < W; x += spacing) {
          const f = field(x, y, reduced ? 0 : time, scale);
          const cx = Math.cos(f) * len;
          const cy = Math.sin(f) * len;
          ctx.moveTo(x - cx, y - cy);
          ctx.lineTo(x + cx, y + cy);
        }
      }
      ctx.strokeStyle = "rgba(195,194,184,0.07)";
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.fillStyle = C.tertiary;
      ctx.font = `500 11px ${fontFamily}`;
      ctx.textBaseline = "top";
      ctx.textAlign = "left";
      ctx.fillText("COMPLEXITY", Math.max(16, W * 0.03), Math.max(16, H * 0.03));
      ctx.fillStyle = "rgba(137,135,130,0.6)";
      ctx.fillText("system-wide field", Math.max(16, W * 0.03), Math.max(16, H * 0.03) + 15);
    }

    function drawLabel(ring: Ring, index: number) {
      // Letters walk along the contour, a few px outside it, centred near the top.
      const text = ring.label.toUpperCase();
      ctx.font = `500 11px ${fontFamily}`;
      ctx.fillStyle = ring.pressure > 0.05 ? C.secondary : C.tertiary;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      const tracking = 1.5;
      const widths = [...text].map((ch) => ctx.measureText(ch).width + tracking);
      const total = widths.reduce((s, w) => s + w, 0);
      const anchor = -Math.PI / 2 + (index % 2 ? 0.35 : -0.35);
      const off = 11;
      const rTop = rhoAt(ring, anchor) + off;
      let ang = anchor - total / 2 / rTop;
      for (let i = 0; i < text.length; i++) {
        const r = rhoAt(ring, ang) + off;
        const half = widths[i] / 2 / r;
        ang += half;
        const rr = rhoAt(ring, ang) + off;
        const x = ring.cx + Math.cos(ang) * rr;
        const y = ring.cy + Math.sin(ang) * rr;
        // tangent from neighbouring contour samples
        const e = 0.02;
        const ra = rhoAt(ring, ang - e) + off;
        const rb = rhoAt(ring, ang + e) + off;
        const tx = Math.cos(ang + e) * rb - Math.cos(ang - e) * ra;
        const ty = Math.sin(ang + e) * rb - Math.sin(ang - e) * ra;
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(Math.atan2(ty, tx));
        ctx.fillText(text[i], 0, 0);
        ctx.restore();
        ang += half;
      }
    }

    function draw() {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);
      drawField();

      rings.forEach((ring, i) => {
        ctx.beginPath();
        tracePath(ring);
        ctx.fillStyle = "rgba(255,255,255,0.025)";
        ctx.fill();
        const p = Math.min(1, ring.pressure * 4);
        ctx.strokeStyle = `rgba(195,194,184,${0.38 + p * 0.4})`;
        ctx.lineWidth = 1 + p * 0.5;
        ctx.stroke();
        drawLabel(ring, i);
      });

      for (const n of nodes) {
        const target = n === hover || n === drag ? 1 : 0;
        n.hot += (target - n.hot) * (reduced ? 1 : 0.25);
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, TAU);
        if (n.hot > 0.01) {
          ctx.fillStyle = `rgba(45,84,221,${n.hot})`;
          ctx.fill();
        }
        ctx.strokeStyle = n.hot > 0.5 ? C.highlight : "rgba(240,239,236,0.7)";
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    }

    // ---- Input -------------------------------------------------------------

    function local(e: { clientX: number; clientY: number }) {
      const rect = canvas.getBoundingClientRect();
      return { x: e.clientX - rect.left, y: e.clientY - rect.top };
    }

    function hit(x: number, y: number, slop = 0) {
      for (let i = nodes.length - 1; i >= 0; i--) {
        const n = nodes[i];
        if (Math.hypot(n.x - x, n.y - y) <= n.r + slop) return n;
      }
      return null;
    }

    function onPointerMove(e: PointerEvent) {
      const p = local(e);
      pointer.x = p.x;
      pointer.y = p.y;
      pointer.inside = true;
      if (!drag) hover = e.pointerType === "mouse" ? hit(p.x, p.y) : null;
      canvas.style.cursor = drag ? "grabbing" : hover ? "grab" : "default";
    }

    function onPointerDown(e: PointerEvent) {
      const p = local(e);
      const n = hit(p.x, p.y, e.pointerType === "mouse" ? 0 : 10);
      if (!n) return;
      drag = n;
      hover = n;
      pointer.x = p.x;
      pointer.y = p.y;
      dragOffset = { x: n.x - p.x, y: n.y - p.y };
      canvas.setPointerCapture(e.pointerId);
      canvas.style.cursor = "grabbing";
    }

    function onPointerUp(e: PointerEvent) {
      if (drag && canvas.hasPointerCapture(e.pointerId)) canvas.releasePointerCapture(e.pointerId);
      drag = null;
      if (e.pointerType !== "mouse") hover = null;
      canvas.style.cursor = "default";
    }

    function onPointerLeave() {
      if (!drag) hover = null;
    }

    // Touch: only block page scroll when the touch starts on a node.
    function onTouchStart(e: TouchEvent) {
      const t = e.touches[0];
      if (!t) return;
      const p = local(t);
      if (hit(p.x, p.y, 10)) e.preventDefault();
    }

    canvas.addEventListener("pointermove", onPointerMove);
    canvas.addEventListener("pointerdown", onPointerDown);
    canvas.addEventListener("pointerup", onPointerUp);
    canvas.addEventListener("pointercancel", onPointerUp);
    canvas.addEventListener("pointerleave", onPointerLeave);
    canvas.addEventListener("touchstart", onTouchStart, { passive: false });

    const onReduce = () => {
      reduced = reduceQuery.matches;
    };
    reduceQuery.addEventListener("change", onReduce);

    const ro = new ResizeObserver(resize);
    ro.observe(wrap);
    resize();

    // ---- Loop --------------------------------------------------------------

    let raf = 0;
    let last = performance.now();
    let visible = true;
    const frameTimes: number[] = [];
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible && !raf) {
        last = performance.now();
        raf = requestAnimationFrame(frame);
      }
    });
    io.observe(wrap);

    function frame(now: number) {
      raf = 0;
      if (!visible) return;
      const dt = Math.min((now - last) / 1000, 1 / 30);
      last = now;
      const t0 = performance.now();
      const sub = 3;
      for (let s = 0; s < sub; s++) step(dt / sub);
      draw();
      if (showStats && statsRef.current) {
        frameTimes.push(performance.now() - t0);
        if (frameTimes.length > 60) frameTimes.shift();
        const avg = frameTimes.reduce((a, b) => a + b, 0) / frameTimes.length;
        statsRef.current.textContent = `work ${avg.toFixed(2)} ms/frame\nreduced ${reduced}`;
      }
      raf = requestAnimationFrame(frame);
    }
    raf = requestAnimationFrame(frame);

    // test hook for the prototype screenshots
    (window as unknown as { __lp?: unknown }).__lp = { get nodes() { return nodes; }, get rings() { return rings; } };

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      reduceQuery.removeEventListener("change", onReduce);
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerdown", onPointerDown);
      canvas.removeEventListener("pointerup", onPointerUp);
      canvas.removeEventListener("pointercancel", onPointerUp);
      canvas.removeEventListener("pointerleave", onPointerLeave);
      canvas.removeEventListener("touchstart", onTouchStart);
    };
  }, []);

  return (
    <div ref={wrapRef} className="absolute inset-0">
      <canvas
        ref={canvasRef}
        className="block"
        role="img"
        aria-label="Prototype: four elastic boundaries named Ambiguity, Direction, Cohesion and Calibration, each holding draggable nodes, inside a system-wide Complexity field."
      />
      <pre ref={statsRef} className="pointer-events-none absolute right-4 bottom-4 type-body-xs text-tertiary" />
    </div>
  );
}
