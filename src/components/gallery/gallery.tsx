"use client";

import { Expand } from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";

import type { GalleryItem } from "@/lib/content";
import { POINTER_OK } from "@/components/motion/pointer-depth";
import { gsap, MOTION_OK, ScrollTrigger, useGSAP } from "@/lib/gsap";

import { Lightbox } from "./lightbox";

type GalleryProps = {
  items: GalleryItem[];
};

/**
 * Mosaico que mostra cada foto inteira (sem cortar o móvel), com a legenda
 * sempre visível — no toque e no teclado também, não só ao passar o mouse.
 * Cada foto se revela ao entrar na tela, como uma cortina subindo; no desktop,
 * inclina em 3D seguindo o mouse, com um reflexo de luz. Clicar amplia a foto.
 */
export function Gallery({ items }: GalleryProps) {
  const ref = useRef<HTMLUListElement>(null);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        // `opacity`, e não `autoAlpha` (visibility: hidden): fotos ainda não
        // reveladas continuam no leitor de tela e na ordem do Tab.
        const figures = gsap.utils.toArray<HTMLElement>("[data-gallery-item]");
        const shown = { opacity: 1, y: 0, clipPath: "inset(0% 0% 0% 0%)" };
        gsap.set(figures, { opacity: 0, y: 48, clipPath: "inset(14% 0% 0% 0%)" });
        ScrollTrigger.batch(figures, {
          start: "top 92%",
          once: true,
          onEnter: (batch) => gsap.to(batch, { ...shown, stagger: 0.08, duration: 1.2 }),
        });
        // Se o foco do teclado chegar a uma foto antes da rolagem, ela aparece na hora.
        const list = ref.current;
        const revealFocused = (event: FocusEvent) => {
          const figure = (event.target as HTMLElement).closest("[data-gallery-item]");
          if (figure) gsap.to(figure, { ...shown, duration: 0.4, overwrite: true });
        };
        list?.addEventListener("focusin", revealFocused);
        return () => list?.removeEventListener("focusin", revealFocused);
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
    <>
      <ul ref={ref} className="gap-6 sm:columns-2 lg:columns-3">
        {items.map((item, index) => (
          <li key={item.src} data-gallery-item className="mb-6 break-inside-avoid">
            <figure className="group">
              <button
                type="button"
                onClick={() => setOpenIndex(index)}
                aria-label={`Ampliar foto: ${item.caption}`}
                className="block w-full cursor-zoom-in rounded-md"
              >
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
                  {/* Selo "Ampliar": deixa claro que a foto é clicável */}
                  <span
                    aria-hidden="true"
                    className="absolute top-3 right-3 inline-flex translate-y-1 items-center gap-1.5 rounded-full bg-canvas/80 px-3 py-1.5 text-xs font-semibold text-ink opacity-0 backdrop-blur transition duration-500 ease-out-expo group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100"
                  >
                    <Expand className="size-3.5" />
                    Ampliar
                  </span>
                </div>
              </button>
              <figcaption className="mt-3 text-sm text-ink-muted">{item.caption}</figcaption>
            </figure>
          </li>
        ))}
      </ul>
      <Lightbox
        items={items}
        index={openIndex}
        onIndexChange={setOpenIndex}
        onClose={() => setOpenIndex(null)}
      />
    </>
  );
}
