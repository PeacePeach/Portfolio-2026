import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { PageSlide } from "@/components/PageSlide";

/**
 * Home is one screen: the hero and its "Get to know me by" links. Nothing
 * below it; everything else is reached from the links and the top nav.
 */
export default function Home() {
  return (
    <PageSlide>
      <Header />
      <main id="main">
        <Hero />
      </main>
    </PageSlide>
  );
}
