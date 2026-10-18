import "server-only";

import home from "@/content/home.json";
import photosGenerated from "@/content/photos.generated.json";
import photos from "@/content/photos.json";
import quote from "@/content/quote.json";
import services from "@/content/services.json";
import site from "@/content/site.json";

import { loadContent } from "./load";

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

export type { Photo } from "./load";
export type { HomeContent, QuotePageContent, Service, Site } from "./schemas";
