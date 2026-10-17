import { z } from "zod";

import { homeSchema, photosSchema, quotePageSchema, servicesSchema, siteSchema } from "./schemas";

export type RawContent = {
  site: unknown;
  photos: unknown;
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
  const photos = parse(photosSchema, raw.photos, "photos.json");
  const home = parse(homeSchema, raw.home, "home.json");
  const services = parse(servicesSchema, raw.services, "services.json");
  const quote = parse(quotePageSchema, raw.quote, "quote.json");

  const problems: string[] = [];
  const photoIds = new Set(photos.map((photo) => photo.id));
  const requirePhoto = (id: string, where: string) => {
    if (!photoIds.has(id)) problems.push(`${where}: a foto "${id}" não existe em photos.json`);
  };

  requirePhoto(home.hero.photo, "home.json › hero.photo");
  requirePhoto(quote.hero.photo, "quote.json › hero.photo");

  for (const service of services) {
    const at = `services.json › ${service.slug}`;
    requirePhoto(service.hero.photo, `${at} › hero.photo`);
    requirePhoto(service.card.photo, `${at} › card.photo`);
    service.gallery.items.forEach((item, index) =>
      requirePhoto(item.photo, `${at} › gallery.items[${index}]`),
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

  return { site, photos, home, services, quote };
}

export type Content = ReturnType<typeof loadContent>;

function parse<T extends z.ZodType>(schema: T, data: unknown, file: string): z.output<T> {
  const result = schema.safeParse(data);
  if (!result.success) {
    throw new Error(`Conteúdo inválido em src/content/${file}:\n${z.prettifyError(result.error)}`);
  }
  return result.data;
}
