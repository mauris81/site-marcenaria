import type { Metadata, Route, Viewport } from "next";
import { Fraunces, Manrope } from "next/font/google";

import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader, type NavItem } from "@/components/layout/site-header";
import { SkipLink } from "@/components/layout/skip-link";
import { WhatsAppButton } from "@/components/layout/whatsapp-button";
import { PointerEffects } from "@/components/motion/pointer-effects";
import { SmoothScroll } from "@/components/motion/smooth-scroll";
import { getServices, getSite } from "@/lib/content";
import { whatsappUrl } from "@/lib/whatsapp";

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
  title: {
    default: "Marcenaria sob medida em São Paulo | Marcenaria Butantã",
    template: "%s | Marcenaria Butantã",
  },
  description:
    "Marcenaria sob medida na Zona Oeste de São Paulo para cozinhas planejadas, dormitórios, home offices, painéis e móveis personalizados.",
};

export const viewport: Viewport = {
  themeColor: "#110d0a",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const [site, services] = await Promise.all([getSite(), getServices()]);
  // A navegação nasce dos dados: cadastrar um serviço já o coloca no menu e no rodapé.
  const nav: NavItem[] = services.map((service) => ({
    label: service.navLabel,
    href: `/${service.slug}` as Route,
  }));
  const whatsappHref = whatsappUrl(site.contact.whatsapp, site.whatsappMessage);

  return (
    <html
      lang="pt-BR"
      // Mantém a navegação entre páginas instantânea mesmo com scroll suave nas âncoras.
      data-scroll-behavior="smooth"
      className={`${fraunces.variable} ${manrope.variable}`}
    >
      <body>
        <SmoothScroll />
        <PointerEffects />
        <SkipLink />
        <SiteHeader
          nav={nav}
          whatsappHref={whatsappHref}
          instagramHref={site.contact.instagram.url}
        />
        <main id="conteudo" tabIndex={-1} className="outline-none">
          {children}
        </main>
        <SiteFooter site={site} nav={nav} whatsappHref={whatsappHref} />
        <WhatsAppButton href={whatsappHref} />
      </body>
    </html>
  );
}
