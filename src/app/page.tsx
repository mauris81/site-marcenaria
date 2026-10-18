import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { WhatsAppIcon } from "@/components/icons/brand";
import { PageHero } from "@/components/sections/page-hero";
import { buttonVariants } from "@/components/ui/button";
import { getHomeContent, getSite } from "@/lib/content";
import { whatsappUrl } from "@/lib/whatsapp";

export async function generateMetadata(): Promise<Metadata> {
  const { seo } = await getHomeContent();
  return { title: seo.title, description: seo.description };
}

export default async function HomePage() {
  const [home, site] = await Promise.all([getHomeContent(), getSite()]);

  return (
    <PageHero {...home.hero}>
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
