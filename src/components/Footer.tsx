import { site } from "@/content/site";
import { ArrowUpRight } from "./ui/Icons";

export function Footer() {
  return (
    <footer id="contact" className="container-page mt-section pb-8">
      <div className="grid-page gap-y-10 border-t border-line pt-6">
        <p className="meta col-span-4 md:col-span-3 text-ink-muted">Contact</p>
        <a
          href={`mailto:${site.email}`}
          className="group col-span-4 md:col-span-9 font-display text-display uppercase"
        >
          <span className="inline-flex items-start gap-[0.15em]">
            {site.footer.heading}
            <ArrowUpRight className="mt-[0.12em] size-[0.45em] text-ink-muted transition-transform duration-(--duration-base) ease-out-expo group-hover:translate-x-[0.06em] group-hover:-translate-y-[0.06em] group-hover:text-ink" />
          </span>
        </a>
      </div>
      <div className="grid-page mt-20 gap-y-4 md:mt-32">
        <a href={`mailto:${site.email}`} className="meta col-span-4 md:col-span-3 text-ink hover:text-ink-muted">
          {site.email}
        </a>
        <ul className="col-span-4 flex gap-6 md:col-span-4 md:col-start-6">
          {site.footer.links.map((l) => (
            <li key={l.label}>
              <a href={l.href} className="meta text-ink hover:text-ink-muted">
                {l.label}
              </a>
            </li>
          ))}
        </ul>
        <p className="meta col-span-4 md:col-span-3 md:col-start-10 md:justify-self-end text-ink-faint">
          © 2026 {site.name}
        </p>
      </div>
    </footer>
  );
}
