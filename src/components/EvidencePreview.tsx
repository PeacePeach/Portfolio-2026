"use client";

import Link from "next/link";
import { AnimatePresence, motion, type Variants } from "motion/react";
import type { Capability } from "@/content/types";
import type { EvidenceItem } from "@/content";
import { swap } from "@/design/motion";
import { Media } from "./ui/Media";
import { ArrowUpRight } from "./ui/Icons";
import { PlaceholderTag } from "./ui/PlaceholderTag";

const list: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: swap.stagger } },
  exit: { opacity: 0, transition: swap.exit },
};

const item: Variants = {
  hidden: { opacity: 0, y: swap.offset },
  show: { opacity: 1, y: 0, transition: swap.enter },
};

/** Evidence for the selected capability, as an editorial list. */
export function EvidencePreview({
  capability,
  items,
  idPrefix,
}: {
  capability: Capability;
  items: EvidenceItem[];
  idPrefix: string;
}) {
  return (
    <div role="tabpanel" id={`${idPrefix}-panel`} aria-labelledby={`${idPrefix}-tab-${capability.id}`}>
      <AnimatePresence mode="wait" initial={false}>
        <motion.div key={capability.id} variants={list} initial="hidden" animate="show" exit="exit">
          <motion.p variants={item} className="max-w-[44ch] pb-10 type-body-l text-secondary md:pt-6">
            {capability.summary}
          </motion.p>

          {items.length === 0 ? (
            <motion.p variants={item} className="border-t border-line py-8 text-tertiary">
              No evidence added for this capability yet.
            </motion.p>
          ) : (
            <ol>
              {items.map((e) => (
                <motion.li key={e.id} variants={item} className="border-t border-line">
                  <EvidenceEntry evidence={e} />
                </motion.li>
              ))}
            </ol>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function EvidenceEntry({ evidence: e }: { evidence: EvidenceItem }) {
  return (
    <article className="group grid grid-cols-1 gap-x-6 gap-y-4 py-8 sm:grid-cols-[1fr_9rem] lg:grid-cols-[1fr_11rem]">
      <div>
        <p className="type-label-s flex flex-wrap items-center gap-x-3 gap-y-2 text-tertiary">
          <span className="text-primary">{e.project.title}</span>
          <span className="text-tertiary">/</span>
          <span>{e.sectionTitle}</span>
          <PlaceholderTag status={e.status} />
        </p>
        <h3 className="mt-4 max-w-[34ch] type-heading-m">{e.title}</h3>
        <p className="mt-3 max-w-[56ch] text-secondary">{e.body}</p>
        <Link
          href={e.href}
          className="group type-label-s mt-5 inline-flex items-center gap-2 text-primary"
          aria-label={`Read “${e.title}” in the ${e.project.title} case study`}
        >
          <span className="hover-underline">
            Read in case study
          </span>
          <ArrowUpRight className="size-3.5" />
        </Link>
      </div>
      {e.image ? (
        <Media
          image={e.image}
          ratio="4 / 3"
          sizes="176px"
          className="order-first w-full max-w-[14rem] sm:order-none sm:max-w-none"
          imageClassName="transition-transform duration-(--duration-image) ease-out-expo group-hover:scale-[1.04]"
        />
      ) : null}
    </article>
  );
}
