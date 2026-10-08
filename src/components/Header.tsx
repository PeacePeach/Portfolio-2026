import Link from "next/link";
import { site } from "@/content/site";

/**
 * Minimal fixed header: name left, links centered, a pill call to action
 * on the right (reference layout).
 */
export function Header() {
  return (
    <header className="fixed inset-x-0 top-0 z-40 mix-blend-difference">
      <div className="container-page grid h-header grid-cols-[1fr_auto] items-center gap-6 md:grid-cols-[1fr_auto_1fr]">
        <Link href="/" className="font-display text-brand font-normal uppercase text-ink">
          {site.name}.
        </Link>
        <nav aria-label="Primary" className="hidden md:block">
          <ul className="flex gap-12">
            {site.nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="relative text-small uppercase text-ink after:absolute after:-bottom-1 after:left-0 after:h-px after:w-full after:origin-right after:scale-x-0 after:bg-current after:transition-transform after:duration-(--duration-base) after:ease-out-expo hover:after:origin-left hover:after:scale-x-100"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <Link
          href={site.cta.href}
          className="justify-self-end rounded-full border border-ink/80 px-[1.4em] py-[0.55em] text-small uppercase text-ink transition-colors duration-(--duration-base) hover:bg-ink hover:text-canvas"
        >
          {site.cta.label}
        </Link>
      </div>
    </header>
  );
}
