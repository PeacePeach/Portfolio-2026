import type { Metadata } from "next";
import { CaseStudySectionHeader } from "@/components/case-study/shared/CaseStudySectionHeader";
import { LeadershipPhysics } from "./LeadershipPhysics";

export const metadata: Metadata = { title: "Leadership physics (prototype)", robots: { index: false } };

/**
 * Isolated sizing/layout experiment, not linked from the site; do not reuse yet.
 * Real page frame: 72 px header bar, page margins (64 px at 1280), 1152 content.
 */
export default function LeadershipPhysicsPrototype() {
  return (
    <>
      {/* Header placeholder at the real bar height. */}
      <div className="fixed inset-x-0 top-0 z-40 bg-background">
        <div className="container-page flex h-header-bar items-center justify-between">
          <span className="type-brand uppercase text-primary">HX</span>
          <span className="type-body-xs uppercase text-tertiary">Nav placeholder</span>
        </div>
      </div>

      <main id="main" className="container-page pt-[calc(var(--spacing-header)+3rem)] pb-section">
        <section aria-labelledby="momentum" className="mx-auto w-full max-w-[1152px]">
          <CaseStudySectionHeader
            id="momentum"
            title="How I Turn Ambiguity Into Momentum"
            description="Leadership here is a set of elastic boundaries, not boxes. Each one holds its own work, flexes under pressure and settles back, while complexity runs through all of them."
          />
          <div className="relative mt-16 h-[calc((100vw-2*var(--spacing-margin))*3.3)] w-full sm:h-[calc((100vw-2*var(--spacing-margin))*0.9)] lg:h-[clamp(600px,50vw,680px)]">
            <LeadershipPhysics />
          </div>
        </section>
      </main>
    </>
  );
}
