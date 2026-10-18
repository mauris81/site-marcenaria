"use client";

import { useRef } from "react";

import { gsap, MOTION_OK, useGSAP } from "@/lib/gsap";

/** Só em computador (mouse/touchpad) e sem "reduzir movimento". */
export const POINTER_OK = `${MOTION_OK} and (hover: hover) and (pointer: fine)`;

/**
 * Profundidade guiada pelo mouse: dentro da seção-mãe, cada elemento com
 * `data-depth` desliza na direção do cursor (valores negativos, no sentido
 * oposto), como camadas a distâncias diferentes da câmera.
 */
export function PointerDepth() {
  const ref = useRef<HTMLSpanElement>(null);

  useGSAP(() => {
    const section = ref.current?.parentElement;
    if (!section) return;

    const mm = gsap.matchMedia();
    mm.add(POINTER_OK, () => {
      const layers = gsap.utils.toArray<HTMLElement>("[data-depth]", section).map((element) => ({
        depth: Number(element.dataset.depth),
        x: gsap.quickTo(element, "x", { duration: 1.4, ease: "power3.out" }),
        y: gsap.quickTo(element, "y", { duration: 1.4, ease: "power3.out" }),
      }));

      const onMove = (event: PointerEvent) => {
        const box = section.getBoundingClientRect();
        const nx = (event.clientX - box.left) / box.width - 0.5;
        const ny = (event.clientY - box.top) / box.height - 0.5;
        for (const layer of layers) {
          layer.x(nx * layer.depth * box.width);
          layer.y(ny * layer.depth * box.height);
        }
      };
      const onLeave = () => layers.forEach((layer) => (layer.x(0), layer.y(0)));

      section.addEventListener("pointermove", onMove);
      section.addEventListener("pointerleave", onLeave);
      return () => {
        section.removeEventListener("pointermove", onMove);
        section.removeEventListener("pointerleave", onLeave);
      };
    });
    return () => mm.revert();
  });

  return <span ref={ref} aria-hidden="true" className="hidden" />;
}
