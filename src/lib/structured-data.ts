import type { Service, Site } from "@/lib/content";
import { absoluteUrl, shareImagePath, SHARE_IMAGE_SIZE } from "@/lib/seo";

// Dados estruturados (schema.org em JSON-LD) para o Google entender a empresa,
// os serviços e cada página. Os nós se ligam por @id num único grafo por página
// (site → página → empresa/serviço → trilha). Usa só fatos do conteúdo
// (site.json e services.json): nada de endereço completo, horário ou
// avaliações inventadas.

type Path = `/${string}`;
type Crumb = { name: string; path: Path };
type PageSeo = { title: string; description: string };

const siteId = (site: Site) => absoluteUrl(site, "/#site");
const businessId = (site: Site) => absoluteUrl(site, "/#empresa");
const serviceId = (site: Site, path: Path) => `${absoluteUrl(site, path)}#servico`;
const pageId = (site: Site, path: Path) => `${absoluteUrl(site, path)}#pagina`;
const breadcrumbId = (site: Site, path: Path) => `${absoluteUrl(site, path)}#trilha`;

const areaServed = (site: Site) =>
  site.area.neighborhoods.map((name) => ({
    "@type": "Place",
    name: `${name}, ${site.area.city} - ${site.area.state}`,
  }));

function website(site: Site) {
  return {
    "@type": "WebSite",
    "@id": siteId(site),
    url: absoluteUrl(site, "/"),
    name: site.name,
    inLanguage: site.locale,
    publisher: { "@id": businessId(site) },
  };
}

/** Empresa; na home, com o catálogo de serviços. */
function business(site: Site, services?: Service[]) {
  const telephone = `+${site.contact.whatsapp}`;
  return {
    "@type": "HomeAndConstructionBusiness",
    "@id": businessId(site),
    name: site.name,
    description: site.description,
    url: absoluteUrl(site, "/"),
    telephone,
    image: absoluteUrl(site, shareImagePath("/")),
    logo: absoluteUrl(site, "/apple-icon.png"),
    sameAs: [
      site.contact.instagram.url,
      ...(site.contact.googleMaps ? [site.contact.googleMaps] : []),
    ],
    address: {
      "@type": "PostalAddress",
      addressLocality: site.area.city,
      addressRegion: site.area.state,
      addressCountry: "BR",
    },
    areaServed: areaServed(site),
    contactPoint: {
      "@type": "ContactPoint",
      telephone,
      contactType: "customer service",
      availableLanguage: site.locale,
    },
    ...(services && {
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: `Serviços da ${site.name}`,
        itemListElement: services.map((service) => {
          const path = `/${service.slug}` as const;
          return {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              "@id": serviceId(site, path),
              name: service.name,
              url: absoluteUrl(site, path),
            },
          };
        }),
      },
    }),
  };
}

/** A página em si: título, descrição, imagem principal, assunto e trilha. */
function webPage(
  site: Site,
  page: { path: Path; seo: PageSeo; about: string; type?: "WebPage" | "ContactPage" },
  withBreadcrumb: boolean,
) {
  return {
    "@type": page.type ?? "WebPage",
    "@id": pageId(site, page.path),
    url: absoluteUrl(site, page.path),
    name: `${page.seo.title} | ${site.name}`,
    description: page.seo.description,
    inLanguage: site.locale,
    isPartOf: { "@id": siteId(site) },
    about: { "@id": page.about },
    primaryImageOfPage: {
      "@type": "ImageObject",
      url: absoluteUrl(site, shareImagePath(page.path)),
      ...SHARE_IMAGE_SIZE,
    },
    ...(withBreadcrumb && { breadcrumb: { "@id": breadcrumbId(site, page.path) } }),
  };
}

function breadcrumbs(site: Site, path: Path, crumbs: Crumb[]) {
  return {
    "@type": "BreadcrumbList",
    "@id": breadcrumbId(site, path),
    itemListElement: crumbs.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      item: absoluteUrl(site, crumb.path),
    })),
  };
}

const graph = (nodes: object[]) => ({ "@context": "https://schema.org", "@graph": nodes });

const home: Crumb = { name: "Início", path: "/" };

export function homeStructuredData(
  site: Site,
  { seo, services }: { seo: PageSeo; services: Service[] },
) {
  return graph([
    website(site),
    business(site, services),
    webPage(site, { path: "/", seo, about: businessId(site) }, false),
  ]);
}

export function serviceStructuredData(site: Site, service: Service) {
  const path = `/${service.slug}` as const;
  return graph([
    website(site),
    business(site),
    {
      "@type": "Service",
      "@id": serviceId(site, path),
      name: service.name,
      serviceType: service.quoteType,
      description: service.seo.description,
      url: absoluteUrl(site, path),
      image: absoluteUrl(site, shareImagePath(path)),
      provider: { "@id": businessId(site) },
      areaServed: areaServed(site),
    },
    webPage(site, { path, seo: service.seo, about: serviceId(site, path) }, true),
    breadcrumbs(site, path, [home, { name: service.name, path }]),
  ]);
}

/** Páginas avulsas (ex.: orçamento, como ContactPage). */
export function pageStructuredData(
  site: Site,
  page: Crumb & { seo: PageSeo; type?: "WebPage" | "ContactPage" },
) {
  return graph([
    website(site),
    business(site),
    webPage(
      site,
      { path: page.path, seo: page.seo, about: businessId(site), type: page.type },
      true,
    ),
    breadcrumbs(site, page.path, [home, page]),
  ]);
}

/** JSON para a tag <script>: `<` escapado, para o conteúdo nunca fechar a tag. */
export function serializeJsonLd(data: object) {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
