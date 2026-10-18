"use client";

import type { gsap } from "gsap";
import { useEffect, type RefObject } from "react";

import { useLazyGSAP, whenPageInUse } from "@/components/motion/use-lazy-gsap";
import { MOTION_OK } from "@/lib/motion";

/**
 * Mecânica comum das cenas guiadas pela rolagem: enquanto a seção (alta) passa,
 * o palco fica preso na tela (CSS sticky) e a rolagem dirige uma timeline.
 *
 * A timeline tem duração total 1, então as posições funcionam como "fases" de 0 a 1.
 * Cada cena só descreve as próprias fases em `build`; progresso, dica de rolagem,
 * movimento reduzido e texturas são tratados aqui, iguais para todas. A cena só
 * é montada quando chega perto da tela (useLazyGSAP).
 */
export function useScrollScene(
  root: RefObject<HTMLElement | null>,
  build: (timeline: gsap.core.Timeline) => void,
) {
  // As texturas de madeira são imagens: ficam fora do carregamento e só são
  // pedidas quando a página começa a ser usada e a cena está a duas telas de
  // distância, com ou sem animação (o CSS as aplica sob [data-textures]).
  useEffect(() => {
    const element = root.current;
    if (!element) return;
    let cancelled = false;
    let observer: IntersectionObserver | undefined;
    whenPageInUse().then(() => {
      if (cancelled) return;
      observer = new IntersectionObserver(
        ([entry]) => {
          if (!entry?.isIntersecting) return;
          observer?.disconnect();
          element.setAttribute("data-textures", "");
        },
        { rootMargin: "200% 0px" },
      );
      observer.observe(element);
    });
    return () => {
      cancelled = true;
      observer?.disconnect();
    };
  }, [root]);

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
