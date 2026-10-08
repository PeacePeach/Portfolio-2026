import Link from "next/link";
import { site } from "@/content/site";
import { FadeIn } from "./ui/FadeIn";
import { cn } from "@/lib/cn";

function Inner() {
  return (
    <div className="grid-page container-page h-header items-center">
      <Link href="/" className="meta col-span-2 md:col-span-3 text-ink">
        {site.name}
        <span className="text-ink-faint">&nbsp;©2026</span>
      </Link>
      <p className="meta hidden md:col-span-5 md:block text-ink-muted">{site.role}</p>
      <nav aria-label="Primary" className="col-span-2 md:col-span-4 justify-self-end">
        <ul className="flex gap-6">
          {site.nav.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="meta relative text-ink after:absolute after:-bottom-1 after:left-0 after:h-px after:w-full after:origin-right after:scale-x-0 after:bg-current after:transition-transform after:duration-(--duration-base) after:ease-out-expo hover:after:origin-left hover:after:scale-x-100"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}

/** Minimal fixed header. `intro` fades it in with the hero sequence. */
export function Header({ intro = false }: { intro?: boolean }) {
  return (
    <header className={cn("fixed inset-x-0 top-0 z-40 mix-blend-difference")}>
      {intro ? (
        <FadeIn>
          <Inner />
        </FadeIn>
      ) : (
        <Inner />
      )}
    </header>
  );
}
