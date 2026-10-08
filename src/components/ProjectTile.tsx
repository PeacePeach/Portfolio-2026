import Link from "next/link";
import type { Project } from "@/content/types";
import { Media } from "./ui/Media";
import { ArrowUpRight } from "./ui/Icons";
import { PlaceholderTag } from "./ui/PlaceholderTag";
import { cn } from "@/lib/cn";

export function ProjectTile({
  project,
  index,
  ratio,
  sizes,
  className,
}: {
  project: Project;
  index: number;
  ratio: string;
  sizes: string;
  className?: string;
}) {
  return (
    <article className={cn("group", className)}>
      <Link href={`/work/${project.slug}`} className="block focus-visible:outline-offset-8">
        <Media
          image={project.image}
          ratio={ratio}
          sizes={sizes}
          imageClassName="transition-transform duration-(--duration-image) ease-out-expo group-hover:scale-[1.035]"
          className="after:pointer-events-none after:absolute after:inset-0 after:bg-canvas/0 after:transition-colors after:duration-(--duration-slow) group-hover:after:bg-canvas/10"
        />
        <div className="mt-5 grid grid-cols-[3rem_1fr_auto] items-baseline gap-x-3">
          <span className="meta text-ink-faint">{String(index + 1).padStart(2, "0")}</span>
          <h3 className="font-display text-title">{project.title}</h3>
          <ArrowUpRight className="size-5 self-center text-ink-muted transition-transform duration-(--duration-base) ease-out-expo group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-ink" />
          <p className="col-start-2 col-end-4 mt-3 max-w-[48ch] text-ink-muted">{project.summary}</p>
          <div className="col-start-2 col-end-4 mt-4 flex flex-wrap items-center gap-x-4 gap-y-2">
            <span className="meta text-ink-faint">{project.meta.join(" / ")}</span>
            {project.year ? <span className="meta text-ink-faint">{project.year}</span> : null}
            <PlaceholderTag status={project.status} />
          </div>
        </div>
      </Link>
    </article>
  );
}
