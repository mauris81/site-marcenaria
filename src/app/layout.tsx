import type { Metadata, Viewport } from "next";
import { Fraunces, Manrope } from "next/font/google";
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

export const metadata: Metadata = {
  title: "Marcenaria sob medida em São Paulo | Marcenaria Butantã",
  description:
    "Marcenaria sob medida na Zona Oeste de São Paulo para cozinhas planejadas, dormitórios, home offices, painéis e móveis personalizados.",
};

export const viewport: Viewport = {
  themeColor: "#110d0a",
};

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
