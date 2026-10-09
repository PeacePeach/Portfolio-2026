import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { SceneStage } from "@/components/scenes/SceneStage";
import { NEO_TILE, NeoAdvanceScene, neoFrames } from "@/components/scenes/neo-advance/NeoAdvanceScene";
import { site } from "@/content/site";

export const metadata: Metadata = { title: `Neo Advance scenes — ${site.name}`, robots: { index: false } };

/**
 * Review sheet for the Neo Advance tile animation (Figma 31:6146): every
 * frame side by side at 1:1, then one scaled to a fluid width. Static for
 * now; the frames become one continuous animation later. Not linked.
 */
export default function NeoAdvanceScenesPage() {
  return (
    <>
      <Header />
      <main id="main" className="container-page pt-[calc(var(--spacing-header)+3rem)] pb-section">
        <h1 className="type-display-m">Neo Advance scenes</h1>
        <p className="mt-4 max-w-[60ch] type-body-m text-ink-muted">
          Figma 31:6146, “Animation 1”. Five frames of one tile animation, rebuilt in HTML, CSS and SVG. Not animated yet.
        </p>

        <ol className="mt-12 flex flex-wrap gap-5">
          {neoFrames.map((f, i) => (
            <li key={f.id} className="flex flex-col gap-3">
              <NeoAdvanceScene frame={f.id} />
              <p className="type-body-xs text-ink-muted">
                {i + 1}. {f.label} · Figma {f.figma}
              </p>
            </li>
          ))}
        </ol>

        <h2 className="mt-20 type-heading-m">Scaled to a fluid tile</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <SceneStage width={NEO_TILE.width} height={NEO_TILE.height} className="rounded-[10px]">
            <NeoAdvanceScene frame="cover" />
          </SceneStage>
          <SceneStage width={NEO_TILE.width} height={NEO_TILE.height} className="rounded-[10px]">
            <NeoAdvanceScene frame="unlocked" />
          </SceneStage>
        </div>
      </main>
    </>
  );
}
