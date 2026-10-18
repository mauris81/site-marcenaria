// Gera as texturas de madeira das cenas de móveis (armário, gaveta, porta de
// correr, ripado) em src/assets/textures/.
//
// A lâmina é desenhada por um modelo de tronco: anéis de crescimento cilíndricos
// cortados por um plano que se aproxima e se afasta do miolo ao longo da peça.
// Perto do miolo os anéis viram arcos (o veio "catedral"); longe dele, linhas
// quase retas. Por cima entram ondulação do veio, fibras, poros e manchas de tom.
// Cada imagem é calculada no dobro do tamanho e reduzida, para o veio sair
// nítido e sem serrilhado.
//
// O resultado é sempre o mesmo (sementes fixas) e fica versionado: o build não
// roda este script. `npm run textures` regera as imagens depois de um ajuste.

import { mkdir } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import sharp from "sharp";

const root = fileURLToPath(new URL("..", import.meta.url));
const outDir = join(root, "src", "assets", "textures");

/** Gerador pseudoaleatório pequeno e determinístico (mulberry32). */
function random(seed) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Ruído de Perlin 2D (versão "improved"), com saída em torno de -1 a 1. */
function perlin(seed) {
  const next = random(seed);
  const order = Array.from({ length: 256 }, (_, i) => i);
  for (let i = 255; i > 0; i--) {
    const j = Math.floor(next() * (i + 1));
    [order[i], order[j]] = [order[j], order[i]];
  }
  const p = new Uint8Array(512);
  for (let i = 0; i < 512; i++) p[i] = order[i & 255];
  const fade = (t) => t * t * t * (t * (t * 6 - 15) + 10);
  const grad = (hash, x, y) => {
    const h = hash & 7;
    const u = h < 4 ? x : y;
    const v = h < 4 ? y : x;
    return (h & 1 ? -u : u) + (h & 2 ? -2 * v : 2 * v);
  };
  return (x, y) => {
    const xi = Math.floor(x);
    const yi = Math.floor(y);
    const X = xi & 255;
    const Y = yi & 255;
    const xf = x - xi;
    const yf = y - yi;
    const u = fade(xf);
    const v = fade(yf);
    const a = p[X] + Y;
    const b = p[X + 1] + Y;
    const top = grad(p[a], xf, yf) + u * (grad(p[b], xf - 1, yf) - grad(p[a], xf, yf));
    const bottom =
      grad(p[a + 1], xf, yf - 1) +
      u * (grad(p[b + 1], xf - 1, yf - 1) - grad(p[a + 1], xf, yf - 1));
    return (top + v * (bottom - top)) * 0.5;
  };
}

/** Soma de oitavas do ruído (detalhe em várias escalas). */
function fbm(noise, x, y, octaves) {
  let sum = 0;
  let amplitude = 1;
  let norm = 0;
  for (let octave = 0; octave < octaves; octave++) {
    sum += amplitude * noise(x, y);
    norm += amplitude;
    amplitude *= 0.5;
    x *= 2.03;
    y *= 2.03;
  }
  return sum / norm;
}

