import Image from "next/image";
import { Pill } from "@/design-system";

export type PersonaTasksData = {
  people: readonly { name: string; role: string; avatar?: string }[];
  /** Who handed the work over, e.g. "Notified by Sharyn". */
  handoff?: string;
  tasks: readonly string[];
};

/**
 * Figma 114:2259: the people in one step of a workflow (48px avatars, name and role in the intro facts type),
 * an optional handoff note, then their tasks as muted pills. Made for template `text` slots (NarrativeTemplate steps).
 */
export function PersonaTasks({ people, handoff, tasks }: PersonaTasksData) {
  return <div className="flex flex-col gap-4">
    {handoff && <p className="type-body-xs text-secondary">{handoff}</p>}
    <ul className="flex flex-wrap gap-6">
      {people.map(p => <li key={p.name} className="flex items-center gap-3">
        {p.avatar && <Image src={p.avatar} alt="" width={48} height={48} className="size-12 rounded-full" />}
        <span className="flex flex-col">
          <span className="type-label-s text-primary">{p.name}</span>
          <span className="type-body-s text-secondary">{p.role}</span>
        </span>
      </li>)}
    </ul>
    <ul className="flex flex-wrap gap-2">
      {tasks.map(t => <li key={t}><Pill appearance="muted">{t}</Pill></li>)}
    </ul>
  </div>;
}
