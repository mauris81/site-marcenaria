import "server-only";

import home from "@/content/home.json";
import photosGenerated from "@/content/photos.generated.json";
import photos from "@/content/photos.json";
import quote from "@/content/quote.json";
import services from "@/content/services.json";
import site from "@/content/site.json";

import { loadContent } from "./load";
import type { Service } from "./schemas";

// Repositório de conteúdo: o único ponto do app que sabe de onde os dados vêm.
// Hoje é JSON local, validado uma vez durante o build. As funções são assíncronas
// de propósito — imitam uma API/CMS, então trocar a fonte de dados no futuro
// não exige mudar nenhuma página ou componente.
const content = loadContent({ site, photos, photosGenerated, home, services, quote });

export async function getSite() {
  return content.site;
}

export async function getHomeContent() {
  return content.home;
}

export async function getServices() {
  return content.services;
}

export async function getService(slug: string) {
  return content.services.find((service) => service.slug === slug);
}

export async function getQuoteContent() {
  return content.quote;
}

export async function getPhoto(id: string) {
  return content.photos.find((photo) => photo.id === id);
}

/** Item de galeria pronto para o navegador: dados da foto otimizada + legenda. */
export type GalleryItem = {
  src: string;
  alt: string;
  caption: string;
  width: number;
  height: number;
  blurDataURL: string;
};

/** Galeria de um serviço com os dados de cada foto resolvidos a partir do catálogo. */
export async function getGallery(service: Service): Promise<GalleryItem[]> {
  return service.gallery.items.map(({ photo: id, caption }) => {
    const photo = content.photos.find((candidate) => candidate.id === id);
    // A integridade das referências já é garantida no carregamento do conteúdo.
    if (!photo) throw new Error(`Foto "${id}" ausente do catálogo.`);
    return {
      src: `/images/${photo.id}`,
      alt: photo.alt,
      caption,
      width: photo.width,
      height: photo.height,
      blurDataURL: photo.blurDataURL,
    };
  });
}

export type { Photo } from "./load";
export type { HomeContent, QuotePageContent, Service, Site } from "./schemas";
