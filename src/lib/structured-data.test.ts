import { describe, expect, it } from "vitest";

import home from "@/content/home.json";
import quote from "@/content/quote.json";
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
const allServices = services.map((item) => serviceSchema.parse(item));
const service = allServices[0];
const homeData = () => homeStructuredData(siteData, { seo: home.seo, services: allServices });

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
    const business = byType(homeData(), "HomeAndConstructionBusiness");
    expect(business).toMatchObject({
      name: "Marcenaria Butantã",
      telephone: "+5511958522265",
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

  it("usa URLs absolutas no domínio de produção", () => {
    const all = [homeData(), serviceStructuredData(siteData, service)].flatMap(urls);
    expect(all.length).toBeGreaterThan(5);
    for (const url of all) expect(url).toMatch(/^https:\/\/www\.marcenariabutanta\.com\.br\//);
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
        item: "https://www.marcenariabutanta.com.br/",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: service.name,
        item: `https://www.marcenariabutanta.com.br/${service.slug}`,
      },
    ]);
  });

  it("monta a trilha de páginas avulsas", () => {
    const data = pageStructuredData(siteData, {
      name: "Orçamento",
      path: "/orcamento",
      seo: quote.seo,
      type: "ContactPage",
    });
    const page = byType(data, "ContactPage");
    const trail = byType(data, "BreadcrumbList");
    expect(trail.itemListElement).toHaveLength(2);
    expect(page.breadcrumb).toEqual({ "@id": trail["@id"] });
    expect(page.name).toBe(`${quote.seo.title} | Marcenaria Butantã`);
  });

  it("liga site, página e empresa num único grafo", () => {
    const data = homeData();
    const page = byType(data, "WebPage");
    expect(page).toMatchObject({
      url: "https://www.marcenariabutanta.com.br/",
      isPartOf: { "@id": byType(data, "WebSite")["@id"] },
      about: { "@id": byType(data, "HomeAndConstructionBusiness")["@id"] },
      primaryImageOfPage: {
        url: "https://www.marcenariabutanta.com.br/og/home.jpg",
        width: 1200,
        height: 630,
      },
    });
  });

  it("lista os serviços no catálogo da empresa, com os mesmos @id das páginas", () => {
    const catalog = byType(homeData(), "HomeAndConstructionBusiness").hasOfferCatalog as {
      itemListElement: { itemOffered: { "@id": string } }[];
    };
    expect(catalog.itemListElement).toHaveLength(allServices.length);
    const fromServicePage = byType(serviceStructuredData(siteData, service), "Service")["@id"];
    expect(catalog.itemListElement.map((offer) => offer.itemOffered["@id"])).toContain(
      fromServicePage,
    );
  });

  it("oferece canal de contato com o telefone da empresa", () => {
    expect(byType(homeData(), "HomeAndConstructionBusiness").contactPoint).toMatchObject({
      "@type": "ContactPoint",
      telephone: "+5511958522265",
      contactType: "customer service",
    });
  });

  it("escapa < para o conteúdo nunca fechar a tag <script>", () => {
    const data = { name: "</script><script>alert(1)</script>" };
    const json = serializeJsonLd(data);
    expect(json).not.toContain("</script>");
    expect(JSON.parse(json)).toEqual(data);
  });
});
