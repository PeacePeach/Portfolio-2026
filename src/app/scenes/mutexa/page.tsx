import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { SceneStage } from "@/components/scenes/SceneStage";
import { MutexaAnimation } from "@/components/scenes/mutexa/MutexaAnimation";
import { MutexaScrubber } from "@/components/scenes/mutexa/MutexaScrubber";
import { TILE, keyTimes } from "@/components/scenes/mutexa/track";
import { site } from "@/content/site";

export const metadata: Metadata = { title: `Mutexa scene — ${site.name}`, robots: { index: false } };

/**
 * Review sheet for the Mutexa tile animation (Figma 34:12825): the loop, a
 * scrubber, and the camera at each of the five Figma frames. Not linked.
 */
export default function MutexaScenePage() {
  return (
    <>
      <Header />
      <main id="main" className="container-page pt-[calc(var(--spacing-header)+3rem)] pb-section">
        <h1 className="type-display-m">Mutexa scene</h1>
        <p className="mt-4 max-w-[60ch] type-body-m text-secondary">
          Figma 34:12825, “Animation _ Mutexa”. One rotated card composition on a fixed background, tracked by a camera
          through the five Figma frames, each card animating as it comes into focus.
        </p>

        <div className="mt-12 flex flex-wrap gap-10">
          <div className="flex w-full max-w-[422px] flex-col gap-3">
            <SceneStage width={TILE.width} height={TILE.height} className="rounded-[15px]">
              <MutexaAnimation />
            </SceneStage>
            <p className="type-body-xs text-tertiary">Loop</p>
          </div>
          <MutexaScrubber />
        </div>

        <h2 className="mt-20 type-heading-m">Camera at the Figma frames</h2>
        <ol className="mt-6 flex flex-wrap gap-5">
          {keyTimes.map((time, i) => (
            <li key={time} className="flex w-full max-w-[422px] flex-col gap-3">
              <SceneStage width={TILE.width} height={TILE.height} className="rounded-[15px]">
                <MutexaAnimation at={time} />
              </SceneStage>
              <p className="type-body-xs text-tertiary">
                Frame {i + 1} · {time.toFixed(1)}s
              </p>
            </li>
          ))}
        </ol>
      </main>
    </>
  );
}
