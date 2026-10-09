import { Header } from "@/components/Header";
import { CaseMorphLayer } from "@/components/case-study/CaseMorphLayer";

/**
 * Work and the case studies share one top nav, so it never remounts or moves
 * when a tile opens its case study, and the transition layer that carries the
 * tile into the case study's hero outlives the route change.
 */
export default function WorkLayout({ children }: LayoutProps<"/work">) {
  return (
    <>
      <Header />
      {children}
      <CaseMorphLayer />
    </>
  );
}
