import { Pill } from "@/design-system/components/Pill";

export function EvidencePill({ label, emphasis = "secondary" }: { label: string; emphasis?: "primary" | "secondary" }) {
  return <Pill appearance="evidence" emphasis={emphasis}>{label}</Pill>;
}
