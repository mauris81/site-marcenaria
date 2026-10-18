"use client";

import type { RefObject } from "react";

import { gsap, MOTION_OK, useGSAP } from "@/lib/gsap";

/**
 * Mecânica comum das cenas guiadas pela rolagem: enquanto a seção (alta) passa,
 * o palco fica preso na tela (CSS sticky) e a rolagem dirige uma timeline.
 *
 * A timeline tem duração total 1, então as posições funcionam como "fases" de 0 a 1.
 * Cada cena só descreve as próprias fases em `build`; progresso, dica de rolagem e
 * movimento reduzido são tratados aqui, iguais para todas.
 */
export function useScrollScene(
  root: RefObject<HTMLElement | null>,
  build: (timeline: gsap.core.Timeline) => void,
) {
  useGSAP(
    () => {
      const element = root.current;
      if (!element) return;

      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const timeline = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: element,
            start: "top top",
            end: "bottom bottom",
            scrub: 1,
            // Valores calculados por função (ex.: profundidade da gaveta) são refeitos ao redimensionar.
            invalidateOnRefresh: true,
          },
        });
        timeline.fromTo("[data-scene-progress]", { scaleX: 0 }, { scaleX: 1, duration: 1 }, 0);
        timeline.to("[data-scene-hint]", { autoAlpha: 0, duration: 0.08 }, 0.1);
        build(timeline);
      });
      return () => mm.revert();
    },
    { scope: root },
  );
}
