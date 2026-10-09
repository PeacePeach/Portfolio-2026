import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { SceneStage } from "@/components/scenes/SceneStage";
import { BeaconAnalyticsAnimation } from "@/components/scenes/beacon-analytics/BeaconAnalyticsAnimation";
import { BeaconAnalyticsScrubber } from "@/components/scenes/beacon-analytics/BeaconAnalyticsScrubber";
import { TILE, doneAt } from "@/components/scenes/beacon-analytics/timeline";
import { site } from "@/content/site";

export const metadata: Metadata = { title: `Beacon Analytics scene — ${site.name}`, robots: { index: false } };

/**
 * Review sheet for the Beacon Analytics tile animation (Figma 41:23982): the
 * loop, a scrubber, and the finished card. Not linked.
 */
export default function BeaconAnalyticsScenePage() {
  return (
    <>
      <Header />
      <main id="main" className="container-page pt-[calc(var(--spacing-header)+3rem)] pb-section">
        <h1 className="type-display-m">Beacon Analytics scene</h1>
        <p className="mt-4 max-w-[60ch] type-body-m text-ink-muted">
          Figma 41:23982, “Animation _ Brightcove insights”. The Views card holds still while the total counts up and
          the line draws in, then fades back to empty.
        </p>

        <div className="mt-12 flex flex-wrap gap-10">
          <div className="flex w-full max-w-[422px] flex-col gap-3">
            <SceneStage width={TILE.width} height={TILE.height} className="rounded-[15px]">
              <BeaconAnalyticsAnimation />
            </SceneStage>
            <p className="type-body-xs text-ink-muted">Loop</p>
          </div>
          <BeaconAnalyticsScrubber />
        </div>

        <h2 className="mt-20 type-heading-m">The Figma frame</h2>
        <div className="mt-6 flex w-full max-w-[422px] flex-col gap-3">
          <SceneStage width={TILE.width} height={TILE.height} className="rounded-[15px]">
            <BeaconAnalyticsAnimation at={doneAt} />
          </SceneStage>
          <p className="type-body-xs text-ink-muted">Finished · {doneAt.toFixed(1)}s</p>
        </div>
      </main>
    </>
  );
}
