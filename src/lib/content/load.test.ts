import { describe, expect, it } from "vitest";

import home from "@/content/home.json";
import photosGenerated from "@/content/photos.generated.json";
import photos from "@/content/photos.json";
import quote from "@/content/quote.json";
import services from "@/content/services.json";
import site from "@/content/site.json";

import { loadContent, type RawContent } from "./load";

const raw: RawContent = { site, photos, photosGenerated, home, services, quote };

describe("conteúdo do site (src/content)", () => {
  it("é válido e consistente entre os arquivos", () => {
    expect(() => loadContent(raw)).not.toThrow();
  });

  it("tem um slug único por página de serviço", () => {
    const { services } = loadContent(raw);
    const slugs = services.map((service) => service.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("entrega cada foto com dimensões e placeholder das versões otimizadas", () => {
    const { photos } = loadContent(raw);
    for (const photo of photos) {
      expect(photo.width).toBeGreaterThan(0);
      expect(photo.height).toBeGreaterThan(0);
      expect(photo.blurDataURL).toMatch(/^data:image\/webp;base64,/);
    }
  });

  it("aponta arquivo e campo quando um dado é inválido", () => {
    const broken = { ...raw, site: { ...site, url: "não é uma url" } };
    expect(() => loadContent(broken)).toThrow(/site\.json[\s\S]*url/);
  });

  it("rejeita chaves desconhecidas, como erros de digitação", () => {
    const broken = { ...raw, home: { ...home, heor: home.hero } };
    expect(() => loadContent(broken)).toThrow(/home\.json[\s\S]*heor/);
  });

  it("detecta foto inexistente referenciada numa galeria", () => {
    const brokenServices = structuredClone(services);
    brokenServices[0].gallery.items[0].photo = "foto-que-nao-existe";
    expect(() => loadContent({ ...raw, services: brokenServices })).toThrow(/foto-que-nao-existe/);
  });

  it("avisa quando uma foto nova ainda não foi otimizada", () => {
    const withNewPhoto = [
      ...photos,
      { id: "foto-nova", file: "assets/photos/nova.jpg", alt: "Nova" },
    ];
    expect(() => loadContent({ ...raw, photos: withNewPhoto })).toThrow(/npm run images/);
  });

  it("exige foto de compartilhamento em página cujo hero não tem foto", () => {
    const broken = { ...raw, home: { ...home, seo: { ...home.seo, ogPhoto: undefined } } };
    expect(() => loadContent(broken)).toThrow(/home\.json › seo\.ogPhoto/);
  });

  it("detecta foto de compartilhamento inexistente", () => {
    const broken = { ...raw, quote: { ...quote, seo: { ...quote.seo, ogPhoto: "foto-sumida" } } };
    expect(() => loadContent(broken)).toThrow(/quote\.json › seo\.ogPhoto[\s\S]*foto-sumida/);
  });

  it("detecta tipo de orçamento ausente no formulário", () => {
    const brokenServices = structuredClone(services);
    brokenServices[0].quoteType = "Tipo inventado";
    expect(() => loadContent({ ...raw, services: brokenServices })).toThrow(/Tipo inventado/);
  });

  it("barra cenas com mais fotos do que a animação comporta", () => {
    const brokenServices = structuredClone(services);
    const showcase = brokenServices.find((service) => service.showcase)?.showcase;
    if (!showcase) throw new Error("nenhum serviço com showcase para testar");
    showcase.photos = [...showcase.photos, ...showcase.photos];
    expect(() => loadContent({ ...raw, services: brokenServices })).toThrow(
      /exibe de \d+ a \d+ fotos/,
    );
  });

  it("protege o SEO barrando títulos longos demais", () => {
    const longTitle = "Um título de página muito longo que certamente será cortado no Google";
    const broken = { ...raw, home: { ...home, seo: { ...home.seo, title: longTitle } } };
    expect(() => loadContent(broken)).toThrow(/60 caracteres/);
  });
});
