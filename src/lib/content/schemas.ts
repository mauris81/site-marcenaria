import { z } from "zod";

// Contrato do conteúdo do site. Cada arquivo em src/content/ é validado contra
// estes schemas no build; os tipos TypeScript são inferidos daqui, então dado
// e código nunca divergem. Objetos "strict" rejeitam campos desconhecidos,
// o que pega erros de digitação nas chaves do JSON.

const text = z.string().trim().min(1, "não pode ficar vazio");

const slug = z
  .string()
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "use apenas letras minúsculas, números e hífens");

/** Referência a uma foto do catálogo (`id` em photos.json). */
const photoRef = slug;

const seo = z.strictObject({
  title: text.max(60, "títulos com mais de 60 caracteres são cortados pelo Google"),
  description: text.max(160, "descrições com mais de 160 caracteres são cortadas pelo Google"),
  ogDescription: text.max(200).optional(),
});

/** Ponto focal ao recortar a foto (CSS `object-position`), ex.: "50% 72%". */
const position = z.string().regex(/^\d{1,3}% \d{1,3}%$/, 'use o formato "X% Y%"');

const hero = z.strictObject({
  eyebrow: text.optional(),
  /** Trechos entre *asteriscos* são exibidos com ênfase (itálico na cor da marca). */
  title: text,
  text: text,
  /** Foto de fundo; sem ela, o hero usa o fundo escuro texturizado da marca. */
  photo: photoRef.optional(),
  /** Enquadramento da foto neste hero, se diferente do padrão do catálogo. */
  photoPosition: position.optional(),
});

const feature = z.strictObject({ title: text, text: text });
const step = z.strictObject({ label: text, title: text, text: text });
const cta = z.strictObject({ eyebrow: text.optional(), title: text, text: text });

/**
 * Cena interativa do serviço na Home (porta, gaveta...). Cada tipo de cena
 * comporta uma faixa de fotos; o limite garante que a animação nunca quebre.
 */
const showcaseLimits = { door: { min: 4, max: 6 }, drawer: { min: 4, max: 6 } } as const;

const showcase = z
  .strictObject({
    reveal: z.enum(["door", "drawer"]),
    /** Aceita *ênfase* entre asteriscos. */
    title: text,
    photos: z.array(photoRef),
  })
  .superRefine((value, ctx) => {
    const { min, max } = showcaseLimits[value.reveal];
    if (value.photos.length < min || value.photos.length > max) {
      ctx.addIssue({
        code: "custom",
        path: ["photos"],
        message: `a cena "${value.reveal}" exibe de ${min} a ${max} fotos (recebeu ${value.photos.length})`,
      });
    }
  });

export const photoSchema = z.strictObject({
  id: slug,
  /** Caminho do arquivo original, a partir da raiz do projeto. */
  file: z.string().regex(/\.(jpe?g|png|webp)$/i, "use uma imagem .jpg, .png ou .webp"),
  alt: text,
  position: position.optional(),
});

/** Saída de scripts/optimize-images.mjs (src/content/photos.generated.json). */
export const photosGeneratedSchema = z.strictObject({
  settings: z.strictObject({
    quality: z.number(),
    widths: z.array(z.int().positive()),
  }),
  photos: z.record(
    slug,
    z.strictObject({
      width: z.int().positive(),
      height: z.int().positive(),
      blurDataURL: z.string().startsWith("data:image/webp;base64,"),
    }),
  ),
});

export const photosSchema = z.array(photoSchema).superRefine((photos, ctx) => {
  const seen = new Set<string>();
  photos.forEach((photo, index) => {
    if (seen.has(photo.id)) {
      ctx.addIssue({ code: "custom", message: `id repetido: "${photo.id}"`, path: [index, "id"] });
    }
    seen.add(photo.id);
  });
});

export const siteSchema = z.strictObject({
  name: text,
  url: z.url(),
  locale: z.literal("pt-BR"),
  description: text.max(160),
  contact: z.strictObject({
    whatsapp: z.string().regex(/^55\d{10,11}$/, "use 55 + DDD + número, apenas dígitos"),
    phone: text,
    instagram: z.strictObject({ handle: z.string().startsWith("@"), url: z.url() }),
  }),
  whatsappMessage: text,
  area: z.strictObject({
    city: text,
    state: z.string().length(2),
    region: text,
    neighborhoods: z.array(text).min(1),
  }),
  credits: text,
});

export const homeSchema = z.strictObject({
  seo,
  hero,
  differentials: z.strictObject({
    eyebrow: text.optional(),
    title: text,
    items: z.array(feature).min(1),
  }),
  services: z.strictObject({ eyebrow: text.optional(), title: text, text: text.optional() }),
  process: z.strictObject({ eyebrow: text.optional(), title: text, steps: z.array(step).min(1) }),
  regions: z.strictObject({ eyebrow: text.optional(), title: text, text: text }),
  cta,
});

export const serviceSchema = z.strictObject({
  slug,
  navLabel: text,
  name: text,
  /** Tipo de projeto pré-selecionado no formulário (precisa existir em quote.json). */
  quoteType: text,
  seo,
  hero,
  card: z.strictObject({ text: text, cta: text, photo: photoRef }),
  highlights: z.strictObject({ title: text, items: z.array(feature).min(1) }),
  gallery: z.strictObject({
    title: text,
    items: z.array(z.strictObject({ photo: photoRef, caption: text })).min(1),
  }),
  process: z.strictObject({ title: text, text: text, steps: z.array(step).min(1) }),
  regionsTitle: text,
  cta,
  showcase: showcase.optional(),
});

export const servicesSchema = z
  .array(serviceSchema)
  .min(1)
  .superRefine((services, ctx) => {
    const seen = new Set<string>();
    services.forEach((service, index) => {
      if (seen.has(service.slug)) {
        ctx.addIssue({
          code: "custom",
          message: `slug repetido: "${service.slug}"`,
          path: [index, "slug"],
        });
      }
      seen.add(service.slug);
    });
  });

export const quotePageSchema = z.strictObject({
  seo,
  hero,
  channels: z.strictObject({
    title: text,
    form: feature,
    whatsapp: z.strictObject({ title: text, text: text, cta: text }),
  }),
  form: z.strictObject({
    title: text,
    projectTypes: z.array(text).min(1),
    privacy: text,
  }),
  steps: z.strictObject({ title: text, items: z.array(feature).min(1) }),
  regions: z.strictObject({ title: text, text: text }),
});

export type Site = z.infer<typeof siteSchema>;
export type HomeContent = z.infer<typeof homeSchema>;
export type Service = z.infer<typeof serviceSchema>;
export type QuotePageContent = z.infer<typeof quotePageSchema>;
