import { ArrowRight } from "lucide-react";
import type { Metadata, Route } from "next";
import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";

import monogram from "@/assets/brand/monogram.webp";
import { InstagramIcon, WhatsAppIcon } from "@/components/icons/brand";
import { LinkCard, LinkIconGlyph } from "@/components/links/link-card";
import { ShareButton } from "@/components/links/share-button";
import { Emphasis } from "@/components/ui/emphasis";
import { Photo } from "@/components/ui/photo";
import { getLinksContent, getServices, getSite } from "@/lib/content";
import { resolveLink } from "@/lib/links";
import { absoluteUrl, pageMetadata } from "@/lib/seo";
import { whatsappUrl } from "@/lib/whatsapp";

// Página de links (o "link na bio" do Instagram): uma coluna estreita, pensada
// para o celular, sem o cabeçalho e o rodapé do site. Todo o texto vem de
// src/content/links.json; contatos, de site.json; ambientes, de services.json.

export async function generateMetadata(): Promise<Metadata> {
  const [{ seo }, site] = await Promise.all([getLinksContent(), getSite()]);
  return {
    ...pageMetadata({ site, seo, path: "/links" }),
    // Página de atalhos: fica fora da busca para não competir com as do site.
    robots: { index: false, follow: true },
  };
}

/** Entrada em cascata: cada bloco sobe um pouco depois do anterior. */
const rise = (step: number): CSSProperties => ({ animationDelay: `${120 + step * 70}ms` });
const riseClass = "motion-safe:animate-hero-rise";

