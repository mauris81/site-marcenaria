"use client";

import type { gsap } from "gsap";
import type { RefObject } from "react";

import { useLazyGSAP } from "@/components/motion/use-lazy-gsap";
import { MOTION_OK } from "@/lib/motion";

/**
 * Mecânica comum das cenas guiadas pela rolagem: enquanto a seção (alta) passa,
 * o palco fica preso na tela (CSS sticky) e a rolagem dirige uma timeline.
 *
 * A timeline tem duração total 1, então as posições funcionam como "fases" de 0 a 1.
 * Cada cena só descreve as próprias fases em `build`; progresso, dica de rolagem e
 * movimento reduzido são tratados aqui, iguais para todas. A cena só é montada
 * quando chega perto da tela (useLazyGSAP).
 */
export function useScrollScene(
  root: RefObject<HTMLElement | null>,
  build: (timeline: gsap.core.Timeline) => void,
) {
  useLazyGSAP(root, (element, { gsap, ScrollTrigger }) => {
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

      // A seta da dica só pula enquanto a cena se aproxima; fora disso, nenhuma
      // animação infinita gastando processamento (nem com a cena fora da tela).
      const hint = element.querySelector<HTMLElement>("[data-scene-hint]");
      if (!hint) return;
      ScrollTrigger.create({
        trigger: element,
        start: "top bottom",
        end: "top top",
        onToggle: ({ isActive }) => hint.toggleAttribute("data-active", isActive),
      });
      return () => hint.removeAttribute("data-active");
    });
    return () => mm.revert();
  });
}
