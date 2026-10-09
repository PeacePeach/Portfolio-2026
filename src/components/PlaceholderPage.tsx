import Link from "next/link";
import { Header } from "./Header";
import { Footer } from "./Footer";

/** Simple stand-in for pages that are not designed yet. */
export function PlaceholderPage({ title, note }: { title: string; note: string }) {
  return (
    <>
      <Header />
      <main id="main" className="container-page min-h-[70svh] pt-[calc(var(--spacing-header)+4rem)]">
        <Link href="/" className="hover-underline type-label-s text-secondary hover:text-primary">
          ← Home
        </Link>
        <h1 className="mt-10 type-display-m uppercase">{title}</h1>
        <p className="mt-8 max-w-[52ch] text-secondary">{note}</p>
      </main>
      <Footer />
    </>
  );
}
