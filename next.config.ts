import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Gera um site 100% estático (SSG) em `out/`: cada rota vira um HTML pronto,
  // servível por qualquer host estático. Sem `trailingSlash`, a rota
  // `/cozinhas-planejadas` é exportada como `cozinhas-planejadas.html`,
  // a mesma URL do site atual — links e indexação existentes continuam válidos.
  output: "export",

  // Links internos (`<Link href>`) passam a ser checados pelo TypeScript:
  // um link para uma rota inexistente quebra o build em vez de virar 404.
  typedRoutes: true,

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
