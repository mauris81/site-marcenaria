import { ArrowRight } from "lucide-react";
import type { Metadata, Route } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Gallery } from "@/components/gallery/gallery";
import { WhatsAppIcon } from "@/components/icons/brand";
import { PageTransition } from "@/components/motion/page-transition";
import { UnfoldSection } from "@/components/motion/unfold-section";
import { CtaBanner } from "@/components/sections/cta-banner";
import { Differentials } from "@/components/sections/differentials";
import { PageHero } from "@/components/sections/page-hero";
import { ProcessSteps } from "@/components/sections/process-steps";
import { RegionsSection } from "@/components/sections/regions-section";
import { SectionHeading } from "@/components/sections/section-heading";
import { buttonVariants } from "@/components/ui/button";
import { getGallery, getService, getServices, getSite } from "@/lib/content";
import { whatsappUrl } from "@/lib/whatsapp";

// Um único template gera as páginas de todos os serviços em src/content/services.json.
// Só os slugs cadastrados viram páginas; qualquer outro endereço cai no 404.
export const dynamicParams = false;

export async function generateStaticParams() {
  const services = await getServices();
  return services.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({ params }: PageProps<"/[slug]">): Promise<Metadata> {
  const service = await getService((await params).slug);
  if (!service) return {};
  return { title: service.seo.title, description: service.seo.description };
}

export default async function ServicePage({ params }: PageProps<"/[slug]">) {
  const [service, site] = await Promise.all([getService((await params).slug), getSite()]);
  if (!service) notFound();

  const gallery = await getGallery(service);
  const whatsappHref = whatsappUrl(site.contact.whatsapp, site.whatsappMessage);
  // O formulário chega com o tipo de projeto deste serviço já selecionado.
  const quoteHref = `/orcamento?tipo=${encodeURIComponent(service.quoteType)}#formulario` as Route;

  return (
    <PageTransition>
      <PageHero {...service.hero}>
        <Link href={quoteHref} className={buttonVariants({ size: "lg" })}>
          Solicitar orçamento
          <ArrowRight
            aria-hidden="true"
            className="size-4 transition-transform duration-500 ease-out-expo group-hover:translate-x-1"
          />
        </Link>
        <a
          href={whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          className={buttonVariants({ variant: "secondary", size: "lg" })}
        >
          <WhatsAppIcon className="size-5" />
          Conversar no WhatsApp
        </a>
      </PageHero>

      <Differentials eyebrow={service.name} {...service.highlights} />

      <section aria-labelledby="projetos" className="py-24 md:py-32">
        <div className="container-site">
          <SectionHeading
            id="projetos"
            eyebrow="Portfólio"
            title={service.gallery.title}
            text={`${gallery.length} projetos executados pela Marcenaria Butantã.`}
          />
          <div className="mt-14">
            <Gallery items={gallery} />
          </div>
        </div>
      </section>

      <UnfoldSection aria-labelledby="processo" className="theme-light">
        <div className="container-site py-24 md:py-32">
          <SectionHeading
            id="processo"
            eyebrow="Como trabalhamos"
            title={service.process.title}
            text={service.process.text}
          />
          <div className="mt-16">
            <ProcessSteps steps={service.process.steps} />
          </div>
        </div>
      </UnfoldSection>

      <RegionsSection
        eyebrow="Onde atendemos"
        title={service.regionsTitle}
        neighborhoods={site.area.neighborhoods}
      />

      <CtaBanner {...service.cta} whatsappHref={whatsappHref} quoteType={service.quoteType} />
    </PageTransition>
  );
}
