import Link from "next/link";

import { Logo } from "@/components/brand/logo";
import { SplitWordmark } from "@/components/motion/split-wordmark";
import { InstagramIcon, WhatsAppIcon } from "@/components/icons/brand";
import type { Site } from "@/lib/content";

import type { NavItem } from "./site-header";

type SiteFooterProps = {
  site: Site;
  nav: NavItem[];
  whatsappHref: string;
};

const linkClass =
  "inline-flex min-h-11 items-center gap-3 text-sm text-ink-muted transition-colors duration-300 hover:text-ink";

export function SiteFooter({ site, nav, whatsappHref }: SiteFooterProps) {
  const { area, contact } = site;

  return (
    <footer className="border-t border-line">
      <div className="container-site grid gap-12 py-16 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.3fr]">
        <div>
          <Logo />
          <p className="mt-6 max-w-xs text-sm text-ink-muted">{site.description}</p>
        </div>

        <nav aria-labelledby="rodape-ambientes">
          <h2 id="rodape-ambientes" className="text-eyebrow font-semibold text-brand uppercase">
            Ambientes
          </h2>
          <ul className="mt-4">
            {nav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className={linkClass}>
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/orcamento" className={linkClass}>
                Orçamento
              </Link>
            </li>
          </ul>
        </nav>

        <div>
          <h2 className="text-eyebrow font-semibold text-brand uppercase">Contato</h2>
          <address className="mt-4 flex flex-col items-start not-italic">
            <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className={linkClass}>
              <WhatsAppIcon className="size-4" />
              {contact.phone}
            </a>
            <a
              href={contact.instagram.url}
              target="_blank"
              rel="noopener noreferrer"
              className={linkClass}
            >
              <InstagramIcon className="size-4" />
              {contact.instagram.handle}
            </a>
          </address>
        </div>

        <div>
          <h2 className="text-eyebrow font-semibold text-brand uppercase">Atendimento</h2>
          <p className="mt-6 text-sm text-ink-muted">
            {area.region} de {area.city}: {area.neighborhoods.join(", ")} e regiões próximas.
          </p>
        </div>
      </div>

      {/* Assinatura gigante, decorativa */}
      <div className="container-site overflow-hidden pb-4">
        <SplitWordmark text={site.name} />
      </div>

      <div className="border-t border-line">
        {/* Respiro extra para o botão flutuante do WhatsApp não cobrir o texto ao fim da rolagem. */}
        <div className="container-site flex flex-col gap-2 pt-6 pb-24 text-xs text-ink-muted sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {site.name}. {site.credits}
          </p>
          <a href="#conteudo" className="inline-flex min-h-11 items-center hover:text-ink">
            Voltar ao topo ↑
          </a>
        </div>
      </div>
    </footer>
  );
}
