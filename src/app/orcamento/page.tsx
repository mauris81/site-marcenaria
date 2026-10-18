import { ArrowDown } from "lucide-react";
import type { Metadata } from "next";

import { WhatsAppIcon } from "@/components/icons/brand";
import { PageTransition } from "@/components/motion/page-transition";
import { Reveal } from "@/components/motion/reveal";
import { QuoteForm } from "@/components/quote/quote-form";
import { PageHero } from "@/components/sections/page-hero";
import { RegionsSection } from "@/components/sections/regions-section";
import { buttonVariants } from "@/components/ui/button";
import { getQuoteContent, getSite } from "@/lib/content";
import { whatsappUrl } from "@/lib/whatsapp";

export async function generateMetadata(): Promise<Metadata> {
  const { seo } = await getQuoteContent();
  return { title: seo.title, description: seo.description };
}

export default async function QuotePage() {
  const [quote, site] = await Promise.all([getQuoteContent(), getSite()]);
  const whatsappHref = whatsappUrl(site.contact.whatsapp, site.whatsappMessage);

  return (
    <PageTransition>
      <PageHero {...quote.hero}>
        <a href="#formulario" className={buttonVariants({ size: "lg" })}>
          Preencher o formulário
          <ArrowDown aria-hidden="true" className="size-4" />
        </a>
        <a
          href={whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          className={buttonVariants({ variant: "secondary", size: "lg" })}
        >
          <WhatsAppIcon className="size-5" />
          {quote.channels.whatsapp.cta}
        </a>
      </PageHero>

      {/* Dois caminhos: formulário com calma ou conversa direta. */}
      <section aria-labelledby="canais" className="py-20 md:py-28">
        <div className="container-site">
          <h2 id="canais" className="font-display text-heading">
            {quote.channels.title}
          </h2>
          <Reveal stagger className="mt-10 grid gap-6 md:grid-cols-2">
            <a
              href="#formulario"
              className="group rounded-2xl border border-line bg-surface p-8 transition duration-500 ease-out-expo hover:-translate-y-1 hover:border-brand/50 hover:shadow-lift"
            >
              <h3 className="font-display text-title">{quote.channels.form.title}</h3>
              <p className="mt-3 text-ink-muted">{quote.channels.form.text}</p>
              <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-brand">
                Ir para o formulário
                <ArrowDown
                  aria-hidden="true"
                  className="size-4 transition-transform duration-500 ease-out-expo group-hover:translate-y-0.5"
                />
              </span>
            </a>
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="group rounded-2xl border border-line bg-surface p-8 transition duration-500 ease-out-expo hover:-translate-y-1 hover:border-whatsapp-bright/60 hover:shadow-lift"
            >
              <h3 className="font-display text-title">{quote.channels.whatsapp.title}</h3>
              <p className="mt-3 text-ink-muted">{quote.channels.whatsapp.text}</p>
              <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-brand">
                <WhatsAppIcon className="size-4" />
                {quote.channels.whatsapp.cta}
              </span>
            </a>
          </Reveal>
        </div>
      </section>

      <section id="formulario" aria-label="Formulário de orçamento" className="pb-24 md:pb-32">
        <div className="container-site grid items-start gap-12 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] lg:gap-16">
          <QuoteForm
            title={quote.form.title}
            neighborhoods={site.area.neighborhoods}
            projectTypes={quote.form.projectTypes}
            whatsapp={site.contact.whatsapp}
            privacy={quote.form.privacy}
          />

          {/* Como funciona: fixo ao lado do formulário no desktop. */}
          <aside aria-labelledby="como-funciona" className="lg:sticky lg:top-28">
            <h2 id="como-funciona" className="font-display text-title">
              {quote.steps.title}
            </h2>
            <ol className="mt-8 space-y-8 border-l border-line-strong pl-8">
              {quote.steps.items.map((step, index) => (
                <li key={step.title} className="relative">
                  <span className="absolute top-0 -left-[3.05rem] grid size-9 place-items-center rounded-full border border-brand bg-canvas font-display text-sm text-brand tabular-nums">
                    {index + 1}
                  </span>
                  <h3 className="font-semibold">{step.title}</h3>
                  <p className="mt-2 text-sm text-ink-muted">{step.text}</p>
                </li>
              ))}
            </ol>
          </aside>
        </div>
      </section>

      <RegionsSection
        {...quote.regions}
        eyebrow="Onde atendemos"
        neighborhoods={site.area.neighborhoods}
      />
    </PageTransition>
  );
}
