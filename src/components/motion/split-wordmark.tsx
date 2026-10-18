"use client";

import { useRef } from "react";

import { gsap, MOTION_OK, SplitText, useGSAP } from "@/lib/gsap";

/**
 * Assinatura gigante (decorativa) cujas letras sobem uma a uma, de trás de uma
 * máscara, quando chega à tela. O nome real da marca já está no rodapé, então
 * esta versão fica fora da árvore de acessibilidade.
 */
export function SplitWordmark({ text }: { text: string }) {
  const ref = useRef<HTMLParagraphElement>(null);

  useGSAP(
    () => {
      const element = ref.current;
      if (!element) return;

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
    },
    { scope: ref },
  );

  return (
    <p
      ref={ref}
      aria-hidden="true"
      className="font-display text-[9.2vw] leading-none font-light tracking-[-0.03em] whitespace-nowrap text-ink/10 select-none lg:text-[12vw]"
    >
      {text}
    </p>
  );
}
