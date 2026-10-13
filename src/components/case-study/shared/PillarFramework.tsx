import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { AccentBar } from "./AccentBar";

export type PillarFrameworkData = {
  challenge: string;
  questions: readonly string[];
  methods: readonly { title: string; detail: string }[];
  enables: readonly string[];
};

export const pillarFrameworkLabels = {
  challenge: "Business Challenge",
  questions: "Strategic Questions",
  methods: "Methods & Tools",
  enables: "What It Enables",
};

/**
 * Leadership pillar framework (Figma AI-Portfolio 176:3567): four columns on a
 * panel matching the fragment cards below it (local to the Leadership page), each a Body XS label over items marked with the accent bar.
 * Rows line up across columns (items at least 84 px, 32 px apart).
 */
export function PillarFramework({ challenge, questions, methods, enables }: PillarFrameworkData) {
  const columns = [
    { label: pillarFrameworkLabels.challenge, items: [<p key="c" className="type-body-s text-primary">{challenge}</p>] },
    { label: pillarFrameworkLabels.questions, items: questions.map((q) => <p key={q} className="type-body-s font-medium text-primary">{q}</p>) },
    {
      label: pillarFrameworkLabels.methods,
      items: methods.map((m) => (
        <div key={m.title} className="flex flex-col gap-1">
          <p className="type-body-s whitespace-nowrap text-primary">{m.title}</p>
          <p className="type-body-xs text-secondary">{m.detail}</p>
        </div>
      )),
    },
    { label: pillarFrameworkLabels.enables, items: enables.map((e) => <p key={e} className="type-body-s font-medium text-primary">{e}</p>) },
  ];
  // Desktop: one grid, so every column's nth item shares a row with the others (labels on row 1).
  // Below `md` the columns stack, each label over its items.
  return (
    <ScrollReveal className="grid grid-cols-1 gap-x-10 gap-y-4 rounded-[10px] border border-ink/10 bg-card p-6 md:gap-y-8 md:grid-cols-[minmax(0,125fr)_minmax(0,147fr)_minmax(0,124fr)_minmax(0,147fr)]">
      {columns.map((column, c) => (
        <div key={column.label} className="contents">
          <p className={`type-body-xs uppercase text-secondary ${colStart[c]} md:row-start-1`}>{column.label}</p>
          {column.items.map((item, i) => (
            <div key={i} className={`flex gap-3 md:min-h-[5.25rem] ${colStart[c]} ${rowStart[i]}`}>
              <AccentBar />
              <div className="min-w-0">{item}</div>
            </div>
          ))}
        </div>
      ))}
    </ScrollReveal>
  );
}

const colStart = ["md:col-start-1", "md:col-start-2", "md:col-start-3", "md:col-start-4"];
const rowStart = ["md:row-start-2", "md:row-start-3", "md:row-start-4", "md:row-start-5", "md:row-start-6", "md:row-start-7"];
