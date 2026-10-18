import type { MetadataRoute } from "next";

import { getSite } from "@/lib/content";
import { absoluteUrl } from "@/lib/seo";

// /robots.txt na raiz do domínio: libera tudo e aponta o sitemap.
export const dynamic = "force-static";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const site = await getSite();
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: absoluteUrl(site, "/sitemap.xml"),
  };
}
