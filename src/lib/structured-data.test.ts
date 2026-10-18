import { describe, expect, it } from "vitest";

import services from "@/content/services.json";
import site from "@/content/site.json";
import { serviceSchema, siteSchema } from "@/lib/content/schemas";

import {
  homeStructuredData,
  pageStructuredData,
  serializeJsonLd,
  serviceStructuredData,
} from "./structured-data";

const siteData = siteSchema.parse(site);
const service = serviceSchema.parse(services[0]);

type Node = Record<string, unknown>;
const nodes = (data: { "@graph": object[] }) => data["@graph"] as Node[];
const byType = (data: { "@graph": object[] }, type: string) =>
  nodes(data).find((node) => node["@type"] === type)!;

/** Todos os valores de URL do grafo (url, item, image, logo e @id). */
function urls(value: unknown): string[] {
  if (Array.isArray(value)) return value.flatMap(urls);
  if (value && typeof value === "object") {
    return Object.entries(value).flatMap(([key, child]) =>
      ["url", "item", "image", "logo", "@id"].includes(key) && typeof child === "string"
        ? [child]
        : urls(child),
    );
  }
  return [];
}

describe("dados estruturados (schema.org)", () => {
  it("descreve a empresa só com fatos do conteúdo", () => {
    const business = byType(homeStructuredData(siteData), "HomeAndConstructionBusiness");
    expect(business).toMatchObject({
      name: "Marcenaria Butantã",
      telephone: "+5511994408731",
      sameAs: ["https://www.instagram.com/marcenariabutanta"],
      address: { addressLocality: "São Paulo", addressRegion: "SP", addressCountry: "BR" },
    });
    expect(business.areaServed).toHaveLength(site.area.neighborhoods.length);
    expect(business.areaServed).toContainEqual({
      "@type": "Place",
      name: "Butantã, São Paulo - SP",
    });
    // Nada que o conteúdo não informe.
    for (const invented of ["openingHours", "aggregateRating", "priceRange", "review"]) {
      expect(business).not.toHaveProperty(invented);
    }
    expect(business.address).not.toHaveProperty("streetAddress");
  });

  it("usa URLs absolutas de produção, com o subcaminho do GitHub Pages", () => {
    const all = [homeStructuredData(siteData), serviceStructuredData(siteData, service)].flatMap(
      urls,
    );
    expect(all.length).toBeGreaterThan(5);
    for (const url of all)
      expect(url).toMatch(/^https:\/\/mauris81\.github\.io\/site-marcenaria\//);
  });

  it("liga o serviço à empresa e monta a trilha Início › serviço", () => {
    const data = serviceStructuredData(siteData, service);
    const business = byType(data, "HomeAndConstructionBusiness");
    expect(byType(data, "Service")).toMatchObject({
      name: service.name,
      serviceType: service.quoteType,
      provider: { "@id": business["@id"] },
    });
    expect(byType(data, "BreadcrumbList").itemListElement).toEqual([
      {
        "@type": "ListItem",
        position: 1,
        name: "Início",
        item: "https://mauris81.github.io/site-marcenaria/",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: service.name,
        item: `https://mauris81.github.io/site-marcenaria/${service.slug}`,
      },
    ]);
  });

  it("monta a trilha de páginas avulsas", () => {
    const data = pageStructuredData(siteData, { name: "Orçamento", path: "/orcamento" });
    expect(byType(data, "BreadcrumbList").itemListElement).toHaveLength(2);
  });

  it("escapa < para o conteúdo nunca fechar a tag <script>", () => {
    const data = { name: "</script><script>alert(1)</script>" };
    const json = serializeJsonLd(data);
    expect(json).not.toContain("</script>");
    expect(JSON.parse(json)).toEqual(data);
  });
});
