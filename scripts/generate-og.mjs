// Gera as imagens de compartilhamento (Open Graph) de cada página em public/og/:
// home.jpg, <slug do serviço>.jpg e orcamento.jpg — os nomes que
// src/lib/seo.ts (shareImagePath) coloca nos metadados.
//
// 1200×630: foto do ambiente sob um véu escuro, logo, título (com a ênfase em
// itálico, como no site) e o WhatsApp, nas fontes do site. O texto é diagramado
// pelo Satori (o motor do next/og) e aplicado sobre a foto com o sharp, em JPEG:
// bem mais leve que PNG e dentro do limite (~300 KB) para o WhatsApp mostrar a
// prévia. A foto vem de seo.ogPhoto ou, na falta dela, do hero da página.
//
// Roda antes do build (prebuild); `npm run og` gera só as imagens.

import { mkdir, readdir, readFile, rm, writeFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

// `next` não declara "exports": no ESM, o subcaminho precisa da extensão.
import { ImageResponse } from "next/og.js";
import { createElement as h } from "react";
import sharp from "sharp";

const WIDTH = 1200;
const HEIGHT = 630;
const MAX_BYTES = 300 * 1024;
const ESPRESSO = "17, 13, 10"; // espresso-900, em RGB para os véus com transparência
const COLORS = { ink: "#f3ede4", brand: "#e3b07e" }; // linen-100 e oak-300 (tema escuro)

const root = fileURLToPath(new URL("..", import.meta.url));
const outDir = join(root, "public", "og");
const require = createRequire(import.meta.url);
const readJson = async (path) => JSON.parse(await readFile(join(root, path), "utf8"));

const [site, home, services, quote, photos] = await Promise.all(
  ["site", "home", "services", "quote", "photos"].map((name) =>
    readJson(`src/content/${name}.json`),
  ),
);
const catalog = new Map(photos.map((photo) => [photo.id, photo]));

const pages = [
  { file: "home", ...home },
  ...services.map((service) => ({ file: service.slug, ...service })),
  { file: "orcamento", ...quote },
];

// Fontes do site em WOFF (o Satori não lê WOFF2), dos pacotes @fontsource.
const font = async (family, weight, style = "normal") => ({
  name: family[0].toUpperCase() + family.slice(1),
  weight,
  style,
  data: await readFile(
    join(
      dirname(require.resolve(`@fontsource/${family}`)),
      "files",
      `${family}-latin-${weight}-${style}.woff`,
    ),
  ),
});
const fonts = await Promise.all([
  font("fraunces", 400),
  font("fraunces", 400, "italic"),
  font("manrope", 500),
  font("manrope", 600),
  font("manrope", 700),
]);

const monogram = await sharp(join(root, "public", "brand", "monogram.webp"))
  .resize(128)
  .png()
  .toBuffer();
const monogramSrc = `data:image/png;base64,${monogram.toString("base64")}`;

/**
 * "Cozinha planejada *sob medida*" → palavras soltas e o trecho com ênfase
 * inteiro, que não se parte entre linhas.
 */
function words(title) {
  return title.split("*").flatMap((part, index) =>
    index % 2 === 1
      ? [{ word: part.trim(), emphasis: true }]
      : part
          .split(/\s+/)
          .filter(Boolean)
          .map((word) => ({ word, emphasis: false })),
  );
}

/** Camada de texto (PNG transparente) aplicada sobre a foto. */
function card({ eyebrow, title }) {
  const titleWords = words(title);
  const veil = (direction, stops) =>
    `linear-gradient(${direction}, ${stops.map(([alpha, at]) => `rgba(${ESPRESSO}, ${alpha}) ${at}%`).join(", ")})`;

  return h(
    "div",
    {
      style: {
        display: "flex",
        width: WIDTH,
        height: HEIGHT,
        fontFamily: "Manrope",
        color: COLORS.ink,
      },
    },
    // Véus: escurecem a esquerda, onde fica o texto, e a base — legível sobre qualquer foto.
    h("div", {
      style: {
        position: "absolute",
        top: 0,
        left: 0,
        width: WIDTH,
        height: HEIGHT,
        backgroundImage: veil("90deg", [
          [0.96, 0],
          [0.9, 45],
          [0.55, 75],
          [0.15, 100],
        ]),
      },
    }),
    h("div", {
      style: {
        position: "absolute",
        left: 0,
        bottom: 0,
        width: WIDTH,
        height: 220,
        backgroundImage: veil("0deg", [
          [0.8, 0],
          [0, 100],
        ]),
      },
    }),
    h(
      "div",
      {
        style: {
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          width: WIDTH,
          height: HEIGHT,
          padding: 72,
        },
      },
      // Logo: monograma + nome, como no cabeçalho do site.
      h(
        "div",
        { style: { display: "flex", alignItems: "center" } },
        h("img", { src: monogramSrc, width: 64, height: 64, style: { borderRadius: 14 } }),
        h(
          "div",
          { style: { display: "flex", flexDirection: "column", marginLeft: 18 } },
          h("div", { style: { fontSize: 22, fontWeight: 700, letterSpacing: 3.5 } }, "MARCENARIA"),
          h(
            "div",
            {
              style: {
                marginTop: 6,
                fontSize: 15,
                fontWeight: 500,
                letterSpacing: 6.9,
                color: COLORS.brand,
              },
            },
            "BUTANTÃ",
          ),
        ),
      ),
      h(
        "div",
        { style: { display: "flex", flexDirection: "column" } },
        eyebrow
          ? h(
              "div",
              {
                style: {
                  display: "flex",
                  alignItems: "center",
                  marginBottom: 22,
                  fontSize: 18,
                  fontWeight: 600,
                  letterSpacing: 4,
                  color: COLORS.brand,
                },
              },
              h("div", {
                style: { width: 40, height: 2, marginRight: 16, backgroundColor: COLORS.brand },
              }),
              h("span", null, eyebrow.toUpperCase()),
            )
          : null,
        h(
          "div",
          {
            style: {
              display: "flex",
              flexWrap: "wrap",
              fontFamily: "Fraunces",
              fontSize: 78,
              lineHeight: 1.02,
              letterSpacing: -1.5,
              width: 820,
            },
          },
          ...titleWords.map(({ word, emphasis }, index) =>
            h(
              "span",
              {
                style: {
                  marginRight: index < titleWords.length - 1 ? 20 : 0,
                  ...(emphasis && {
                    fontStyle: "italic",
                    color: COLORS.brand,
                    whiteSpace: "nowrap",
                  }),
                },
              },
              word,
            ),
          ),
        ),
      ),
      h(
        "div",
        { style: { display: "flex", alignItems: "center", fontSize: 22, fontWeight: 600 } },
        h("span", { style: { marginRight: 12, color: COLORS.brand } }, "WhatsApp"),
        h("span", null, site.contact.phone),
      ),
    ),
  );
}

/** Foto recortada em 1200×630 no ponto focal ("X% Y%"), como o `object-position` do site. */
async function background(id, position) {
  const photo = catalog.get(id);
  if (!photo) throw new Error(`og: a foto "${id}" não existe em photos.json`);
  let pipeline = sharp(join(root, photo.file)).rotate();
  if (photo.trim) {
    pipeline = sharp(await pipeline.toBuffer()).trim({ background: "#000000", threshold: 18 });
  }
  const { data, info } = await pipeline.raw().toBuffer({ resolveWithObject: true });
  const [x, y] = (position ?? photo.position ?? "50% 50%")
    .split(" ")
    .map((v) => parseFloat(v) / 100);
  const scale = Math.max(WIDTH / info.width, HEIGHT / info.height);
  const width = Math.round(info.width * scale);
  const height = Math.round(info.height * scale);
  return sharp(data, { raw: { width: info.width, height: info.height, channels: info.channels } })
    .resize(width, height)
    .extract({
      left: Math.round((width - WIDTH) * x),
      top: Math.round((height - HEIGHT) * y),
      width: WIDTH,
      height: HEIGHT,
    });
}

await mkdir(outDir, { recursive: true });
const sizes = [];

for (const page of pages) {
  const photo = page.seo.ogPhoto ?? page.hero.photo;
  if (!photo) throw new Error(`og: a página "${page.file}" não tem foto (defina seo.ogPhoto)`);
  const position =
    page.seo.ogPhotoPosition ?? (page.seo.ogPhoto ? undefined : page.hero.photoPosition);

  const overlay = Buffer.from(
    await new ImageResponse(card(page.hero), { width: WIDTH, height: HEIGHT, fonts }).arrayBuffer(),
  );
  const jpeg = await (
    await background(photo, position)
  )
    .composite([{ input: overlay }])
    .jpeg({ quality: 82, mozjpeg: true })
    .toBuffer();

  if (jpeg.length > MAX_BYTES) {
    throw new Error(
      `og: ${page.file}.jpg ficou com ${Math.round(jpeg.length / 1024)} KB (limite ~300 KB)`,
    );
  }
  await writeFile(join(outDir, `${page.file}.jpg`), jpeg);
  sizes.push(jpeg.length);
}

// Remove imagens de páginas que deixaram de existir.
const expected = new Set(pages.map((page) => `${page.file}.jpg`));
for (const file of await readdir(outDir)) {
  if (!expected.has(file)) await rm(join(outDir, file));
}

console.log(
  `og: ${pages.length} imagens de compartilhamento · maior ${Math.round(Math.max(...sizes) / 1024)} KB`,
);
