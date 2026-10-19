import type { Metadata, Viewport } from "next";
import { Fraunces, Manrope } from "next/font/google";

import { getSite } from "@/lib/content";

import "./globals.css";

// Fontes auto-hospedadas pelo next/font: baixadas no build e servidas junto com
// o site (nenhuma requisição ao Google em produção), com métricas de fallback
// ajustadas para não haver deslocamento de layout (CLS) quando a fonte carrega.
const fraunces = Fraunces({
  subsets: ["latin"],
  axes: ["opsz"],
  style: ["normal", "italic"],
  variable: "--font-fraunces",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
});

export async function generateMetadata(): Promise<Metadata> {
  const site = await getSite();
  return {
    // Base das URLs absolutas (canônicas, Open Graph): o domínio de produção,
    // mesmo nos builds locais e nas prévias.
    metadataBase: new URL(`${site.url}/`),
    title: { default: site.name, template: `%s | ${site.name}` },
    description: site.description,
    applicationName: site.name,
    // Libera prévias grandes de imagem e trechos completos nos resultados do
    // Google (busca e Discover). Páginas fora da busca sobrescrevem com noindex.
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
  };
}

export const viewport: Viewport = {
  themeColor: "#110d0a",
};

// Layout raiz: documento, fontes e metadados comuns. Cabeçalho e rodapé ficam
// em (site)/layout.tsx, para que /links tenha uma página própria, sem eles.
export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pt-BR"
      // Mantém a navegação entre páginas instantânea mesmo com scroll suave nas âncoras.
      data-scroll-behavior="smooth"
      className={`${fraunces.variable} ${manrope.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
