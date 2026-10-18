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
 */
export function Reveal({ children, className, stagger = false }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const element = ref.current;
      if (!element) return;

      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.from(stagger ? element.children : element, {
          autoAlpha: 0,
          y: 40,
          stagger: stagger ? 0.12 : 0,
          scrollTrigger: { trigger: element, start: "top 85%", once: true },
        });
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
