"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { PenTool, Send } from "react-feather";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { Reveal } from "@/components/ui/Reveal";
import { duration, reveal as revealMotion, swap } from "@/design/motion";

type Stage = "prompt" | "loading" | "resolved";

// Seven dots form the H; the blue dot follows its two stems and crossbar.
const hTrace = "M10 10V42V26H42V42V10V26H10V10";
const hDots = [[10, 10], [42, 10], [10, 26], [26, 26], [42, 26], [10, 42], [42, 42]];
const thinkingDuration = duration.image + duration.base;

// Scope the supplied Figma values to this section; reuse the semantic styles.
const sectionTokens = {
  "--color-primary": "#F9F9F9",
  "--color-secondary": "#A3A3A3",
  "--color-tertiary": "#A3A3A3",
  "--text-display-s": "32px",
  "--text-display-s--font-weight": "400",
  "--text-label-s--font-weight": "400",
} as CSSProperties;
const dividerDelay = revealMotion.duration + swap.stagger;
const storyDelay = dividerDelay + revealMotion.duration + swap.stagger;

export function NeoEarlyDiscovery() {
  const reduce = useReducedMotion();
  const [entered, setEntered] = useState(false);
  const [response, setResponse] = useState("");
  const [stage, setStage] = useState<Stage>("prompt");
  const resolution = useRef<HTMLHeadingElement>(null);
  const loading = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (stage !== "loading") return;
    const timer = window.setTimeout(
      () => setStage("resolved"),
      (reduce ? duration.fast * 3 : thinkingDuration) * 1000,
    );
    return () => window.clearTimeout(timer);
  }, [stage, reduce]);

  const enter = reduce ? { duration: duration.fast } : swap.enter;
  const exit = reduce ? { duration: duration.fast } : swap.exit;
  const offset = reduce ? 0 : swap.offset;

  function reveal() {
    if (stage === "prompt") setStage("loading");
  }

  return (
    <section aria-labelledby="neo-discovery" style={sectionTokens} className="mx-auto mt-[172px] w-full max-w-[1152px] pb-24">
      <ScrollReveal variant="mask" onReveal={() => setEntered(true)}>
        <h2 id="neo-discovery" className="type-label-s text-secondary">01 _ EARLY DISCOVERY</h2>
      </ScrollReveal>
      <Reveal play={entered} delay={dividerDelay} direction="horizontal" className="mt-3">
        <hr className="border-0 border-t border-dotted border-line-strong" />
      </Reveal>

      <div className="mx-auto mt-12 grid w-full max-w-[400px] grid-cols-1 gap-12 lg:mt-[83.6px] lg:max-w-[881px] lg:grid-cols-[400px_400px] lg:gap-[81px] xl:ml-[131px] xl:mr-0">
        <div className="flex flex-col gap-2.5">
          <ScrollReveal variant="mask" delay={storyDelay}>
            <p className="type-label-s text-secondary">WHERE WE WERE STUCK</p>
          </ScrollReveal>
          <ScrollReveal variant="mask" delay={storyDelay + swap.stagger}>
            <h3 className="type-display-s text-primary">The Chicken-and-Egg Problem</h3>
          </ScrollReveal>
          <ScrollReveal variant="mask" delay={storyDelay + swap.stagger * 2}>
            <p className="type-body-m text-secondary">
              Neo Advance was intended to set the pattern for future lending products, but those products were still undefined. During early concept exploration, the team was split between optimizing for launch and designing for the future, blocking decisions on entry points, account IA, and shared patterns.
            </p>
          </ScrollReveal>
        </div>

        <ScrollReveal variant="mask" delay={storyDelay + swap.stagger * 3} className="min-w-0">
          {/* The same slot holds the prompt, thinking state and resolution. */}
          <div className="min-h-[20rem]">
            <AnimatePresence mode="wait" initial={false}>
              {stage === "prompt" ? (
                <motion.form
                  key="prompt"
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0, y: -offset, transition: exit }}
                  onSubmit={(event) => {
                    event.preventDefault();
                    if (response.trim()) reveal();
                  }}
                >
                  <p className="flex items-center gap-1 type-label-s text-secondary">
                    <PenTool size={16} strokeWidth={1.33} aria-hidden />
                    TELL ME ABOUT IT
                  </p>
                  <label htmlFor="neo-discovery-response" className="mt-3 block type-display-s text-primary">
                    What would you do if you were me?
                  </label>
                  <div className="relative mt-6 h-[120px] w-full rounded-[15px] border border-ink/10 bg-ink/[0.02] transition-colors duration-(--duration-base) ease-out-expo focus-within:border-secondary">
                    <textarea
                      id="neo-discovery-response"
                      value={response}
                      onChange={(event) => setResponse(event.target.value)}
                      onKeyDown={(event) => {
                        if ((event.metaKey || event.ctrlKey) && event.key === "Enter" && !event.nativeEvent.isComposing) {
                          event.preventDefault();
                          if (response.trim()) reveal();
                        }
                      }}
                      placeholder="Share your thoughts…"
                      className="block h-full w-full resize-none rounded-[15px] border-0 bg-transparent px-4 pt-[18px] pb-[52px] type-body-s text-primary placeholder:text-secondary focus-visible:outline-none"
                    />
                    <div className="absolute right-3 bottom-3 flex items-center justify-end gap-4">
                      <button
                        type="button"
                        onClick={reveal}
                        className="hover-underline cursor-pointer type-body-s text-ink/60 transition-colors duration-(--duration-base) ease-out-expo hover:text-primary"
                      >
                        Skip and reveal
                      </button>
                      <button
                        type="submit"
                        disabled={!response.trim()}
                        aria-label="Send response and reveal the story"
                        className={`flex size-8 cursor-pointer items-center justify-center rounded-[5px] text-ink/60 transition-colors duration-(--duration-base) ease-out-expo hover:text-primary active:scale-90 disabled:cursor-not-allowed ${response.trim() ? "bg-line-strong" : "bg-[#323232]"}`}
                      >
                        <Send size={18} strokeWidth={1.33} aria-hidden />
                      </button>
                    </div>
                  </div>
                </motion.form>
              ) : stage === "loading" ? (
                <motion.div
                  key="loading"
                  ref={loading}
                  role="status"
                  tabIndex={-1}
                  className="flex items-center gap-2 focus:outline-none"
                  initial={{ opacity: 0, y: offset }}
                  animate={{ opacity: 1, y: 0, transition: enter }}
                  exit={{ opacity: 0, y: -offset, transition: exit }}
                  onAnimationComplete={() => {
                    if (stage === "loading") loading.current?.focus({ preventScroll: true });
                  }}
                >
                  <svg viewBox="0 0 52 52" className="size-4 shrink-0 text-primary" aria-hidden="true">
                    {hDots.map(([cx, cy]) => <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="5.5" fill="currentColor" />)}
                    {reduce ? (
                      <circle cx="10" cy="10" r="5.5" fill="var(--color-highlight)" />
                    ) : (
                      <circle r="5.5" fill="var(--color-highlight)" className="motion-reduce:hidden">
                        <animateMotion path={hTrace} dur={`${thinkingDuration}s`} repeatCount="indefinite" calcMode="paced" />
                      </circle>
                    )}
                  </svg>
                  <p className="type-body-m-tight text-secondary">Here’s what I did ...</p>
                </motion.div>
              ) : (
                <motion.div
                  key="resolved"
                  className="flex flex-col gap-2.5"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1, transition: enter }}
                  onAnimationComplete={() => resolution.current?.focus({ preventScroll: true })}
                >
                  <Reveal>
                    <p className="type-label-s text-secondary">HOW I UNBLOCKED</p>
                  </Reveal>
                  <Reveal delay={swap.stagger}>
                    <h3 ref={resolution} tabIndex={-1} className="type-display-s text-primary focus:outline-none">
                      Defined the Lending Platform Template
                    </h3>
                  </Reveal>
                  <Reveal delay={swap.stagger * 2}>
                    <p className="type-body-m text-secondary">
                      In 2 days, I benchmarked Neo Advance alongside future lending products—term loans, HELOCs, and mortgages—to identify the common platform patterns they would all need. I then translated those patterns into a reusable template for Neo Advance, aligning 3 product leads and 2 founders on account IA, entry points, and core lending experiences.
                    </p>
                  </Reveal>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
