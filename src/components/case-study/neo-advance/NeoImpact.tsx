import { CheckSquare, RefreshCw, Users } from "react-feather";
import { neoAdvanceImpact as impact } from "@/content/neoAdvance";

const icons = { users: Users, refresh: RefreshCw, task: CheckSquare };

/** "What the new model made possible" (Figma 67:703): heading and three result cards. */
export function NeoImpact() {
  return (
    <section aria-labelledby="neo-impact" className="mx-auto flex max-w-[59.1875rem] flex-col items-center gap-12">
      <div className="max-w-[31.75rem]">
        <h2 id="neo-impact" className="type-display-xs text-[2rem]! font-normal! text-ink">
          {impact.title}
        </h2>
        <p className="mt-3 type-body-m text-secondary">{impact.subtitle}</p>
      </div>
      <ul className="grid w-full grid-cols-1 gap-4 md:grid-cols-3">
        {impact.cards.map((c) => {
          const Icon = icons[c.icon];
          return (
            <li
              key={c.label}
              className="flex flex-col items-center rounded-[2.5rem] border border-line px-8 py-12 text-center"
            >
              {/* Figma's accent blue, used only for these icons. */}
              <Icon size={24} strokeWidth={1.5} className="text-[#2d66f4]" aria-hidden />
              <p className="mt-8 type-display-xs text-[2rem]! font-normal! text-primary">{c.value}</p>
              <p className="mt-1 type-heading-s text-secondary">{c.label}</p>
              <p className="mt-4 max-w-[15.0625rem] type-body-s text-secondary">{c.body}</p>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
