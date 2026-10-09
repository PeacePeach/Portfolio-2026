"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Project } from "@/content/types";
import { caseStudyFilters } from "@/content/work";
import { SceneStage } from "@/components/scenes/SceneStage";
import { ScenePause } from "@/components/scenes/ScenePause";
import { NeoAdvanceAnimation } from "@/components/scenes/neo-advance/NeoAdvanceAnimation";
import { MutexaAnimation } from "@/components/scenes/mutexa/MutexaAnimation";
import { BeaconAnalyticsAnimation } from "@/components/scenes/beacon-analytics/BeaconAnalyticsAnimation";
import { BrightcoveAnimation } from "@/components/scenes/brightcove/BrightcoveAnimation";

/** Every scene is a 422 × 314 Figma tile. */
const TILE = { width: 422, height: 314 };
const scenes = {
  "neo-advance": NeoAdvanceAnimation,
  mutexa: MutexaAnimation,
  "beacon-analytics": BeaconAnalyticsAnimation,
  brightcove: BrightcoveAnimation,
} satisfies Record<NonNullable<Project["scene"]>, unknown>;

const tagLabel = (id: string) => caseStudyFilters.find((f) => f.id === id)?.label ?? id;

/**
 * Work page tile (Figma 21:196). Shows the project artwork; on hover or
 * keyboard focus a blurred panel rises with the name, description and tags.
 * Touch screens show the panel all the time. A project with a `scene`
 * plays it as a looping live animation in place of the artwork, held still
 * while the pointer is over the tile.
 */
export function ProjectCard({ project }: { project: Project }) {
  const Scene = project.scene ? scenes[project.scene] : null;
  const [hovered, setHovered] = useState(false);
  const shown = "opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 [@media(hover:none)]:opacity-100";
  const fade = "transition-opacity duration-(--duration-underline) ease-out-expo";

  return (
    <Link
      href={`/work/${project.slug}`}
      onPointerEnter={(e) => e.pointerType === "mouse" && setHovered(true)}
      onPointerLeave={() => setHovered(false)}
      className="group relative block aspect-[422/314] overflow-hidden rounded-[10px] bg-tile outline-offset-4"
    >
      {/* The scene and the panel are separate GPU layers; rounded by the tile alone, their
          antialiasing along the corner curves let a hairline of the scene through the panel. The
          (no-op) mask flattens them into one layer before this rounded clip, so the corners are clean. */}
      <div className="absolute inset-0 overflow-hidden rounded-[10px] [mask-image:linear-gradient(#000,#000)]">
        {Scene ? (
          <SceneStage width={TILE.width} height={TILE.height} className="absolute! inset-0">
            <ScenePause value={hovered}>
              <Scene rounded={false} />
            </ScenePause>
          </SceneStage>
        ) : project.image ? (
          <div className="absolute inset-0 animate-drift">
            <Image
              src={project.image.src}
              alt={project.image.alt}
              fill
              sizes="(min-width: 48rem) 34vw, 100vw"
              unoptimized={project.image.src.endsWith(".svg")}
              className="object-cover"
            />
          </div>
        ) : null}

        <div
          className={`absolute inset-x-0 bottom-0 flex min-h-[51.3%] translate-y-2 flex-col justify-center text-[#fff] transition-transform duration-(--duration-underline) ease-out-expo group-hover:translate-y-0 group-focus-visible:translate-y-0 [@media(hover:none)]:translate-y-0`}
        >
          {/* Frame 35: 70 % black over a 50 px background blur. Explicit colours: the palette has no black.
            The panel runs 1 px past the tile's sides and 20 px past its bottom, and the tile's rounded clip
            trims it: on a fractional tile edge the panel then fully covers the scene in the antialiased
            pixel. Its top corners are a border radius, not a clip-path: on GPU compositing a clip-path
            trims the tint but not the backdrop blur, which showed as a pale patch outside the corner. */}
          <div
            aria-hidden="true"
            className={`absolute -inset-x-px top-0 -bottom-5 rounded-t-[11px] bg-[rgba(0,0,0,0.7)] backdrop-blur-[25px] ${shown} ${fade}`}
          />
          <div className={`relative flex flex-col gap-4 px-5 pt-8 pb-5 ${shown} ${fade}`}>
            <div className="flex flex-col gap-2">
              <h3 className="type-display-xs">{project.title}</h3>
              <p className="type-body-s">{project.description}</p>
            </div>
            {project.tags.length ? (
              <ul className="flex flex-wrap gap-1" aria-label="Tags">
                {project.tags.map((t) => (
                  <li key={t} className="type-body-xs rounded-full border border-[#fff] bg-tag px-2.5 py-1">
                    {tagLabel(t)}
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        </div>
      </div>
    </Link>
  );
}
