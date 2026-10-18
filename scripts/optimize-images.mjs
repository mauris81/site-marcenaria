// Gera as versões otimizadas das fotos do catálogo (src/content/photos.json):
//
// - public/images/<id>-<largura>.webp — uma por largura de src/lib/image-widths.json
//   (arquivos gerados, fora do Git). O loader do next/image aponta para elas.
// - src/content/photos.generated.json — dimensões e placeholder borrado de cada
//   foto (versionado, pois o site precisa dele para compilar).
//
// Roda sozinho antes de `dev` e `build`. Fotos já processadas são puladas;
// use `npm run images -- --force` para refazer todas. Fotos com `"trim": true` no
// catálogo têm tarjas pretas uniformes recortadas (ex.: capturas de tela).

import { createHash } from "node:crypto";
import { existsSync } from "node:fs";
import { mkdir, readdir, readFile, rm, stat, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import sharp from "sharp";

const QUALITY = 72;

const root = fileURLToPath(new URL("..", import.meta.url));
const outDir = join(root, "public", "images");
const generatedFile = join(root, "src", "content", "photos.generated.json");

const readJson = async (path) => JSON.parse(await readFile(path, "utf8"));
const { deviceSizes, imageSizes } = await readJson(join(root, "src", "lib", "image-widths.json"));
const widths = [...imageSizes, ...deviceSizes].sort((a, b) => a - b);
const settings = { quality: QUALITY, widths };

const photos = await readJson(join(root, "src", "content", "photos.json"));
const previous = existsSync(generatedFile) ? await readJson(generatedFile) : null;
const sameSettings = JSON.stringify(previous?.settings) === JSON.stringify(settings);
const force = process.argv.includes("--force") || !sameSettings;

await mkdir(outDir, { recursive: true });

const generated = { settings, photos: {} };
const totals = { processed: 0, originalBytes: 0, servedBytes: 0 };

for (const photo of photos) {
  const source = join(root, photo.file);
  if (!existsSync(source)) {
    throw new Error(`Foto "${photo.id}": arquivo não encontrado em ${photo.file}`);
  }
  const sourceStat = await stat(source);
  const outputs = widths.map((width) => join(outDir, `${photo.id}-${width}.webp`));
  const cached = previous?.photos?.[photo.id];
  // Assinatura do processamento: muda se o conteúdo do arquivo ou os ajustes da
  // foto mudarem. Pelo conteúdo (e não pela data), é a mesma em qualquer clone.
  const hash = createHash("sha1")
    .update(await readFile(source))
    .digest("hex");
  const signature = `${hash.slice(0, 16)}-${photo.trim ? "trim" : "full"}`;

  if (!force && cached?.signature === signature && outputs.every((file) => existsSync(file))) {
    generated.photos[photo.id] = cached;
  } else {
    // Decodifica o original (até 18 MP) uma única vez, já aplicando a orientação
    // do EXIF, e deriva todas as larguras desses pixels. Os metadados (EXIF) não
    // são copiados para as versões geradas.
    let pipeline = sharp(source).rotate();
    if (photo.trim) {
      // Materializa a rotação antes do recorte das tarjas.
      pipeline = sharp(await pipeline.toBuffer()).trim({ background: "#000000", threshold: 18 });
    }
    const { data, info } = await pipeline
      .resize({ width: widths.at(-1), withoutEnlargement: true })
      .raw()
      .toBuffer({ resolveWithObject: true });
    const pixels = () =>
      sharp(data, { raw: { width: info.width, height: info.height, channels: info.channels } });

    await Promise.all(
      outputs.map((output, index) =>
        pixels()
          .resize({ width: widths[index], withoutEnlargement: true })
          .webp({ quality: QUALITY })
          .toFile(output),
      ),
    );
    const blur = await pixels().resize({ width: 16 }).webp({ quality: 40 }).toBuffer();

    generated.photos[photo.id] = {
      signature,
      width: info.width,
      height: info.height,
      blurDataURL: `data:image/webp;base64,${blur.toString("base64")}`,
    };
    totals.processed += 1;
  }

  totals.originalBytes += sourceStat.size;
  // Referência de "peso servido": a versão de 1080 px, a mais pedida por celulares e notebooks.
  totals.servedBytes += (await stat(join(outDir, `${photo.id}-1080.webp`))).size;
}

// Apaga versões de fotos que saíram do catálogo.
const expected = new Set(photos.flatMap((p) => widths.map((w) => `${p.id}-${w}.webp`)));
for (const file of await readdir(outDir)) {
  if (!expected.has(file)) await rm(join(outDir, file));
}

await writeFile(generatedFile, `${JSON.stringify(generated, null, 2)}\n`);

const mb = (bytes) => `${(bytes / 1024 / 1024).toFixed(1)} MB`;
console.log(
  `images: ${photos.length} fotos (${totals.processed} processadas agora) · ` +
    `originais ${mb(totals.originalBytes)} → ${mb(totals.servedBytes)} na versão de 1080 px`,
);
