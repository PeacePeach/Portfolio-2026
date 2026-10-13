import type { MetadataRoute } from "next";
import { site } from "@/content/site";

/** Crawlers see the portfolio; previews, prototypes and placeholder pages stay out of search. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/prototype/", "/scenes/", "/typography", "/case-study-templates", "/about", "/resume"],
    },
    sitemap: `${site.url}/sitemap.xml`,
  };
}
