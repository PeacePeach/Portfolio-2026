import type { MetadataRoute } from "next";
import { getProjects } from "@/content";
import { site } from "@/content/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = ["/", "/work", ...getProjects().map((p) => `/work/${p.slug}`), "/leadership"];
  return paths.map((path) => ({ url: `${site.url}${path === "/" ? "" : path}` }));
}