const smoothstep = (edge0, edge1, x) => {
  const t = Math.min(1, Math.max(0, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
};

/** Valor fixo entre 0 e 1 para cada anel (intensidade própria de cada linha do veio). */
const ringHash = (ring, seed) => {
  const s = Math.sin(ring * 127.1 + seed * 311.7) * 43758.5453;
  return s - Math.floor(s);
};

/** Linha fina onde o ruído cruza o zero: vira veios que se juntam e se separam. */
const ridge = (value, thickness) => Math.pow(Math.max(0, 1 - Math.abs(value) / thickness), 2);

/**
 * Cor de um ponto da lâmina. `across` e `along` são milímetros na peça
 * (atravessando o veio e ao longo dele).
 */
function createWood({ seed, width, length, ringWidth, pithDepth, cathedral, light, dark }) {
  const noise = Array.from({ length: 10 }, (_, i) => perlin(seed * 16 + i));
  return (across, along) => {
    // O tronco não é reto: o veio inteiro ondula de leve ao longo da peça.
    const u = across + fbm(noise[0], along * 0.0024, across * 0.004, 3) * 16;

    // Veios: linhas finas, longas no sentido do veio, em duas escalas. A
    // intensidade de cada região varia devagar, então as linhas surgem e somem.
    const strong = ridge(fbm(noise[1], u * 0.11, along * 0.0014, 2), 0.12);
    const fine = ridge(fbm(noise[2], u * 0.32, along * 0.0042, 2), 0.12);
    const presence = 0.55 + 0.45 * fbm(noise[3], u * 0.02, along * 0.0019, 2);
    const veins = (strong * 0.75 + fine * 0.35) * presence;

    // Catedral: anéis cortados por um plano inclinado, que se aproxima do miolo
    // num sentido só, como numa tábua real. Assim os arcos ficam abertos e
    // apontam todos para o mesmo lado, sem formar "olhos" de nó; longe do miolo,
    // os anéis são quase retos.
    const pith = width * (0.5 + 0.22 * fbm(noise[4], along * 0.0013, 1.7, 2));
    const depth =
      pithDepth +
      (length * 0.7 - along) * 0.06 +
      pithDepth * 0.05 * fbm(noise[5], along * 0.0018, 3.9, 2);
    const offset = u - pith;
    const radius =
      Math.sqrt(offset * offset + depth * depth) +
      fbm(noise[6], u * 0.03, along * 0.004, 2) * ringWidth * 0.8;
    const position = radius / ringWidth;
    const ring = Math.floor(position);
    const rings =
      Math.pow(Math.max(0, Math.cos(2 * Math.PI * position)), 10) *
      (0.25 + 0.75 * ringHash(ring, seed));

    // Fibras, poros em traços curtos e faixas de tom (largas e estreitas).
    const fiber = fbm(noise[7], u * 0.6, along * 0.016, 2);
    const pore = smoothstep(0.45, 0.75, noise[8](u * 0.85, along * 0.06));
    const band =
      fbm(noise[9], u * 0.016, along * 0.0011, 3) * 0.75 +
      fbm(noise[9], u * 0.07 + 31, along * 0.0035, 2) * 0.25;

    const mix = Math.min(1, veins * 0.5 + rings * cathedral + pore * 0.14);
    const shade = 1 + fiber * 0.08 + band * 0.17;
    // Nas faixas escuras a madeira também fica mais quente (menos azul).
    const warmth = [1, 1.04, 1.12];
    return [0, 1, 2].map(
      (c) => (light[c] + (dark[c] - light[c]) * mix) * Math.pow(shade, warmth[c]),
    );
  };
}

/**
 * Renderiza uma lâmina com o veio na vertical (`vertical`) ou na horizontal,
 * em `size` pixels finais, e grava em WebP.
 */
async function render({ name, size: [width, height], vertical, wood, quality = 74 }) {
  const scale = 2;
  const w = width * scale;
  const h = height * scale;
  // Milímetros por pixel: a peça ocupa `wood.width` mm atravessando o veio.
  const mm = wood.width / (vertical ? w : h);
  const sample = createWood({ ...wood, length: (vertical ? h : w) * mm });
  const pixels = Buffer.alloc(w * h * 3);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const [across, along] = vertical ? [x * mm, y * mm] : [y * mm, x * mm];
      const rgb = sample(across, along);
      const i = (y * w + x) * 3;
      for (let c = 0; c < 3; c++) pixels[i + c] = Math.max(0, Math.min(255, Math.round(rgb[c])));
    }
  }
  const file = join(outDir, `${name}.webp`);
  const info = await sharp(pixels, { raw: { width: w, height: h, channels: 3 } })
    .resize(width, height, { kernel: "lanczos3" })
    .webp({ quality, effort: 6 })
    .toFile(file);
  console.log(`${name}.webp  ${width}×${height}  ${(info.size / 1024).toFixed(1)} KB`);
}

// Carvalho natural, no tom das portas da marcenaria (fotos em assets/photos).
const OAK = { light: [201, 147, 93], dark: [118, 74, 38] };

await mkdir(outDir, { recursive: true });
await render({
  name: "oak-vertical",
  size: [640, 1280],
  vertical: true,
  wood: { seed: 7, width: 420, ringWidth: 9, pithDepth: 90, cathedral: 0.14, ...OAK },
});
await render({
  name: "oak-horizontal",
  size: [1280, 640],
  vertical: false,
  wood: { seed: 23, width: 420, ringWidth: 9, pithDepth: 110, cathedral: 0.12, ...OAK },
});
