"use client";

import { useRef } from "react";

import { gsap, MOTION_OK, useGSAP } from "@/lib/gsap";

/**
 * Letreiro que desliza na horizontal conforme a página rola. Por depender da
 * rolagem (e não de um loop automático), quem controla o movimento é o usuário.
 * Com "reduzir movimento", vira uma lista estática quebrando em linhas.
 */
export function ScrollMarquee({ items }: { items: string[] }) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const root = ref.current;
      if (!root) return;

      const track = root.querySelector<HTMLElement>("[data-marquee-track]");
      if (!track) return;

      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        // Percorre a lista inteira enquanto a seção cruza a tela (recalculado ao redimensionar).
        gsap.to(track, {
          x: () => -(track.scrollWidth - root.clientWidth),
          ease: "none",
          scrollTrigger: {
            trigger: root,
            start: "top bottom",
            end: "bottom top",
            scrub: 0.8,
            invalidateOnRefresh: true,
          },
        });
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <div
      ref={ref}
      className="overflow-hidden border-y border-line [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)] py-8"
    >
      <ul
        data-marquee-track
        className="flex w-max items-center gap-10 pl-[8vw] font-display text-display font-light motion-reduce:w-auto motion-reduce:flex-wrap motion-reduce:justify-center motion-reduce:gap-y-4 motion-reduce:pl-0 motion-reduce:text-heading"
      >
        {items.map((item) => (
          <li key={item} className="flex items-center gap-10 whitespace-nowrap">
            {item}
            <span aria-hidden="true" className="size-2 rounded-full bg-brand" />
          </li>
        ))}
      </ul>
    </div>
  );
}
