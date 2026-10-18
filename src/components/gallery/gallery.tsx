"use client";

import Image from "next/image";
import { useRef } from "react";

import type { GalleryItem } from "@/lib/content";
import { gsap, MOTION_OK, ScrollTrigger, useGSAP } from "@/lib/gsap";

type GalleryProps = {
  items: GalleryItem[];
};

/**
 * Mosaico que mostra cada foto inteira (sem cortar o móvel), com a legenda
 * sempre visível — no toque e no teclado também, não só ao passar o mouse.
 * Cada foto se revela ao entrar na tela, como uma cortina subindo.
 */
export function Gallery({ items }: GalleryProps) {
  const ref = useRef<HTMLUListElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const figures = gsap.utils.toArray<HTMLElement>("[data-gallery-item]");
        gsap.set(figures, { autoAlpha: 0, y: 48, clipPath: "inset(14% 0% 0% 0%)" });
        ScrollTrigger.batch(figures, {
          start: "top 92%",
          once: true,
          onEnter: (batch) =>
            gsap.to(batch, {
              autoAlpha: 1,
              y: 0,
              clipPath: "inset(0% 0% 0% 0%)",
              stagger: 0.08,
              duration: 1.2,
            }),
        });
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <ul ref={ref} className="gap-6 sm:columns-2 lg:columns-3">
      {items.map((item) => (
        <li key={item.src} data-gallery-item className="mb-6 break-inside-avoid">
          <figure className="group">
            <div className="overflow-hidden rounded-md bg-surface">
              <Image
                src={item.src}
                alt={item.alt}
                width={item.width}
                height={item.height}
                placeholder="blur"
                blurDataURL={item.blurDataURL}
                sizes="(min-width: 1024px) 28vw, (min-width: 640px) 45vw, 100vw"
                className="h-auto w-full transition duration-700 ease-out-expo group-hover:scale-[1.04]"
              />
            </div>
            <figcaption className="mt-3 text-sm text-ink-muted">{item.caption}</figcaption>
          </figure>
        </li>
      ))}
    </ul>
  );
}
