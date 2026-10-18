import type { Metadata } from "next";

import type { Site } from "@/lib/content";

type PageSeo = { title: string; description: string; ogDescription?: string };
type Path = `/${string}`;

/** Tamanho das imagens de compartilhamento geradas por scripts/generate-og.mjs. */
export const SHARE_IMAGE_SIZE = { width: 1200, height: 630 } as const;

/** URL absoluta no domínio de produção (`site.url`). */
export function absoluteUrl(site: Site, path: Path) {
  return `${site.url}${path}`;
}

/**
 * Imagem de compartilhamento da rota, em public/og/: "/" → home.jpg, "/orcamento"
 * → orcamento.jpg. scripts/generate-og.mjs gera os arquivos com estes nomes.
 */
export function shareImagePath(path: Path): Path {
  return `/og/${path === "/" ? "home" : path.slice(1)}.jpg`;
}

/**
 * Metadados de uma página: título, descrição, URL canônica, Open Graph (prévia
 * no WhatsApp, Facebook e LinkedIn) e cartão do X. As URLs relativas viram
 * absolutas pelo `metadataBase` definido no layout.
 */
export function pageMetadata({ site, seo, path }: { site: Site; seo: PageSeo; path: Path }) {
  const title = `${seo.title} | ${site.name}`;
  const shareDescription = seo.ogDescription ?? seo.description;
  const images = [
    { url: shareImagePath(path), ...SHARE_IMAGE_SIZE, alt: title, type: "image/jpeg" },
  ];

  return {
    // Título completo sempre: na home, que divide o segmento com o layout, o
    // `title.template` do layout não se aplica e a marca ficaria de fora.
    title: { absolute: title },
    description: seo.description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      locale: site.locale.replace("-", "_"),
      siteName: site.name,
      url: path,
      title,
      description: shareDescription,
      images,
    },
    twitter: { card: "summary_large_image", title, description: shareDescription, images },
  } satisfies Metadata;
}
