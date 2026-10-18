"use client";

import Image from "next/image";
import { useRef } from "react";

import type { GalleryItem } from "@/lib/content";
import { POINTER_OK } from "@/components/motion/pointer-depth";
import { gsap, MOTION_OK, ScrollTrigger, useGSAP } from "@/lib/gsap";

type GalleryProps = {
  items: GalleryItem[];
};

/**
 * Mosaico que mostra cada foto inteira (sem cortar o móvel), com a legenda
 * sempre visível — no toque e no teclado também, não só ao passar o mouse.
 * Cada foto se revela ao entrar na tela, como uma cortina subindo; no desktop,
 * inclina em 3D seguindo o mouse, com um reflexo de luz.
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
      // Inclinação 3D + reflexo seguindo o mouse (só em computador).
      mm.add(POINTER_OK, () => {
        const cleanups = gsap.utils.toArray<HTMLElement>("[data-tilt]").map((card) => {
          gsap.set(card, { transformPerspective: 900 });
          const rotateX = gsap.quickTo(card, "rotationX", { duration: 0.8, ease: "power3.out" });
          const rotateY = gsap.quickTo(card, "rotationY", { duration: 0.8, ease: "power3.out" });
          const onMove = (event: PointerEvent) => {
            const box = card.getBoundingClientRect();
            const x = (event.clientX - box.left) / box.width;
            const y = (event.clientY - box.top) / box.height;
            rotateY((x - 0.5) * 10);
            rotateX((0.5 - y) * 8);
            card.style.setProperty("--shine-x", `${x * 100}%`);
            card.style.setProperty("--shine-y", `${y * 100}%`);
          };
          const onLeave = () => (rotateX(0), rotateY(0));
          card.addEventListener("pointermove", onMove);
          card.addEventListener("pointerleave", onLeave);
          return () => {
            card.removeEventListener("pointermove", onMove);
            card.removeEventListener("pointerleave", onLeave);
          };
        });
        return () => cleanups.forEach((cleanup) => cleanup());
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
            <div data-tilt className="relative overflow-hidden rounded-md bg-surface">
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
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_var(--shine-x,50%)_var(--shine-y,50%),rgb(255_255_255/0.18),transparent_55%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
              />
            </div>
            <figcaption className="mt-3 text-sm text-ink-muted">{item.caption}</figcaption>
          </figure>
        </li>
      ))}
    </ul>
  );
}
