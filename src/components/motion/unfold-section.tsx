"use client";

import { useRef, type ComponentProps } from "react";

import { MOTION_OK } from "@/lib/motion";

import { useLazyGSAP } from "./use-lazy-gsap";

/**
 * Seção que entra como um cartão de cantos arredondados e se desdobra até a
 * largura total conforme a rolagem — usada nas seções claras, para a transição
 * entre os temas claro e escuro ganhar movimento. Só transform e border-radius.
 */
export function UnfoldSection({ children, ...props }: ComponentProps<"section">) {
  const ref = useRef<HTMLElement>(null);

  useLazyGSAP(ref, (section, { gsap }) => {
    const mm = gsap.matchMedia();
    mm.add({ desktop: "(min-width: 768px)", motion: MOTION_OK }, (context) => {
      const { desktop, motion } = context.conditions as { desktop: boolean; motion: boolean };
      if (!motion) return;
      gsap.fromTo(
        section,
        { scale: desktop ? 0.92 : 0.96, borderRadius: desktop ? 40 : 24 },
        {
          scale: 1,
          borderRadius: 0,
          ease: "none",
          scrollTrigger: { trigger: section, start: "top bottom", end: "top 30%", scrub: 0.6 },
        },
      );
    });
    return () => mm.revert();
  });

  return (
    <section ref={ref} {...props}>
      {children}
    </section>
  );
}
