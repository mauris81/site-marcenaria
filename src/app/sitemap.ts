import type { MetadataRoute } from "next";

import { getGallery, getServices, getSite } from "@/lib/content";
import imageWidths from "@/lib/image-widths.json";
import { absoluteUrl } from "@/lib/seo";

// /sitemap.xml gerado no build a partir do conteúdo: uma página nova em
// services.json entra aqui sozinha. As fotos do portfólio vão junto (na maior
// versão gerada), para os projetos aparecerem também na busca de imagens.
export const dynamic = "force-static";

const largestWidth = Math.max(...imageWidths.deviceSizes);

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [site, services] = await Promise.all([getSite(), getServices()]);

  const servicePages = await Promise.all(
    services.map(async (service) => ({
      url: absoluteUrl(site, `/${service.slug}`),
      images: (await getGallery(service)).map((item) =>
        absoluteUrl(site, `${item.src}-${largestWidth}.webp`),
      ),
    })),
  );

  return [
    { url: absoluteUrl(site, "/") },
    ...servicePages,
    { url: absoluteUrl(site, "/orcamento") },
  ];
}
