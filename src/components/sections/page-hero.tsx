import type { ReactNode } from "react";

import { Emphasis } from "@/components/ui/emphasis";

type PageHeroProps = {
  eyebrow?: string;
  /** Aceita *ênfase* entre asteriscos. */
  title: string;
  text?: string;
  /** Ações (botões/links) exibidas abaixo do texto. */
  children?: ReactNode;
};

/** Abertura padrão das páginas: o único <h1> de cada rota. */
export function PageHero({ eyebrow, title, text, children }: PageHeroProps) {
  return (
    <section className="relative isolate overflow-hidden">
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-slats" />
      <div className="container-site flex min-h-[80svh] flex-col justify-end pt-36 pb-16 md:pb-24">
        {eyebrow && <p className="text-eyebrow font-semibold text-brand uppercase">{eyebrow}</p>}
        <h1 className="mt-6 max-w-5xl font-display text-display-xl font-light">
          <Emphasis text={title} />
        </h1>
        {text && <p className="mt-8 max-w-2xl text-lead text-ink-muted">{text}</p>}
        {children && <div className="mt-10 flex flex-wrap gap-4">{children}</div>}
      </div>
    </section>
  );
}
