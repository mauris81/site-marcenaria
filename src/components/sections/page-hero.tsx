import type { ReactNode } from "react";

import { Parallax } from "@/components/motion/parallax";
import { Emphasis } from "@/components/ui/emphasis";
import { Photo } from "@/components/ui/photo";
import { cn } from "@/lib/utils";

type PageHeroProps = {
  eyebrow?: string;
  /** Aceita *ênfase* entre asteriscos. */
  title: string;
  text?: string;
  /** Foto de fundo (id do catálogo). Sem foto, usa o fundo escuro texturizado da marca. */
  photo?: string;
  photoPosition?: string;
  /** Ações (botões/links) exibidas abaixo do texto. */
  children?: ReactNode;
};

/** Abertura padrão das páginas: o único <h1> de cada rota. */
export function PageHero({ eyebrow, title, text, photo, photoPosition, children }: PageHeroProps) {
  return (
    <section className="relative isolate overflow-hidden">
      {photo ? (
        <>
          <Parallax className="-z-20">
            {/* Maior elemento da tela (LCP): carregado com prioridade, sem lazy loading. */}
            <Photo
              id={photo}
              alt=""
              position={photoPosition}
              fill
              sizes="100vw"
              loading="eager"
              fetchPriority="high"
              className="object-cover motion-safe:animate-hero-zoom"
            />
          </Parallax>
          {/* Véus em gradiente: garantem o contraste do texto (base e coluna esquerda)
              e do menu (topo) sobre qualquer foto — medido no pior pixel atrás do texto. */}
          <div
            aria-hidden="true"
            className="absolute inset-0 -z-10 bg-linear-to-t from-canvas via-canvas/90 to-canvas/40"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 -z-10 hidden bg-linear-to-r from-canvas/80 via-canvas/35 to-transparent md:block"
          />
          <div
            aria-hidden="true"
            className="absolute inset-x-0 top-0 -z-10 h-40 bg-linear-to-b from-canvas/85 to-transparent"
          />
        </>
      ) : (
        <>
          <div
            aria-hidden="true"
            className="absolute inset-0 -z-10 origin-top bg-slats motion-safe:animate-slats-draw"
          />
          <div
            aria-hidden="true"
            className="absolute -top-48 right-[-15%] -z-10 size-[44rem] rounded-full bg-[radial-gradient(closest-side,rgb(227_176_126/0.14),transparent)] motion-safe:animate-glow-in"
          />
        </>
      )}

      <div className="container-site flex min-h-[85svh] flex-col justify-end pt-36 pb-16 md:pb-24">
        {eyebrow && (
          // Sobre foto, o texto fica creme (contraste garantido) e o dourado vai para o traço.
          <p
            className={cn(
              "flex items-center gap-3 text-eyebrow font-semibold uppercase motion-safe:animate-hero-rise",
              photo ? "text-ink" : "text-brand",
            )}
          >
            {photo && <span aria-hidden="true" className="h-px w-8 shrink-0 bg-brand" />}
            {eyebrow}
          </p>
        )}
        <h1 className="mt-6 max-w-5xl font-display text-display-xl font-light motion-safe:animate-hero-focus">
          <Emphasis text={title} />
        </h1>
        {text && (
          <p className="mt-8 max-w-2xl text-lead text-ink-muted motion-safe:animate-hero-rise motion-safe:[animation-delay:200ms]">
            {text}
          </p>
        )}
        {children && (
          <div className="mt-10 flex flex-wrap gap-4 motion-safe:animate-hero-rise motion-safe:[animation-delay:350ms]">
            {children}
          </div>
        )}
      </div>
    </section>
  );
}
