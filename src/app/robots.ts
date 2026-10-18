import type { MetadataRoute } from "next";

import { getSite } from "@/lib/content";
import { absoluteUrl } from "@/lib/seo";

// /robots.txt: libera tudo e aponta o sitemap. Os buscadores só leem este
// arquivo na raiz do domínio — vale quando o site tiver domínio próprio; no
// subcaminho do GitHub Pages, o sitemap é enviado pelo Google Search Console.
export const dynamic = "force-static";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const site = await getSite();
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: absoluteUrl(site, "/sitemap.xml"),
  };
}
