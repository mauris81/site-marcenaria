"use client";

import { useRef, type ReactNode } from "react";

import { gsap, MOTION_OK, SplitText, useGSAP } from "@/lib/gsap";

type SplitHeadingProps = {
  children: ReactNode;
  className?: string;
  id?: string;
  as?: "h2" | "h3";
};

/**
 * Título que sobe linha a linha, cada linha surgindo de trás de uma máscara.
 * O SplitText mantém o texto completo acessível (aria-label) e refaz a divisão
 * em linhas quando a largura da tela ou a fonte mudam.
 */
export function SplitHeading({ children, className, id, as: Tag = "h2" }: SplitHeadingProps) {
  const ref = useRef<HTMLHeadingElement>(null);

  useGSAP(
    () => {
      const heading = ref.current;
      if (!heading) return;

      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        SplitText.create(heading, {
          type: "lines",
          mask: "lines",
          autoSplit: true,
          onSplit: (split) =>
            gsap.from(split.lines, {
              yPercent: 110,
              duration: 1.3,
              stagger: 0.1,
              scrollTrigger: { trigger: heading, start: "top 88%", once: true },
            }),
        });
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <Tag ref={ref} id={id} className={className}>
      {children}
    </Tag>
  );
}
