"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { X } from "react-feather";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { neoAdvanceNarrative as panels } from "@/content/neoAdvance";
import { duration, swap } from "@/design/motion";

type Panel = (typeof panels)[number];

const typography = {
  "--color-primary": "#F9F9F9",
  "--color-secondary": "#A3A3A3",
  "--text-display-s": "32px",
  "--text-display-s--font-weight": "400",
} as CSSProperties;

export function NeoNarrative() {
  const reduce = useReducedMotion();
  const [desktop, setDesktop] = useState(false);
  const [active, setActive] = useState(0);
  const [opened, setOpened] = useState<Panel | null>(null);
  const stack = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    const query = window.matchMedia("(min-width: 1024px)");
    const update = () => setDesktop(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (!desktop) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const bounds = Array.from(stack.current?.children ?? []).map(node => node.getBoundingClientRect());
      if (!bounds.length) return;
      const center = window.innerHeight / 2;
      setActive(current => {
        // Keep the current narrative until its panel leaves the 45–55% band.
        const rect = bounds[current];
        if (rect.bottom >= center * 0.9 && rect.top <= center * 1.1) return current;
        const next = bounds.findIndex(rect => rect.top <= center && rect.bottom > center);
        return next >= 0 ? next : bounds[0].top > center ? 0 : bounds.length - 1;
      });
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    const observer = new ResizeObserver(schedule);
    if (stack.current) observer.observe(stack.current);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [desktop]);

  function close() {
    setOpened(null);
    trigger.current?.focus({ preventScroll: true });
  }

  return (
    // End space lets the final short panel reach the center activation band.
    <section aria-label="Lending platform research and frameworks" style={typography} className="mx-auto w-full max-w-[1152px] pb-24 lg:pb-[max(6rem,50svh)]">
      <ScrollReveal as="hr" className="mb-12 border-0 border-t border-dotted border-line-strong" />
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,353fr)_minmax(0,680fr)] lg:gap-x-[119px]">
        <div className="hidden min-w-0 self-start lg:sticky lg:top-[calc(var(--spacing-header)+1.875rem)] lg:block" data-neo-sticky>
          <ScrollReveal variant="mask">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={panels[active].id}
                initial={{ opacity: 0, y: reduce ? 0 : swap.offset }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: reduce ? 0 : -swap.offset, transition: reduce ? { duration: duration.fast } : swap.exit }}
                transition={reduce ? { duration: duration.fast } : swap.enter}
              >
                <Narrative panel={panels[active]} />
              </motion.div>
            </AnimatePresence>
          </ScrollReveal>
        </div>
        <div ref={stack} className="min-w-0" data-neo-panels>
          {panels.map(panel => (
            <VisualPanel key={panel.id} panel={panel} scaleEnabled={desktop && !reduce} onOpen={button => {
              trigger.current = button;
              setOpened(panel);
            }} />
          ))}
        </div>
      </div>
      {opened && createPortal(<ImageViewer panel={opened} onClose={close} />, document.body)}
    </section>
  );
}

function Narrative({ panel }: { panel: Panel }) {
  return (
    <div className="flex flex-col gap-2.5">
      <h3 className="type-display-s text-primary">{panel.title}</h3>
      <p className="type-body-m text-secondary">{panel.subtitle}</p>
    </div>
  );
}

function VisualPanel({ panel, scaleEnabled, onOpen }: {
  panel: Panel;
  scaleEnabled: boolean;
  onOpen: (button: HTMLButtonElement) => void;
}) {
  const target = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target, offset: ["start center", "end center"] });
  const scale = useTransform(scrollYProgress, [0, 0.15, 1], [1, 1, 0.97]);
  return (
    <div ref={target} data-neo-panel={panel.id} className="mb-12 lg:mb-0">
      <ScrollReveal variant="mask" className="mb-6 lg:hidden">
        <Narrative panel={panel} />
      </ScrollReveal>
      <motion.button
        type="button"
        aria-label={`View ${panel.title} in high resolution`}
        aria-haspopup="dialog"
        onClick={event => onOpen(event.currentTarget)}
        style={{ scale: scaleEnabled ? scale : 1 }}
        className={`block w-full cursor-zoom-in overflow-hidden bg-surface text-left motion-reduce:transform-none! ${panel.id === panels[0].id ? "rounded-t-[20px]" : panel.id === panels[panels.length - 1].id ? "rounded-b-[20px]" : ""}`}
      >
        <Image
          src={`/images/neo/${panel.id}.webp`}
          alt={panel.alt}
          width={panel.width}
          height={panel.height}
          unoptimized
          className="block h-auto w-full"
        />
      </motion.button>
    </div>
  );
}

function ImageViewer({ panel, onClose }: { panel: Panel; onClose: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const reduce = useReducedMotion();
  function closeViewer() {
    // Release native modality before returning focus to the page trigger.
    dialog.current?.close();
    onClose();
  }
  useEffect(() => {
    const node = dialog.current;
    const overflow = document.body.style.overflow;
    node?.showModal();
    document.body.style.overflow = "hidden";
    return () => {
      node?.close();
      document.body.style.overflow = overflow;
    };
  }, []);

  return (
    <dialog
      ref={dialog}
      aria-label={`${panel.title} — high-resolution image`}
      onCancel={event => { event.preventDefault(); closeViewer(); }}
      onKeyDown={event => {
        // The close button is the viewer's sole focusable control.
        if (event.key === "Tab") {
          event.preventDefault();
          event.currentTarget.querySelector("button")?.focus();
        }
      }}
      onClick={event => { if (event.target === event.currentTarget) closeViewer(); }}
      className="fixed inset-0 m-0 h-dvh max-h-none w-screen max-w-none border-0 bg-transparent p-6 text-primary backdrop:bg-background/90 open:flex open:items-center open:justify-center"
    >
      <button type="button" autoFocus aria-label="Close image viewer" onClick={closeViewer} className="absolute top-4 right-4 flex size-8 cursor-pointer items-center justify-center rounded-[5px] bg-[#323232] text-ink/60 transition-colors duration-(--duration-base) ease-out-expo hover:text-primary active:scale-90">
        <X size={18} strokeWidth={1.33} aria-hidden />
      </button>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={reduce ? { duration: duration.fast } : swap.enter} className="pointer-events-none flex max-h-full max-w-full items-center justify-center">
        <Image
          src={`/images/neo/${panel.id}-full.webp`}
          alt={panel.alt}
          width={panel.fullWidth}
          height={panel.fullHeight}
          unoptimized
          loading="eager"
          className="pointer-events-auto block h-auto max-h-[calc(100dvh-6rem)] w-auto max-w-full object-contain"
        />
      </motion.div>
    </dialog>
  );
}
