"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Send } from "react-feather";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { duration, swap } from "@/design/motion";

type Stage = "prompt" | "loading" | "resolved";

// This outline trace is specific to the story's thinking indicator.
const hOutline = "M12 8H28V32H52V8H68V72H52V48H28V72H12Z";
const thinkingDuration = duration.image + duration.base;

export function NeoEarlyDiscovery() {
  const reduce = useReducedMotion();
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
    <section aria-labelledby="neo-discovery" className="mt-(--spacing-section) pb-24">
      <ScrollReveal>
        <h2 id="neo-discovery" className="type-label-l text-secondary">01 _ EARLY DISCOVERY</h2>
      </ScrollReveal>
      <ScrollReveal as="hr" delay={0.12} className="mt-6 border-0 border-t border-dotted border-line-strong" />

      <div className="mx-auto mt-16 grid max-w-[59.1875rem] grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-24">
        <div>
          <ScrollReveal>
            <p className="type-label-s text-tertiary">WHERE WE WERE STUCK</p>
          </ScrollReveal>
          <ScrollReveal delay={0.12}>
            <h3 className="mt-4 type-display-s text-primary">The Chicken-and-Egg Problem</h3>
          </ScrollReveal>
          <ScrollReveal delay={0.24}>
            <p className="mt-6 type-body-m text-secondary">
              Neo Advance was intended to set the pattern for future lending products, but those products were still undefined. During early concept exploration, the team was split between optimizing for launch and designing for the future, blocking decisions on entry points, account IA, and shared patterns.
            </p>
          </ScrollReveal>
        </div>

        <ScrollReveal delay={0.36} className="min-w-0">
          {/* The same slot holds the prompt, thinking state and resolution. */}
          <div className="min-h-[26rem]">
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
                  <p className="type-label-s text-tertiary">TELL ME ABOUT IT</p>
                  <label htmlFor="neo-discovery-response" className="mt-4 block type-display-xs text-primary">
                    What would you do if you were me?
                  </label>
                  <div className="mt-6 rounded-[10px] border border-line bg-card p-4 transition-colors duration-(--duration-base) ease-out-expo hover:border-line-strong focus-within:border-ink">
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
                      aria-describedby="neo-response-privacy"
                      rows={5}
                      placeholder="Share your thoughts…"
                      className="block w-full resize-y bg-transparent type-body-m text-primary placeholder:text-tertiary"
                    />
                    <div className="mt-4 flex items-center justify-end gap-6">
                      <button
                        type="button"
                        onClick={reveal}
                        className="hover-underline cursor-pointer type-body-s text-secondary transition-colors duration-(--duration-base) ease-out-expo hover:text-primary"
                      >
                        Skip and reveal
                      </button>
                      <button
                        type="submit"
                        disabled={!response.trim()}
                        aria-label="Send response and reveal the story"
                        className="flex size-10 cursor-pointer items-center justify-center rounded-[10px] border border-line bg-card text-secondary transition-colors duration-(--duration-base) ease-out-expo hover:bg-card-hover hover:text-primary active:scale-90 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-card disabled:hover:text-secondary"
                      >
                        <Send size={18} strokeWidth={1.33} aria-hidden />
                      </button>
                    </div>
                  </div>
                  <p id="neo-response-privacy" className="mt-3 type-body-xs text-tertiary">
                    Just for reflection. Your response stays on this page and isn’t saved or sent.
                  </p>
                </motion.form>
              ) : stage === "loading" ? (
                <motion.div
                  key="loading"
                  ref={loading}
                  role="status"
                  tabIndex={-1}
                  className="flex min-h-[26rem] flex-col items-center justify-center gap-6"
                  initial={{ opacity: 0, y: offset }}
                  animate={{ opacity: 1, y: 0, transition: enter }}
                  exit={{ opacity: 0, y: -offset, transition: exit }}
                  onAnimationComplete={() => {
                    if (stage === "loading") loading.current?.focus({ preventScroll: true });
                  }}
                >
                  <p className="type-display-xs text-primary">Here’s what I did ...</p>
                  <svg viewBox="0 0 80 80" className="size-20 text-line-strong" fill="none" aria-hidden="true">
                    <path d={hOutline} stroke="currentColor" strokeWidth="1.5" />
                    {reduce ? (
                      <circle cx="12" cy="8" r="3" fill="var(--color-highlight)" />
                    ) : (
                      <circle r="3" fill="var(--color-highlight)" className="motion-reduce:hidden">
                        <animateMotion path={hOutline} dur={`${thinkingDuration}s`} repeatCount="indefinite" calcMode="paced" />
                      </circle>
                    )}
                  </svg>
                </motion.div>
              ) : (
                <motion.div
                  key="resolved"
                  initial="hidden"
                  animate="shown"
                  variants={{ shown: { transition: { staggerChildren: reduce ? 0 : swap.stagger } } }}
                  onAnimationComplete={() => resolution.current?.focus({ preventScroll: true })}
                >
                  {[
                    <p key="eyebrow" className="type-label-s text-tertiary">HOW I UNBLOCKED</p>,
                    <h3 key="title" ref={resolution} tabIndex={-1} className="mt-4 type-display-s text-primary">
                      Defined the Lending Platform Template
                    </h3>,
                    <p key="body" className="mt-6 type-body-m text-secondary">
                      In 2 days, I benchmarked Neo Advance alongside future lending products—term loans, HELOCs, and mortgages—to identify the common platform patterns they would all need. I then translated those patterns into a reusable template for Neo Advance, aligning 3 product leads and 2 founders on account IA, entry points, and core lending experiences.
                    </p>,
                  ].map((content) => (
                    <motion.div
                      key={content.key}
                      variants={{
                        hidden: { opacity: 0, y: offset },
                        shown: { opacity: 1, y: 0, transition: enter },
                      }}
                    >
                      {content}
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
