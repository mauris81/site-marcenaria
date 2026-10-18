"use client";

import { useRef } from "react";

import { useLazyGSAP } from "@/components/motion/use-lazy-gsap";
import { MOTION_OK } from "@/lib/motion";

import { SectionHeading } from "./section-heading";

type RegionsSectionProps = {
  eyebrow?: string;
  title: string;
  text?: string;
  neighborhoods: string[];
};

/**
 * Bairros atendidos num letreiro horizontal guiado pela rolagem. A seção fica
 * presa na tela (sticky) enquanto a lista desliza devagar — mais ou menos na
 * velocidade da própria rolagem —, e o bairro que passa pelo centro acende,
 * um de cada vez. Com "reduzir movimento", vira uma lista estática.
 */
export function RegionsSection({ eyebrow, title, text, neighborhoods }: RegionsSectionProps) {
  const ref = useRef<HTMLElement>(null);

  useLazyGSAP(ref, (section, { gsap }) => {
    const viewport = section.querySelector<HTMLElement>("[data-regions-viewport]");
    const track = section.querySelector<HTMLElement>("[data-regions-track]");
    if (!viewport || !track) return;
    const items = Array.from(track.children) as HTMLElement[];

    // Marca o bairro mais próximo do centro da tela.
    const highlightCenter = () => {
      const center = window.innerWidth / 2;
      let nearest: HTMLElement | undefined;
      let distance = Infinity;
      for (const item of items) {
        const box = item.getBoundingClientRect();
        const d = Math.abs(box.left + box.width / 2 - center);
        if (d < distance) [nearest, distance] = [item, d];
      }
      for (const item of items) item.toggleAttribute("data-active", item === nearest);
    };

    const mm = gsap.matchMedia();
    mm.add(MOTION_OK, () => {
      const scrollTrigger = {
        trigger: section,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.8,
        invalidateOnRefresh: true,
      };
      gsap.fromTo(
        track,
        { x: 0 },
        {
          x: () => -(track.scrollWidth - viewport.clientWidth),
          ease: "none",
          scrollTrigger: { ...scrollTrigger },
          onUpdate: highlightCenter,
        },
      );
      gsap.fromTo(
        "[data-regions-progress]",
        { scaleX: 0 },
        { scaleX: 1, ease: "none", scrollTrigger: { ...scrollTrigger } },
      );
      highlightCenter();
      return () => items.forEach((item) => item.removeAttribute("data-active"));
    });
    return () => mm.revert();
  });

  return (
    <section ref={ref} aria-labelledby="regioes" className="relative motion-safe:h-[240svh]">
      <div className="flex flex-col justify-center gap-12 overflow-hidden py-24 motion-safe:sticky motion-safe:top-0 motion-safe:h-svh motion-safe:py-0">
        <div className="container-site">
          <SectionHeading id="regioes" eyebrow={eyebrow} title={title} text={text} />
        </div>
        <div
          data-regions-viewport
          className="border-y border-line [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)] py-8"
        >
          <ul
            data-regions-track
            className="flex w-max items-center gap-10 px-[10vw] font-display text-heading font-light text-ink-muted motion-reduce:w-auto motion-reduce:flex-wrap motion-reduce:justify-center motion-reduce:gap-y-4 motion-reduce:px-5 motion-reduce:text-ink"
          >
            {neighborhoods.map((neighborhood) => (
              <li
                key={neighborhood}
                className="flex items-center gap-10 whitespace-nowrap transition-colors duration-500 data-active:text-brand"
              >
                {neighborhood}
                <span aria-hidden="true" className="size-2 rounded-full bg-brand" />
              </li>
            ))}
          </ul>
        </div>
        <div className="container-site motion-reduce:hidden">
          <div aria-hidden="true" className="h-px w-full bg-line-strong">
            <div data-regions-progress className="h-full origin-left bg-brand" />
          </div>
        </div>
      </div>
    </section>
  );
}
