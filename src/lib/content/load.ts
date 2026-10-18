import { z } from "zod";

import {
  homeSchema,
  photosGeneratedSchema,
  photosSchema,
  quotePageSchema,
  servicesSchema,
  siteSchema,
} from "./schemas";

export type RawContent = {
  site: unknown;
  photos: unknown;
  photosGenerated: unknown;
  home: unknown;
  services: unknown;
  quote: unknown;
};

/**
 * Valida o conteúdo de cada arquivo e as referências entre eles.
 * Roda durante o build: um dado inválido interrompe a geração do site com
 * uma mensagem que aponta o arquivo e o campo, em vez de publicar uma página quebrada.
 */
export function loadContent(raw: RawContent) {
  const site = parse(siteSchema, raw.site, "site.json");
  const catalog = parse(photosSchema, raw.photos, "photos.json");
  const generated = parse(photosGeneratedSchema, raw.photosGenerated, "photos.generated.json");
  const home = parse(homeSchema, raw.home, "home.json");
  const services = parse(servicesSchema, raw.services, "services.json");
  const quote = parse(quotePageSchema, raw.quote, "quote.json");

  const problems: string[] = [];

  for (const photo of catalog) {
    if (!generated.photos[photo.id]) {
      problems.push(`photos.json › ${photo.id}: sem versões otimizadas — rode "npm run images"`);
    }
  }

  const photoIds = new Set(catalog.map((photo) => photo.id));
  const requirePhoto = (id: string | undefined, where: string) => {
    if (id !== undefined && !photoIds.has(id)) {
      problems.push(`${where}: a foto "${id}" não existe em photos.json`);
    }
  };

  // Toda página precisa de uma foto para a imagem de compartilhamento
  // (scripts/generate-og.mjs): a de seo.ogPhoto ou, na falta dela, a do hero.
  type Page = { seo: { ogPhoto?: string }; hero: { photo?: string } };
  const requireSharePhoto = (page: Page, where: string) => {
    requirePhoto(page.seo.ogPhoto, `${where} › seo.ogPhoto`);
    if (!page.seo.ogPhoto && !page.hero.photo) {
      problems.push(
        `${where} › seo.ogPhoto: defina a foto de compartilhamento (o hero não tem foto)`,
      );
    }
  };

  requirePhoto(home.hero.photo, "home.json › hero.photo");
  requirePhoto(quote.hero.photo, "quote.json › hero.photo");
  requireSharePhoto(home, "home.json");
  requireSharePhoto(quote, "quote.json");

  for (const service of services) {
    const at = `services.json › ${service.slug}`;
    requirePhoto(service.hero.photo, `${at} › hero.photo`);
    requireSharePhoto(service, at);
    requirePhoto(service.card.photo, `${at} › card.photo`);
    service.gallery.items.forEach((item, index) =>
      requirePhoto(item.photo, `${at} › gallery.items[${index}]`),
    );
    service.showcase?.photos.forEach((id, index) =>
      requirePhoto(id, `${at} › showcase.photos[${index}]`),
    );
    if (!quote.form.projectTypes.includes(service.quoteType)) {
      problems.push(
        `${at} › quoteType: "${service.quoteType}" não está em quote.json › form.projectTypes`,
      );
    }
  }

  if (problems.length > 0) {
    throw new Error(`Conteúdo inconsistente:\n- ${problems.join("\n- ")}`);
  }

  // Cada foto do catálogo já sai com dimensões, placeholder e o endereço das
  // versões otimizadas (o loader do next/image completa com a largura).
  const photos = catalog.map((photo) => {
    const optimized = generated.photos[photo.id];
    return { ...photo, ...optimized, src: `/images/${photo.id}.${optimized.version}` as const };
  });

  return { site, photos, home, services, quote };
}

export type Content = ReturnType<typeof loadContent>;
export type Photo = Content["photos"][number];

function parse<T extends z.ZodType>(schema: T, data: unknown, file: string): z.output<T> {
  const result = schema.safeParse(data);
  if (!result.success) {
    throw new Error(`Conteúdo inválido em src/content/${file}:\n${z.prettifyError(result.error)}`);
  }
  return result.data;
}
