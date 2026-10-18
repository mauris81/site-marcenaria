import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { WhatsAppIcon } from "@/components/icons/brand";
import { PageTransition } from "@/components/motion/page-transition";
import { CtaBanner } from "@/components/sections/cta-banner";
import { Differentials } from "@/components/sections/differentials";
import { PageHero } from "@/components/sections/page-hero";
import { ProcessSteps } from "@/components/sections/process-steps";
import { ScrollMarquee } from "@/components/sections/scroll-marquee";
import { SectionHeading } from "@/components/sections/section-heading";
import { buttonVariants } from "@/components/ui/button";
import { getHomeContent, getSite } from "@/lib/content";
import { whatsappUrl } from "@/lib/whatsapp";

export async function generateMetadata(): Promise<Metadata> {
  const { seo } = await getHomeContent();
  return { title: seo.title, description: seo.description };
}

export default async function HomePage() {
  const [home, site] = await Promise.all([getHomeContent(), getSite()]);
  const whatsappHref = whatsappUrl(site.contact.whatsapp, site.whatsappMessage);

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

      <section aria-labelledby="processo" className="theme-light border-t border-line">
        <div className="container-site py-24 md:py-32">
          <SectionHeading id="processo" eyebrow={home.process.eyebrow} title={home.process.title} />
          <div className="mt-16">
            <ProcessSteps steps={home.process.steps} />
          </div>
        </div>
      </section>

      <section aria-labelledby="regioes" className="py-24 md:py-32">
        <div className="container-site">
          <SectionHeading
            id="regioes"
            eyebrow={home.regions.eyebrow}
            title={home.regions.title}
            text={home.regions.text}
          />
        </div>
        <div className="mt-14">
          <ScrollMarquee items={site.area.neighborhoods} />
        </div>
      </section>

      <CtaBanner {...home.cta} whatsappHref={whatsappHref} />
    </PageTransition>
  );
}
