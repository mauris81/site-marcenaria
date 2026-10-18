"use client";

import "lenis/dist/lenis.css";

import Lenis from "lenis";
import { useEffect } from "react";

import { gsap, ScrollTrigger } from "@/lib/gsap";

/**
 * Rolagem suave (Lenis) para mouse e touchpad: a página desliza em vez de andar
 * aos trancos, e as cenas guiadas pela rolagem ganham fluidez. No toque continua
 * a rolagem nativa do aparelho, e quem pede "reduzir movimento" no sistema rola
 * sem suavização (respectReducedMotion, padrão do Lenis).
 *
 * O Lenis roda no mesmo relógio do GSAP, então ScrollTrigger e rolagem nunca
 * ficam fora de compasso.
 */
export function SmoothScroll() {
  useEffect(() => {
    const lenis = new Lenis({
      // Pausa sozinho quando a página trava a rolagem (ex.: menu mobile aberto).
      autoToggle: true,
      // Rolagem dentro de diálogos continua nativa.
      prevent: (node) => node.closest("dialog") !== null,
      // Ao clicar num link interno, a inércia para — a nova página começa parada.
      stopInertiaOnNavigate: true,
    });

    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
    };
  }, []);

  return null;
}
