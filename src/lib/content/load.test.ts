import { describe, expect, it } from "vitest";

import home from "@/content/home.json";
import photos from "@/content/photos.json";
import quote from "@/content/quote.json";
import services from "@/content/services.json";
import site from "@/content/site.json";

import { loadContent, type RawContent } from "./load";

const raw: RawContent = { site, photos, home, services, quote };

describe("conteúdo do site (src/content)", () => {
  it("é válido e consistente entre os arquivos", () => {
    expect(() => loadContent(raw)).not.toThrow();
  });

  it("tem um slug único por página de serviço", () => {
    const { services } = loadContent(raw);
    const slugs = services.map((service) => service.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
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

  it("detecta tipo de orçamento ausente no formulário", () => {
    const brokenServices = structuredClone(services);
    brokenServices[0].quoteType = "Tipo inventado";
    expect(() => loadContent({ ...raw, services: brokenServices })).toThrow(/Tipo inventado/);
  });

  it("protege o SEO barrando títulos longos demais", () => {
    const longTitle = "Um título de página muito longo que certamente será cortado no Google";
    const broken = { ...raw, home: { ...home, seo: { ...home.seo, title: longTitle } } };
    expect(() => loadContent(broken)).toThrow(/60 caracteres/);
  });
});
