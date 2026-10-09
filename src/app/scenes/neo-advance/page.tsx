import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { SceneStage } from "@/components/scenes/SceneStage";
import { NeoAdvanceAnimation } from "@/components/scenes/neo-advance/NeoAdvanceAnimation";
import { NEO_TILE, neoFrames } from "@/components/scenes/neo-advance/frames";
import { NeoAdvanceScene } from "@/components/scenes/neo-advance/NeoAdvanceScene";
import { NeoAdvanceScrubber } from "@/components/scenes/neo-advance/NeoAdvanceScrubber";
import { site } from "@/content/site";

export const metadata: Metadata = { title: `Neo Advance scenes — ${site.name}`, robots: { index: false } };

/**
 * Review sheet for the Neo Advance tile animation (Figma 31:6146): the
 * continuous loop, a scrubber to freeze any moment, every source frame at
 * 1:1, and the loop scaled to fluid tiles. Not linked.
 */
export default function NeoAdvanceScenesPage() {
  return (
    <>
      <Header />
      <main id="main" className="container-page pt-[calc(var(--spacing-header)+3rem)] pb-section">
        <h1 className="type-display-m">Neo Advance scenes</h1>
        <p className="mt-4 max-w-[60ch] type-body-m text-ink-muted">
          Figma 31:6146, “Animation 1”. Five frames joined into one continuous loop, in HTML, CSS and SVG.
        </p>

        <div className="mt-12 flex flex-wrap gap-10">
          <div className="flex w-full max-w-[422px] flex-col gap-3">
            <SceneStage width={NEO_TILE.width} height={NEO_TILE.height} className="rounded-[15px]">
              <NeoAdvanceAnimation />
            </SceneStage>
            <p className="type-body-xs text-ink-muted">Loop, 9.6s</p>
          </div>
          <NeoAdvanceScrubber />
        </div>

        <h2 className="mt-20 type-heading-m">Source frames</h2>
        <ol className="mt-6 flex flex-wrap gap-5">
          {neoFrames.map((f, i) => (
            <li key={f.id} className="flex w-full max-w-[422px] flex-col gap-3">
              <SceneStage width={NEO_TILE.width} height={NEO_TILE.height} className="rounded-[15px]">
                <NeoAdvanceScene frame={f.id} />
              </SceneStage>
              <p className="type-body-xs text-ink-muted">
                {i + 1}. {f.label} · Figma {f.figma}
              </p>
            </li>
          ))}
        </ol>

        <h2 className="mt-20 type-heading-m">Scaled to a fluid tile</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <SceneStage width={NEO_TILE.width} height={NEO_TILE.height} className="rounded-[10px]">
            <NeoAdvanceAnimation />
          </SceneStage>
          <SceneStage width={NEO_TILE.width} height={NEO_TILE.height} className="rounded-[10px]">
            <NeoAdvanceAnimation />
          </SceneStage>
        </div>
      </main>
    </>
  );
}