export default async function LinksPage() {
  const [content, site, services] = await Promise.all([
    getLinksContent(),
    getSite(),
    getServices(),
  ]);
  const { hero, featured } = content;
  const links = content.links.map((link) => resolveLink(link, site));
  const featuredHref = whatsappUrl(site.contact.whatsapp, featured.message);

  const socials = [
    { label: "WhatsApp", href: featuredHref, icon: <WhatsAppIcon className="size-5" /> },
    {
      label: "Instagram",
      href: site.contact.instagram.url,
      icon: <InstagramIcon className="size-5" />,
    },
    ...(site.contact.googleMaps
      ? [
          {
            label: "Google",
            href: site.contact.googleMaps,
            icon: <LinkIconGlyph icon="maps" className="size-5" />,
          },
        ]
      : []),
  ];

  let step = 0;

  return (
    <main id="conteudo" className="relative isolate min-h-dvh overflow-hidden pb-16">
      {/* Capa: foto de um projeto que se dissolve no fundo da página. */}
      <div className="relative -z-10 h-64 [mask-image:linear-gradient(to_bottom,black_45%,transparent)] sm:mx-auto sm:h-80 sm:max-w-5xl sm:[mask-image:radial-gradient(ellipse_50%_100%_at_50%_0%,black_55%,transparent_100%)]">
        <Photo
          id={hero.photo}
          alt=""
          position={hero.photoPosition}
          fill
          sizes="100vw"
          loading="eager"
          fetchPriority="high"
          className="object-cover motion-safe:animate-hero-zoom"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-linear-to-b from-espresso-900/25 to-espresso-900/70"
        />
        <div aria-hidden="true" className="absolute inset-0 bg-slats opacity-60" />
      </div>

      <div className="mx-auto -mt-20 w-full max-w-[30rem] px-4 sm:-mt-24">
        <header className="flex flex-col items-center text-center">
          <Image
            src={monogram}
            alt=""
            width={104}
            height={104}
            unoptimized
            priority
            className="size-26 rounded-[1.5rem] shadow-lift ring-4 ring-canvas motion-safe:animate-hero-rise"
          />
          <p
            className={`mt-6 text-eyebrow font-semibold text-brand uppercase ${riseClass}`}
            style={rise(step++)}
          >
            {hero.eyebrow}
          </p>
          <h1
            className={`mt-3 font-display text-[2.25rem] leading-tight tracking-tight sm:text-[2.75rem] ${riseClass}`}
            style={rise(step++)}
          >
            {site.name}
          </h1>
          <p className={`mt-3 font-display text-title ${riseClass}`} style={rise(step++)}>
            <Emphasis text={hero.title} />
          </p>
          <p className={`mt-3 max-w-sm text-ink-muted ${riseClass}`} style={rise(step++)}>
            {hero.text}
          </p>

          <ul
            aria-label="Redes e contato"
            className={`mt-6 flex gap-3 ${riseClass}`}
            style={rise(step++)}
          >
            {socials.map((social) => (
              <li key={social.label}>
                <a
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="grid size-11 place-items-center rounded-full border border-line text-ink-muted transition duration-300 hover:border-brand/60 hover:text-brand"
                >
                  {social.icon}
                  <span className="sr-only">{social.label} (abre em nova aba)</span>
                </a>
              </li>
            ))}
          </ul>
        </header>

        <nav aria-label="Links da Marcenaria Butantã" className="mt-9">
          <ul className="flex flex-col gap-3">
            {/* Destaque: o caminho mais curto para um orçamento. */}
            <li className={riseClass} style={rise(step++)}>
              <a
                href={featuredHref}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex min-h-20 items-center gap-4 rounded-2xl bg-whatsapp-bright p-3 pr-5 text-espresso-900 shadow-soft transition duration-500 ease-out-expo hover:-translate-y-0.5 hover:bg-whatsapp-bright-hover hover:shadow-lift"
              >
                <span className="grid size-13 shrink-0 place-items-center rounded-xl bg-espresso-900/10">
                  <WhatsAppIcon className="size-7" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-lg leading-tight font-bold">{featured.label}</span>
                  <span className="mt-1 block text-sm font-medium text-espresso-900/75">
                    {featured.text}
                  </span>
                </span>
                <ArrowRight
                  aria-hidden="true"
                  className="size-5 shrink-0 transition-transform duration-500 ease-out-expo group-hover:translate-x-1"
                />
                <span className="sr-only"> (abre em nova aba)</span>
              </a>
            </li>

            {links.map((link) => (
              <li key={`${link.label}-${link.href}`} className={riseClass} style={rise(step++)}>
                <LinkCard link={link} />
              </li>
            ))}
          </ul>
        </nav>

        <section aria-labelledby="ambientes" className="mt-12">
          <h2
            id="ambientes"
            className="flex items-center gap-4 text-eyebrow font-semibold text-brand uppercase"
          >
            <span aria-hidden="true" className="h-px flex-1 bg-line" />
            {content.services.title}
            <span aria-hidden="true" className="h-px flex-1 bg-line" />
          </h2>
          <ul className="mt-6 grid grid-cols-2 gap-3">
            {services.map((service) => (
              <li key={service.slug}>
                <Link
                  href={`/${service.slug}` as Route}
                  className="group relative isolate flex aspect-[4/5] items-end overflow-hidden rounded-2xl ring-1 ring-line transition duration-500 ease-out-expo hover:-translate-y-0.5 hover:shadow-lift hover:ring-brand/50"
                >
                  <Photo
                    id={service.card.photo}
                    alt=""
                    fill
                    sizes="(min-width: 30rem) 15rem, 50vw"
                    className="-z-10 object-cover transition duration-700 ease-out-expo group-hover:scale-105"
                  />
                  <span
                    aria-hidden="true"
                    className="absolute inset-0 -z-10 bg-linear-to-t from-espresso-950/90 via-espresso-950/25 to-transparent"
                  />
                  <span className="flex w-full items-center justify-between gap-2 p-4 text-sm font-semibold text-linen-100">
                    {service.navLabel}
                    <ArrowRight
                      aria-hidden="true"
                      className="size-4 text-oak-300 transition-transform duration-500 ease-out-expo group-hover:translate-x-0.5"
                    />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <footer className="mt-12 flex flex-col items-center gap-5 text-center">
          <ShareButton
            url={absoluteUrl(site, "/links")}
            title={site.name}
            text={`${site.name}: móveis planejados sob medida`}
          />
          <p className="max-w-xs text-sm text-ink-muted">
            Atendemos {site.area.neighborhoods.join(", ")} e outros bairros de {site.area.city}.
          </p>
          <p className="text-xs text-ink-muted/80">
            © {new Date().getFullYear()} {site.name}
          </p>
        </footer>
      </div>
    </main>
  );
}
