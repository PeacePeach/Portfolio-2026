import { Suspense } from "react";
import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { PageSlide } from "@/components/PageSlide";
import { WorkExplorer, WorkExplorerFromUrl } from "@/components/work/WorkExplorer";
import { getProjects } from "@/content";
import { site } from "@/content/site";
import { defaultWorkView } from "@/content/work";

export const metadata: Metadata = { title: `Work — ${site.name}` };

/** Work page (Figma 21:196). The view comes from ?view=case-studies|super-powers|hanxgpt. */
export default function WorkPage() {
  const projects = getProjects();
  return (
    <PageSlide>
      <Header />
      <main id="main">
        <Suspense fallback={<WorkExplorer view={defaultWorkView} projects={projects} />}>
          <WorkExplorerFromUrl projects={projects} />
        </Suspense>
      </main>
    </PageSlide>
  );
}
