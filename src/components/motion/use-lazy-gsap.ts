"use client";

import type { gsap } from "gsap";
import { useEffect, useEffectEvent, type RefObject } from "react";

import type { GsapModule } from "@/lib/gsap";

type Tools = Pick<GsapModule, "gsap" | "ScrollTrigger" | "SplitText">;
type Setup = (
  element: HTMLElement,
  state: Tools & { visibleAtStart: boolean },
) => void | (() => void);

let gsapModule: Promise<GsapModule> | undefined;

/** Baixa o GSAP (e plugins) uma única vez, sob demanda, fora do JS inicial. */
export function loadGsap() {
  gsapModule ??= import("@/lib/gsap");
  return gsapModule;
}

/**
 * Chama `callback` depois que o navegador mostrou o primeiro conteúdo da página
 * (evento first-contentful-paint). Em navegações dentro do site o evento já
 * existe e a chamada é imediata. Devolve uma função que cancela a espera.
 */
function afterFirstContentfulPaint(callback: () => void) {
  let observer: PerformanceObserver | undefined;
  let timer: ReturnType<typeof setTimeout> | undefined;
  let done = false;
  const run = () => {
    if (done) return;
    done = true;
    observer?.disconnect();
    clearTimeout(timer);
    callback();
  };
  if (performance.getEntriesByName("first-contentful-paint").length > 0) {
    run();
  } else {
    observer = new PerformanceObserver(run);
    observer.observe({ type: "paint", buffered: true });
    // Rede de segurança para navegadores sem o evento.
    timer = setTimeout(run, 3000);
  }
  return () => {
    done = true;
    observer?.disconnect();
    clearTimeout(timer);
  };
}

let pageInUse: Promise<void> | undefined;

/**
 * Resolve no primeiro sinal de uso da página (rolar, girar a roda do mouse,
 * tocar, clicar ou teclar) ou, se a pessoa só olhar a primeira tela, alguns
 * segundos depois. É a hora de buscar o que só importa fora da primeira tela:
 * o GSAP (o hero anima em CSS) e as texturas das cenas. Uma só espera para a
 * página toda; em navegações dentro do site, já está resolvida.
 */
export function whenPageInUse() {
  pageInUse ??= new Promise<void>((resolve) => {
    const events = ["scroll", "wheel", "touchstart", "pointerdown", "keydown"] as const;
    const start = () => {
      for (const type of events) window.removeEventListener(type, start);
      resolve();
    };
    for (const type of events) window.addEventListener(type, start, { passive: true });
    // Sem interação: pelo menos 5 s depois da primeira pintura, e então no
    // próximo momento ocioso do navegador.
    afterFirstContentfulPaint(() =>
      setTimeout(() => {
        if ("requestIdleCallback" in window) requestIdleCallback(start, { timeout: 2000 });
        else start();
      }, 5000),
    );
  });
  return pageInUse;
}

/**
 * Monta as animações GSAP de um elemento só quando a página começa a ser usada
 * (ver whenPageInUse) e quando ele chega a uma altura de tela de
 * distância. O próprio GSAP é baixado nessa hora, então não pesa no
 * carregamento; cada elemento monta numa tarefa própria, para nenhuma tarefa
 * longa travar a página.
 *
 * `setup` recebe o GSAP e os plugins, roda num gsap.context com escopo no
 * elemento (seletores relativos a ele) e pode devolver uma limpeza, como no
 * useGSAP. `visibleAtStart` indica se o elemento já estava na tela ao ser
 * montado: animações de entrada pulam esse caso, para não esconder e mostrar de
 * novo o que a pessoa já está vendo.
 */
export function useLazyGSAP(ref: RefObject<HTMLElement | null>, setup: Setup) {
  const init = useEffectEvent(setup);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    let cancelled = false;
    let context: gsap.Context | undefined;
    let observer: IntersectionObserver | undefined;
    let initTimer: ReturnType<typeof setTimeout> | undefined;

    whenPageInUse().then(() => {
      if (cancelled) return;
      observer = new IntersectionObserver(
        ([entry]) => {
          if (!entry?.isIntersecting) return;
          observer?.disconnect();
          const { top, bottom } = entry.boundingClientRect;
          const visibleAtStart = top < window.innerHeight && bottom > 0;
          initTimer = setTimeout(async () => {
            const tools = await loadGsap();
            if (cancelled) return;
            context = tools.gsap.context(
              () =>
                init(element, {
                  gsap: tools.gsap,
                  ScrollTrigger: tools.ScrollTrigger,
                  SplitText: tools.SplitText,
                  visibleAtStart,
                }),
              element,
            );
          }, 0);
        },
        // Uma altura de tela acima e abaixo da área visível.
        { rootMargin: "100% 0px" },
      );
      observer.observe(element);
    });

    return () => {
      cancelled = true;
      observer?.disconnect();
      clearTimeout(initTimer);
      context?.revert();
    };
  }, [ref]);
}
