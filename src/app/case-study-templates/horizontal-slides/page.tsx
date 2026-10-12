import type { Metadata } from "next";
import { HorizontalSlidesTemplate } from "@/components/case-study/templates/HorizontalSlidesTemplate";
import { neoAdvanceJourneyMap } from "@/content/neoAdvance";

export const metadata: Metadata = { title: "Horizontal slides template", robots: { index: false } };

const image = (name: string, alt: string) => ({ src: `/case-studies/reimagining-analytics/${name}.png`, alt, width: 988, height: 618 });

export default function HorizontalSlidesPreviewPage() {
  return <main id="main" className="container-page">
    <div className="h-[50svh]" />
    <HorizontalSlidesTemplate
      label="Horizontal slides preview"
      slides={[
        { id: "one", title: "First Slide", body: "Each slide brings its own title and body. Scrolling one viewport moves the next slide in whole, like a slideshow.", image: image("roles-before", "Sample slide one") },
        { id: "two", title: "Second Slide", body: "The text above swaps with the shared case-study swap motion while the slide slides in.", image: image("roles-after", "Sample slide two") },
        { id: "three", title: "Third Slide", body: "The last slide holds until the section unpins and the page scrolls on.", image: image("roles-final-overview", "Sample slide three") },
      ]}
    />
    <div className="h-[100svh]" />
    {/* Long artifact: one image moving sideways continuously with scroll. */}
    <HorizontalSlidesTemplate {...neoAdvanceJourneyMap} />
    <div className="h-[100svh]" />
  </main>;
}
