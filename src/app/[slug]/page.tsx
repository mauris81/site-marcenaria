import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { WhatsAppIcon } from "@/components/icons/brand";
import { PageHero } from "@/components/sections/page-hero";
import { buttonVariants } from "@/components/ui/button";
import { getService, getServices, getSite } from "@/lib/content";
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

  return (
    <PageHero eyebrow={service.hero.eyebrow} title={service.hero.title} text={service.hero.text}>
      <Link href="/orcamento" className={buttonVariants({ size: "lg" })}>
        Solicitar orçamento
        <ArrowRight
          aria-hidden="true"
          className="size-4 transition-transform duration-500 ease-out-expo group-hover:translate-x-1"
        />
      </Link>
      <a
        href={whatsappUrl(site.contact.whatsapp, site.whatsappMessage)}
        target="_blank"
        rel="noopener noreferrer"
        className={buttonVariants({ variant: "secondary", size: "lg" })}
      >
        <WhatsAppIcon className="size-5" />
        Conversar no WhatsApp
      </a>
    </PageHero>
  );
}
