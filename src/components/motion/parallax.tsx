"use client";

import { useRef, type ReactNode } from "react";

import { MOTION_OK } from "@/lib/motion";
import { cn } from "@/lib/utils";

import { useLazyGSAP } from "./use-lazy-gsap";

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

  useLazyGSAP(ref, (layer, { gsap }) => {
    const section = layer.parentElement;
    if (!section) return;

    const mm = gsap.matchMedia();
    mm.add(MOTION_OK, () => {
      gsap.to(layer, {
        yPercent: speed * 100,
        ease: "none",
        scrollTrigger: { trigger: section, start: "top top", end: "bottom top", scrub: true },
      });
    });
    return () => mm.revert();
  });

  return (
    <div ref={ref} className={cn("absolute inset-x-0 -top-[10%] h-[120%]", className)}>
      {children}
    </div>
  );
}
