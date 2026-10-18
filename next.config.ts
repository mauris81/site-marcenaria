import type { NextConfig } from "next";

import imageWidths from "./src/lib/image-widths.json";

const nextConfig: NextConfig = {
  // Gera um site 100% estático (SSG) em `out/`: cada rota vira um HTML pronto,
  // servível por qualquer host estático. Sem `trailingSlash`, a rota
  // `/cozinhas-planejadas` é exportada como `cozinhas-planejadas.html`,
  // a mesma URL do site atual — links e indexação existentes continuam válidos.
  output: "export",

  // No GitHub Pages de projeto o site vive em /site-marcenaria: o workflow de
  // publicação define NEXT_PUBLIC_BASE_PATH e o Next prefixa links e arquivos.
  // Localmente fica vazio e o site abre na raiz (localhost:3000).
  basePath: process.env.NEXT_PUBLIC_BASE_PATH ?? "",

  // Links internos (`<Link href>`) passam a ser checados pelo TypeScript:
  // um link para uma rota inexistente quebra o build em vez de virar 404.
  typedRoutes: true,

  // Fotos servidas nas versões WebP pré-geradas por scripts/optimize-images.mjs
  // (o otimizador padrão do Next exige servidor, incompatível com o export).
  images: {
    loader: "custom",
    loaderFile: "./src/lib/image-loader.ts",
    ...imageWidths,
  },

  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
