import type { Service, Site } from "@/lib/content";
import { absoluteUrl, shareImagePath } from "@/lib/seo";

// Dados estruturados (schema.org em JSON-LD) para o Google entender a empresa,
// os serviços e a hierarquia das páginas. Usa só fatos do conteúdo (site.json e
// services.json): nada de endereço completo, horário ou avaliações inventadas.

type Crumb = { name: string; path: `/${string}` };

const businessId = (site: Site) => absoluteUrl(site, "/#empresa");

const areaServed = (site: Site) =>
  site.area.neighborhoods.map((name) => ({
    "@type": "Place",
    name: `${name}, ${site.area.city} - ${site.area.state}`,
  }));

function website(site: Site) {
  return {
    "@type": "WebSite",
    "@id": absoluteUrl(site, "/#site"),
    url: absoluteUrl(site, "/"),
    name: site.name,
    inLanguage: site.locale,
    publisher: { "@id": businessId(site) },
  };
}

function business(site: Site) {
  return {
    "@type": "HomeAndConstructionBusiness",
    "@id": businessId(site),
    name: site.name,
    description: site.description,
    url: absoluteUrl(site, "/"),
    telephone: `+${site.contact.whatsapp}`,
    image: absoluteUrl(site, shareImagePath("/")),
    logo: absoluteUrl(site, "/apple-icon.png"),
    sameAs: [site.contact.instagram.url],
    address: {
      "@type": "PostalAddress",
      addressLocality: site.area.city,
      addressRegion: site.area.state,
      addressCountry: "BR",
    },
    areaServed: areaServed(site),
  };
}

function breadcrumbs(site: Site, crumbs: Crumb[]) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      item: absoluteUrl(site, crumb.path),
    })),
  };
}

/** Grafo da página: site e empresa em todas, mais os nós próprios da página. */
function graph(site: Site, nodes: object[] = []) {
  return { "@context": "https://schema.org", "@graph": [website(site), business(site), ...nodes] };
}

const home: Crumb = { name: "Início", path: "/" };

export function homeStructuredData(site: Site) {
  return graph(site);
}

export function serviceStructuredData(site: Site, service: Service) {
  const path = `/${service.slug}` as const;
  return graph(site, [
    {
      "@type": "Service",
      "@id": `${absoluteUrl(site, path)}#servico`,
      name: service.name,
      serviceType: service.quoteType,
      description: service.seo.description,
      url: absoluteUrl(site, path),
      image: absoluteUrl(site, shareImagePath(path)),
      provider: { "@id": businessId(site) },
      areaServed: areaServed(site),
    },
    breadcrumbs(site, [home, { name: service.name, path }]),
  ]);
}

export function pageStructuredData(site: Site, page: Crumb) {
  return graph(site, [breadcrumbs(site, [home, page])]);
}

/** JSON para a tag <script>: `<` escapado, para o conteúdo nunca fechar a tag. */
export function serializeJsonLd(data: object) {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
