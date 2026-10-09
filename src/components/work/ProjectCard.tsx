import Image from "next/image";
import Link from "next/link";
import type { Project } from "@/content/types";
import { caseStudyFilters } from "@/content/work";
import { SceneStage } from "@/components/scenes/SceneStage";
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
 * plays it as a looping live animation in place of the artwork.
 */
export function ProjectCard({ project }: { project: Project }) {
  const Scene = project.scene ? scenes[project.scene] : null;
  const shown =
    "opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 [@media(hover:none)]:opacity-100";
  const fade = "transition-opacity duration-(--duration-underline) ease-out-expo";

  return (
    <Link
      href={`/work/${project.slug}`}
      className="group relative block aspect-[422/314] overflow-hidden rounded-[10px] bg-tile outline-offset-4"
    >
      {Scene ? (
        <SceneStage width={TILE.width} height={TILE.height} className="absolute! inset-0">
          <Scene rounded={false} />
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
        {/* Frame 35: 70 % black over a 50 px background blur. Explicit colours: the palette has no black. */}
        <div
          aria-hidden="true"
          className={`absolute inset-0 rounded-[10px] bg-[rgba(0,0,0,0.7)] backdrop-blur-[25px] ${shown} ${fade}`}
        />
        <div className={`relative flex flex-col gap-4 px-5 pt-8 pb-5 ${shown} ${fade}`}>
          <div className="flex flex-col gap-2">
            <h3 className="type-label-l">{project.title}</h3>
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
    </Link>
  );
}
