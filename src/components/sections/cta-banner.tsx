import { ArrowRight } from "lucide-react";
import type { Route } from "next";
import Link from "next/link";

import { WhatsAppIcon } from "@/components/icons/brand";
import { Reveal } from "@/components/motion/reveal";
import { UnfoldSection } from "@/components/motion/unfold-section";
import { buttonVariants } from "@/components/ui/button";

import { SectionHeading } from "./section-heading";

type CtaBannerProps = {
  eyebrow?: string;
  title: string;
  text: string;
  whatsappHref: string;
  /** Pré-seleciona o tipo de projeto no formulário de orçamento. */
  quoteType?: string;
};

/** Chamada final para orçamento, reaproveitada em todas as páginas de conteúdo. */
export function CtaBanner({ eyebrow, title, text, whatsappHref, quoteType }: CtaBannerProps) {
  const quoteHref = (
    quoteType ? `/orcamento?tipo=${encodeURIComponent(quoteType)}#formulario` : "/orcamento"
  ) as Route;

  return (
    <UnfoldSection aria-labelledby="chamada-final" className="theme-light">
      <div className="container-site py-24 md:py-36">
        <SectionHeading
          id="chamada-final"
          eyebrow={eyebrow}
          title={title}
          text={text}
          align="center"
        />
        <Reveal className="mt-12 flex flex-wrap justify-center gap-4">
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
        </Reveal>
      </div>
    </UnfoldSection>
  );
}
