"use client";

import "lenis/dist/lenis.css";

import { useEffect } from "react";

import { loadGsap } from "./use-lazy-gsap";

/**
 * Rolagem suave (Lenis) para mouse e touchpad: a página desliza em vez de andar
 * aos trancos, e as cenas guiadas pela rolagem ganham fluidez. No toque continua
 * a rolagem nativa do aparelho, e quem pede "reduzir movimento" no sistema rola
 * sem suavização (respectReducedMotion, padrão do Lenis).
 *
 * O Lenis roda no mesmo relógio do GSAP, então ScrollTrigger e rolagem nunca
 * ficam fora de compasso. Os dois são baixados sob demanda, só em computador.
 */
export function SmoothScroll() {
  useEffect(() => {
    // No toque o Lenis não suaviza nada (a rolagem nativa já é suave), mas
    // rodaria a cada quadro: em celular e tablet ele nem é baixado.
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    let cancelled = false;
    let stop: (() => void) | undefined;
    Promise.all([import("lenis"), loadGsap()]).then(
      ([{ default: Lenis }, { gsap, ScrollTrigger }]) => {
        if (cancelled) return;
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
        stop = () => {
          gsap.ticker.remove(tick);
          lenis.destroy();
        };
      },
    );

    return () => {
      cancelled = true;
      stop?.();
    };
  }, []);

  return null;
}
