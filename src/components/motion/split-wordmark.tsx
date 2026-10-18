"use client";

import { useRef } from "react";

import { MOTION_OK } from "@/lib/motion";

import { useLazyGSAP } from "./use-lazy-gsap";

/**
 * Assinatura gigante (decorativa) cujas letras sobem uma a uma, de trás de uma
 * máscara, quando chega à tela. O nome real da marca já está no rodapé, então
 * esta versão fica fora da árvore de acessibilidade.
 */
export function SplitWordmark({ text }: { text: string }) {
  const ref = useRef<HTMLParagraphElement>(null);

  useLazyGSAP(ref, (element, { gsap, SplitText, visibleAtStart }) => {
    if (visibleAtStart) return;

    const mm = gsap.matchMedia();
    mm.add(MOTION_OK, () => {
      SplitText.create(element, {
        type: "chars",
        mask: "chars",
        aria: "none",
        autoSplit: true,
        onSplit: (split) =>
          gsap.from(split.chars, {
            yPercent: 110,
            duration: 1.4,
            stagger: 0.035,
            scrollTrigger: { trigger: element, start: "top 95%", once: true },
          }),
      });
    });
    return () => mm.revert();
  });

  return (
    // No desktop, a fonte acompanha a largura do próprio bloco (unidade cqi), e
    // não a da tela: a assinatura ocupa a coluna sem ser cortada nos monitores
    // largos. "Marcenaria Butantã" mede ~6,6× o tamanho da fonte; dividir por
    // 6,9 deixa uma folga de ~4% (outro nome pede outro divisor).
    <div className="@container">
      <p
        ref={ref}
        aria-hidden="true"
        className="font-display text-[9.2vw] leading-none font-light tracking-[-0.03em] whitespace-nowrap text-ink/10 select-none lg:text-[length:calc(100cqi/6.9)]"
      >
        {text}
      </p>
    </div>
  );
}
