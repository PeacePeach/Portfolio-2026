import { CheckSquare, ExternalLink, RefreshCw, Users } from "react-feather";

const icons = { users: Users, refresh: RefreshCw, task: CheckSquare, export: ExternalLink };

export type ImpactCardData = { icon: keyof typeof icons; value: string; label: string; body: string };

/** Figma 110:18673: icon, metric, label and one-line proof in a rounded, outlined tile. */
export function ImpactCard({ icon, value, label, body }: ImpactCardData) {
  const Icon = icons[icon];
  return <div className="flex h-full flex-col items-center rounded-[2.5rem] border border-line px-8 py-12 text-center">
    {/* Figma's accent blue, used only for these icons. */}
    <Icon size={24} strokeWidth={1.5} className="text-[#2d66f4]" aria-hidden />
    <p className="mt-8 type-display-xs text-[2rem]! font-normal! text-primary">{value}</p>
    <p className="mt-1 type-heading-s text-secondary">{label}</p>
    <p className="mt-4 max-w-[15.0625rem] type-body-s text-secondary">{body}</p>
  </div>;
}
