import type { Project } from "@/content/types";
import { ProjectTile } from "./ProjectTile";

/**
 * Asymmetric editorial layout. Positions repeat every three projects, so
 * adding more projects keeps the rhythm.
 */
const layout = [
  { className: "md:col-span-7", ratio: "4 / 3", sizes: "(min-width: 768px) 58vw, 100vw" },
  { className: "md:col-span-4 md:col-start-9 md:mt-[22%]", ratio: "4 / 5", sizes: "(min-width: 768px) 33vw, 100vw" },
  { className: "md:col-span-9 md:col-start-3", ratio: "16 / 9", sizes: "(min-width: 768px) 75vw, 100vw" },
];

export function ProjectGallery({ projects }: { projects: Project[] }) {
  return (
    <div className="grid-page gap-y-16 md:gap-y-28">
      {projects.map((p, i) => {
        const l = layout[i % layout.length];
        return <ProjectTile key={p.slug} project={p} index={i} ratio={l.ratio} sizes={l.sizes} className={`col-span-4 ${l.className}`} />;
      })}
    </div>
  );
}
