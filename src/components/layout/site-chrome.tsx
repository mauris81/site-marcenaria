import type { Route } from "next";
import type { ReactNode } from "react";

import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader, type NavItem } from "@/components/layout/site-header";
import { SkipLink } from "@/components/layout/skip-link";
import { WhatsAppButton } from "@/components/layout/whatsapp-button";
import { PointerEffects } from "@/components/motion/pointer-effects";
import { SmoothScroll } from "@/components/motion/smooth-scroll";
import { getServices, getSite } from "@/lib/content";
import { whatsappUrl } from "@/lib/whatsapp";

/**
 * Moldura das páginas do site: cabeçalho, rodapé, atalho do WhatsApp e os
 * efeitos de rolagem e cursor. Fica fora do layout raiz para que páginas
 * próprias, como /links, tenham visual independente.
 */
export async function SiteChrome({ children }: { children: ReactNode }) {
  const [site, services] = await Promise.all([getSite(), getServices()]);
  // A navegação nasce dos dados: cadastrar um serviço já o coloca no menu e no rodapé.
  const nav: NavItem[] = services.map((service) => ({
    label: service.navLabel,
    href: `/${service.slug}` as Route,
  }));
  const whatsappHref = whatsappUrl(site.contact.whatsapp, site.whatsappMessage);

  return (
    <>
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
    </>
  );
}
