import type { Metadata } from "next";
import Link from "next/link";

import { SiteChrome } from "@/components/layout/site-chrome";
import { PageTransition } from "@/components/motion/page-transition";
import { PageHero } from "@/components/sections/page-hero";
import { buttonVariants } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Página não encontrada",
  // Sobrescreve o "index, follow" do layout: a página de erro fica fora da busca.
  robots: { index: false, follow: true },
};

export default function NotFound() {
  // Renderiza no layout raiz (fora do grupo "(site)"), então traz a moldura do site.
  return (
    <SiteChrome>
      <PageTransition>
        <PageHero
          eyebrow="Erro 404"
          title="Página *não encontrada*"
          text="O endereço pode ter mudado ou não existir mais. Veja nossos ambientes a partir do início ou fale direto com a gente."
        >
          <Link href="/" className={buttonVariants({ size: "lg" })}>
            Voltar ao início
          </Link>
          <Link href="/orcamento" className={buttonVariants({ variant: "secondary", size: "lg" })}>
            Solicitar orçamento
          </Link>
        </PageHero>
      </PageTransition>
    </SiteChrome>
  );
}
