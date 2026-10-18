import { ArrowDown, ArrowRight } from "lucide-react";
import type { Route } from "next";
import Link from "next/link";
import type { ReactNode } from "react";

import { buttonVariants } from "@/components/ui/button";

export type ShowcaseCopyProps = {
  id: string;
  index: number;
  label: string;
  title: ReactNode;
  text: string;
  href: Route;
  cta: string;
  /** Instrução visual da cena, ex.: "Role para abrir a porta". */
  hint: string;
};

/** Coluna de texto de uma cena: capítulo, título, texto, link e progresso da rolagem. */
export function ShowcaseCopy({
  id,
  index,
  label,
  title,
  text,
  href,
  cta,
  hint,
}: ShowcaseCopyProps) {
  return (
    <div className="max-w-xl">
      <p className="flex items-center gap-3 text-eyebrow font-semibold text-brand uppercase">
        <span className="font-display text-base tracking-normal tabular-nums">
          {String(index).padStart(2, "0")}
        </span>
        <span aria-hidden="true" className="h-px w-8 bg-brand" />
        {label}
      </p>
      <h3 id={id} className="mt-5 font-display text-heading font-light lg:text-display">
        {title}
      </h3>
      <p className="mt-5 text-lead text-ink-muted max-lg:hidden">{text}</p>
      <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-4">
        <Link href={href} className={buttonVariants({ size: "md" })}>
          {cta}
          <ArrowRight
            aria-hidden="true"
            className="size-4 transition-transform duration-500 ease-out-expo group-hover:translate-x-1"
          />
        </Link>
        <p
          data-scene-hint
          aria-hidden="true"
          className="flex items-center gap-2 text-sm text-ink-muted motion-reduce:hidden"
        >
          <ArrowDown className="size-4 motion-safe:animate-bounce" />
          {hint}
        </p>
      </div>
      {/* Progresso da cena: feedback de que a rolagem está "abrindo" o móvel. */}
      <div aria-hidden="true" className="mt-10 h-px w-full bg-line-strong motion-reduce:hidden">
        <div data-scene-progress className="h-full origin-left bg-brand" />
      </div>
    </div>
  );
}
