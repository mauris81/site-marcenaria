import type { Metadata } from "next";

import { WhatsAppIcon } from "@/components/icons/brand";
import { PageHero } from "@/components/sections/page-hero";
import { buttonVariants } from "@/components/ui/button";
import { getQuoteContent, getSite } from "@/lib/content";
import { whatsappUrl } from "@/lib/whatsapp";

export async function generateMetadata(): Promise<Metadata> {
  const { seo } = await getQuoteContent();
  return { title: seo.title, description: seo.description };
}

export default async function QuotePage() {
  const [quote, site] = await Promise.all([getQuoteContent(), getSite()]);

  return (
    <PageHero {...quote.hero}>
      <a
        href={whatsappUrl(site.contact.whatsapp, site.whatsappMessage)}
        target="_blank"
        rel="noopener noreferrer"
        className={buttonVariants({ variant: "whatsapp", size: "lg" })}
      >
        <WhatsAppIcon className="size-5" />
        {quote.channels.whatsapp.cta}
      </a>
    </PageHero>
  );
}
