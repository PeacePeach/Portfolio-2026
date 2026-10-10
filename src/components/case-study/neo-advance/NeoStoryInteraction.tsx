"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Send } from "react-feather";
import { CaseStudyChapterHeader } from "../shared/CaseStudyChapterHeader";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { duration, swap } from "@/design/motion";

type Stage = "prompt" | "loading" | "resolved";

// Seven dots form the H; the blue dot follows its two stems and crossbar.
const hTrace = "M10 10V42V26H42V42V10V26H10V10";
const hDots = [[10, 10], [42, 10], [10, 26], [26, 26], [42, 26], [10, 42], [42, 42]];
const thinkingDuration = duration.image + duration.base;

type StoryProps = {
  id: string;
  chapter: string;
  problemTitle: string;
  problemBody: string;
  resolutionTitle: string;
  resolutionBody: string;
  className?: string;
  children?: React.ReactNode;
};

export function NeoStoryInteraction({ id, chapter, problemTitle, problemBody, resolutionTitle, resolutionBody, className = "", children }: StoryProps) {
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
    <section aria-labelledby={id} data-stage={stage} className={`mt-(--spacing-section) pb-24 ${className}`}>
      <CaseStudyChapterHeader id={id} labelClassName="type-label-l text-secondary">{chapter}</CaseStudyChapterHeader>

      <div className="neo-story-grid mx-auto mt-16 grid max-w-[59.1875rem] grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-24">
        <div>
          <ScrollReveal>
            <p className="type-label-s text-tertiary">WHERE WE WERE STUCK</p>
          </ScrollReveal>
          <ScrollReveal delay={0.12}>
            <h3 className="mt-4 type-display-s text-primary">{problemTitle}</h3>
          </ScrollReveal>
          <ScrollReveal delay={0.24}>
            <p className="mt-6 type-body-m text-secondary">
              {problemBody}
            </p>
          </ScrollReveal>
        </div>

        <ScrollReveal delay={0.36} className="min-w-0">
          {/* The same slot holds the prompt, thinking state and resolution. */}
          <div className="neo-story-slot min-h-[26rem]">
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
                  <label htmlFor={`${id}-response`} className="mt-4 block type-display-xs text-primary">
                    What would you do if you were me?
                  </label>
                  <div className="mt-6 rounded-[10px] border border-line bg-card p-4 transition-colors duration-(--duration-base) ease-out-expo hover:border-line-strong focus-within:border-ink">
                    <textarea
                      id={`${id}-response`}
                      value={response}
                      onChange={(event) => setResponse(event.target.value)}
                      onKeyDown={(event) => {
                        if ((event.metaKey || event.ctrlKey) && event.key === "Enter" && !event.nativeEvent.isComposing) {
                          event.preventDefault();
                          if (response.trim()) reveal();
                        }
                      }}
                      aria-describedby={`${id}-privacy`}
                      rows={5}
                      placeholder="Share your thoughts…"
                      className="block w-full resize-y border-0 bg-transparent type-body-m text-primary placeholder:text-tertiary focus-visible:outline-none"
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
                  <p id={`${id}-privacy`} className="mt-3 type-body-xs text-tertiary">
                    Just for reflection. Your response stays on this page and isn’t saved or sent.
                  </p>
                </motion.form>
              ) : stage === "loading" ? (
                <motion.div
                  key="loading"
                  ref={loading}
                  role="status"
                  tabIndex={-1}
                  className="flex min-h-[26rem] items-center justify-center gap-4 sm:gap-6"
                  initial={{ opacity: 0, y: offset }}
                  animate={{ opacity: 1, y: 0, transition: enter }}
                  exit={{ opacity: 0, y: -offset, transition: exit }}
                  onAnimationComplete={() => {
                    if (stage === "loading") loading.current?.focus({ preventScroll: true });
                  }}
                >
                  <svg viewBox="0 0 52 52" className="size-10 shrink-0 text-primary sm:size-12" aria-hidden="true">
                    {hDots.map(([cx, cy]) => <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="5.5" fill="currentColor" />)}
                    {reduce ? (
                      <circle cx="10" cy="10" r="5.5" fill="var(--color-highlight)" />
                    ) : (
                      <circle r="5.5" fill="var(--color-highlight)" className="motion-reduce:hidden">
                        <animateMotion path={hTrace} dur={`${thinkingDuration}s`} repeatCount="indefinite" calcMode="paced" />
                      </circle>
                    )}
                  </svg>
                  <p className="border-b border-highlight type-heading-l font-normal! text-secondary">Here’s what I did ...</p>
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
                      {resolutionTitle}
                    </h3>,
                    <p key="body" className="mt-6 type-body-m text-secondary">
                      {resolutionBody}
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
      {children}
    </section>
  );
}
