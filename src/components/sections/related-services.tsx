import { ArrowRight } from "lucide-react";
import type { Route } from "next";
import Link from "next/link";

import { Reveal } from "@/components/motion/reveal";
import { Photo } from "@/components/ui/photo";
import type { Service } from "@/lib/content";

import { SectionHeading } from "./section-heading";

/**
 * Outros ambientes ao fim de cada página de serviço: links internos com texto
 * descritivo (o Google entende a relação entre as páginas) e um caminho
 * natural para quem quer continuar explorando.
 */
export function RelatedServices({ services }: { services: Service[] }) {
  return (
    <section aria-labelledby="outros-ambientes" className="py-24 md:py-32">
      <div className="container-site">
        <SectionHeading id="outros-ambientes" eyebrow="Outros ambientes" title="Conheça *também*" />
        {/* Cada cartão num <div>: o Reveal anima o invólucro e o cartão fica
            livre para a própria transição de hover. */}
        <Reveal stagger className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <div key={service.slug}>
              <Link
                href={`/${service.slug}` as Route}
                className="group block h-full overflow-hidden rounded-2xl border border-line bg-surface transition duration-500 ease-out-expo hover:-translate-y-1 hover:border-brand/50 hover:shadow-lift"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Photo
                    id={service.card.photo}
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 26rem, (min-width: 640px) 45vw, 100vw"
                    className="object-cover transition-transform duration-700 ease-out-expo group-hover:scale-105"
                  />
                </div>
                <div className="p-6 sm:p-8">
                  <h3 className="font-display text-title">{service.name}</h3>
                  <p className="mt-3 text-ink-muted">{service.card.text}</p>
                  <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-brand">
                    {service.card.cta}
                    <ArrowRight
                      aria-hidden="true"
                      className="size-4 transition-transform duration-500 ease-out-expo group-hover:translate-x-1"
                    />
                  </span>
                </div>
              </Link>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
