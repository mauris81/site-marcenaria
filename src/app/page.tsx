import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { WhatsAppIcon } from "@/components/icons/brand";
import { PageTransition } from "@/components/motion/page-transition";
import { CtaBanner } from "@/components/sections/cta-banner";
import { Differentials } from "@/components/sections/differentials";
import { PageHero } from "@/components/sections/page-hero";
import { ProcessSteps } from "@/components/sections/process-steps";
import { RegionsSection } from "@/components/sections/regions-section";
import { SectionHeading } from "@/components/sections/section-heading";
import { ServiceShowcase } from "@/components/showcase/service-showcase";
import { buttonVariants } from "@/components/ui/button";
import { getHomeContent, getServices, getSite, type Service } from "@/lib/content";
import { whatsappUrl } from "@/lib/whatsapp";

type ShowcasedService = Service & { showcase: NonNullable<Service["showcase"]> };
const hasShowcase = (service: Service): service is ShowcasedService =>
  service.showcase !== undefined;

export async function generateMetadata(): Promise<Metadata> {
  const { seo } = await getHomeContent();
  return { title: seo.title, description: seo.description };
}

export default async function HomePage() {
  const [home, site, services] = await Promise.all([getHomeContent(), getSite(), getServices()]);
  const whatsappHref = whatsappUrl(site.contact.whatsapp, site.whatsappMessage);
  const showcased = services.filter(hasShowcase);

  return (
    <PageTransition>
      <PageHero {...home.hero}>
        <Link href="/orcamento" className={buttonVariants({ size: "lg" })}>
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

      <Differentials {...home.differentials} />

      {/* Cenas interativas: cada serviço com `showcase` vira um móvel que se abre na rolagem. */}
      <section aria-labelledby="ambientes">
        <div className="container-site pt-24 md:pt-32">
          <SectionHeading
            id="ambientes"
            eyebrow={home.services.eyebrow}
            title={home.services.title}
            text={home.services.text}
          />
        </div>
        {showcased.map((service, index) => (
          <ServiceShowcase key={service.slug} service={service} index={index + 1} />
        ))}
      </section>

      <section aria-labelledby="processo" className="theme-light border-t border-line">
        <div className="container-site py-24 md:py-32">
          <SectionHeading id="processo" eyebrow={home.process.eyebrow} title={home.process.title} />
          <div className="mt-16">
            <ProcessSteps steps={home.process.steps} />
          </div>
        </div>
      </section>

      <RegionsSection {...home.regions} neighborhoods={site.area.neighborhoods} />

      <CtaBanner {...home.cta} whatsappHref={whatsappHref} />
    </PageTransition>
  );
}
