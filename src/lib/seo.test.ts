import { describe, expect, it } from "vitest";

import site from "@/content/site.json";
import { siteSchema } from "@/lib/content/schemas";

import { absoluteUrl, pageMetadata, shareImagePath } from "./seo";

const siteData = siteSchema.parse(site);
const seo = {
  title: "Cozinha planejada sob medida em São Paulo",
  description: "Descrição para o Google.",
  ogDescription: "Descrição para a prévia no WhatsApp.",
};

describe("SEO", () => {
  it("nomeia a imagem de compartilhamento pela rota", () => {
    expect(shareImagePath("/")).toBe("/og/home.jpg");
    expect(shareImagePath("/orcamento")).toBe("/og/orcamento.jpg");
  });

  it("gera URLs absolutas de produção, com o subcaminho do GitHub Pages", () => {
    expect(absoluteUrl(siteData, "/")).toBe("https://mauris81.github.io/site-marcenaria/");
    expect(absoluteUrl(siteData, "/orcamento")).toBe(
      "https://mauris81.github.io/site-marcenaria/orcamento",
    );
  });

  it("monta título com a marca, canônica, Open Graph e cartão do X", () => {
    const metadata = pageMetadata({ site: siteData, seo, path: "/cozinhas-planejadas" });
    const title = "Cozinha planejada sob medida em São Paulo | Marcenaria Butantã";
    expect(metadata.title).toEqual({ absolute: title });
    expect(metadata.alternates.canonical).toBe("/cozinhas-planejadas");
    expect(metadata.openGraph).toMatchObject({
      locale: "pt_BR",
      siteName: "Marcenaria Butantã",
      url: "/cozinhas-planejadas",
      title,
      description: seo.ogDescription,
      images: [{ url: "/og/cozinhas-planejadas.jpg", width: 1200, height: 630 }],
    });
    expect(metadata.twitter.card).toBe("summary_large_image");
  });

  it("usa a descrição do Google na prévia quando não há uma própria", () => {
    const metadata = pageMetadata({
      site: siteData,
      seo: { ...seo, ogDescription: undefined },
      path: "/",
    });
    expect(metadata.openGraph.description).toBe(seo.description);
  });
});
