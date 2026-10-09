import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { SceneStage } from "@/components/scenes/SceneStage";
import { BrightcoveAnimation } from "@/components/scenes/brightcove/BrightcoveAnimation";
import { BrightcoveScrubber } from "@/components/scenes/brightcove/BrightcoveScrubber";
import { TILE, frameTimes } from "@/components/scenes/brightcove/timeline";
import { site } from "@/content/site";

export const metadata: Metadata = { title: `Brightcove scene — ${site.name}`, robots: { index: false } };

/**
 * Review sheet for the Brightcove tile animation (Figma 35:19621): the loop, a
 * scrubber, and the two Figma frames. Not linked.
 */
export default function BrightcoveScenePage() {
  return (
    <>
      <Header />
      <main id="main" className="container-page pt-[calc(var(--spacing-header)+3rem)] pb-section">
        <h1 className="type-display-m">Brightcove scene</h1>
        <p className="mt-4 max-w-[60ch] type-body-m text-ink-muted">
          Figma 35:19621, “Animation _ Beacon”. The CMS screenshot shrinks from the zoomed-in first frame to the whole
          screen, rests, then fades back to the first frame.
        </p>

        <div className="mt-12 flex flex-wrap gap-10">
          <div className="flex w-full max-w-[422px] flex-col gap-3">
            <SceneStage width={TILE.width} height={TILE.height} className="rounded-[15px]">
              <BrightcoveAnimation />
            </SceneStage>
            <p className="type-body-xs text-ink-muted">Loop</p>
          </div>
          <BrightcoveScrubber />
        </div>

        <h2 className="mt-20 type-heading-m">The Figma frames</h2>
        <ol className="mt-6 flex flex-wrap gap-5">
          {frameTimes.map((time, i) => (
            <li key={time} className="flex w-full max-w-[422px] flex-col gap-3">
              <SceneStage width={TILE.width} height={TILE.height} className="rounded-[15px]">
                <BrightcoveAnimation at={time} />
              </SceneStage>
              <p className="type-body-xs text-ink-muted">
                Frame {i + 1} · {time.toFixed(1)}s
              </p>
            </li>
          ))}
        </ol>
      </main>
    </>
  );
}
