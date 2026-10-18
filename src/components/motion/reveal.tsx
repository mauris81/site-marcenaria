"use client";

import { useRef, type ReactNode } from "react";

import { gsap, MOTION_OK, useGSAP } from "@/lib/gsap";

type RevealProps = {
  children: ReactNode;
  className?: string;
  /** Anima os filhos diretos em sequência (ex.: itens de uma grade) em vez do bloco inteiro. */
  stagger?: boolean;
};

/**
 * Conteúdo sobe e aparece uma única vez quando chega à tela. Use abaixo da dobra:
 * acima dela o conteúdo já é visível no primeiro quadro. Sem JS ou com
 * "reduzir movimento", o conteúdo simplesmente aparece, sem animação.
 *
 * O GSAP anima opacity e transform do elemento (ou dos filhos diretos, com
 * `stagger`): eles não podem ter `transition` CSS nessas propriedades, ou o
 * GSAP lê valores no meio da transição e o conteúdo fica invisível. Para um
 * card com efeito de hover, envolva-o num <div>.
 */
export function Reveal({ children, className, stagger = false }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const element = ref.current;
      if (!element) return;

      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        // `opacity`, e não `autoAlpha` (visibility: hidden): antes de revelado, o
        // conteúdo continua no leitor de tela e na ordem do Tab.
        const tween = gsap.from(stagger ? element.children : element, {
          opacity: 0,
          y: 40,
          stagger: stagger ? 0.12 : 0,
          scrollTrigger: { trigger: element, start: "top 85%", once: true },
        });
        // Se o foco do teclado chegar antes da rolagem, revela na hora.
        const reveal = () => tween.progress(1);
        element.addEventListener("focusin", reveal);
        return () => element.removeEventListener("focusin", reveal);
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
