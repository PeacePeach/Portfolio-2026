import Image from "next/image";
import Link from "next/link";
import type { Project } from "@/content/types";
import { caseStudyFilters } from "@/content/work";
import { SceneStage } from "@/components/scenes/SceneStage";
import { NEO_TILE } from "@/components/scenes/neo-advance/frames";
import { NeoAdvanceAnimation } from "@/components/scenes/neo-advance/NeoAdvanceAnimation";

const tagLabel = (id: string) => caseStudyFilters.find((f) => f.id === id)?.label ?? id;

/**
 * Work page tile (Figma 21:196). Shows the project artwork; on hover or
 * keyboard focus a blurred panel rises with the name, description and tags.
 * Touch screens show the panel all the time. A project with a `scene`
 * plays it as a looping live animation in place of the artwork.
 */
export function ProjectCard({ project }: { project: Project }) {
  const shown =
    "opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 [@media(hover:none)]:opacity-100";
  const fade = "transition-opacity duration-(--duration-underline) ease-out-expo";

  return (
    <Link
      href={`/work/${project.slug}`}
      className="group relative block aspect-[422/314] overflow-hidden rounded-[10px] bg-tile outline-offset-4"
    >
      {project.scene === "neo-advance" ? (
        <SceneStage width={NEO_TILE.width} height={NEO_TILE.height} className="absolute! inset-0">
          <NeoAdvanceAnimation rounded={false} />
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
        className={`absolute inset-x-0 bottom-0 translate-y-2 transition-transform duration-(--duration-underline) ease-out-expo group-hover:translate-y-0 group-focus-visible:translate-y-0 [@media(hover:none)]:translate-y-0`}
      >
        {/* Progressive background blur (Figma: 0 at the top to 50 at the bottom) under 70 % black */}
        <div
          aria-hidden="true"
          className={`absolute inset-0 rounded-[10px] backdrop-blur-[25px] [mask-image:linear-gradient(to_bottom,transparent,#000_60%)] ${shown} ${fade}`}
        />
        <div aria-hidden="true" className={`absolute inset-0 rounded-[10px] bg-black/70 ${shown} ${fade}`} />
        <div className={`relative flex flex-col gap-4 p-5 ${shown} ${fade}`}>
          <div className="flex flex-col gap-2">
            <h3 className="type-label-l">{project.title}</h3>
            <p className="type-body-s">{project.description}</p>
          </div>
          {project.tags.length ? (
            <ul className="flex flex-wrap gap-1" aria-label="Tags">
              {project.tags.map((t) => (
                <li key={t} className="type-body-xs rounded-full border border-ink bg-tag px-2.5 py-1">
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
