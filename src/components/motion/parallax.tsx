"use client";

import { useRef, type ReactNode } from "react";

import { gsap, MOTION_OK, useGSAP } from "@/lib/gsap";
import { cn } from "@/lib/utils";

type ParallaxProps = {
  children: ReactNode;
  className?: string;
  /** Quanto o conteúdo desce enquanto a seção sai da tela (0,2 = 20% da altura). */
  speed?: number;
};

/**
 * Camada que rola mais devagar que a página (profundidade). O conteúdo é maior
 * que a seção (top -10%, altura 120%) para as bordas nunca aparecerem.
 */
export function Parallax({ children, className, speed = 0.2 }: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const layer = ref.current;
      const section = layer?.parentElement;
      if (!layer || !section) return;

      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.to(layer, {
          yPercent: speed * 100,
          ease: "none",
          scrollTrigger: { trigger: section, start: "top top", end: "bottom top", scrub: true },
        });
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className={cn("absolute inset-x-0 -top-[10%] h-[120%]", className)}>
      {children}
    </div>
  );
}
