"use client";

import { ChevronLeft, ChevronRight, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, type KeyboardEvent, type PointerEvent } from "react";

import type { GalleryItem } from "@/lib/content";

type LightboxProps = {
  items: GalleryItem[];
  /** Foto aberta; `null` mantém o lightbox fechado. */
  index: number | null;
  onIndexChange: (index: number) => void;
  onClose: () => void;
};

const controlClass =
  "inline-flex size-12 items-center justify-center rounded-full border border-line-strong bg-canvas/70 text-ink backdrop-blur transition duration-300 hover:bg-ink hover:text-canvas";

/**
 * Foto ampliada em tela cheia, num <dialog> nativo: foco preso, Esc fecha e o
 * foco volta para a miniatura clicada. Navegação por botões, setas do teclado e
 * deslize do dedo; contador e legenda são anunciados por leitores de tela.
 */
export function Lightbox({ items, index, onIndexChange, onClose }: LightboxProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const swipeStart = useRef<number | null>(null);
  const item = index === null ? null : items[index];

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (index !== null && !dialog.open) dialog.showModal();
    if (index === null && dialog.open) dialog.close();
  }, [index]);

  const go = (step: number) => {
    if (index === null) return;
    onIndexChange((index + step + items.length) % items.length);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLDialogElement>) => {
    if (event.key === "ArrowRight") go(1);
    if (event.key === "ArrowLeft") go(-1);
  };

  const onPointerDown = (event: PointerEvent) => {
    swipeStart.current = event.clientX;
  };
  const onPointerUp = (event: PointerEvent) => {
    if (swipeStart.current === null) return;
    const distance = event.clientX - swipeStart.current;
    swipeStart.current = null;
    if (Math.abs(distance) > 50) go(distance < 0 ? 1 : -1);
  };

  const neighbors =
    index === null
      ? []
      : [items[(index + 1) % items.length], items[(index - 1 + items.length) % items.length]];

  return (
    <dialog
      ref={dialogRef}
      aria-label="Foto ampliada"
      onClose={onClose}
      onKeyDown={onKeyDown}
      className="m-0 h-dvh max-h-none w-full max-w-none bg-espresso-950/95 p-0 text-ink opacity-0 transition-all transition-discrete duration-500 ease-out-expo backdrop:bg-black/70 open:opacity-100 starting:open:opacity-0"
    >
      {item && index !== null && (
        <div className="flex h-full flex-col">
          <div className="container-site flex h-20 shrink-0 items-center justify-between">
            <p aria-live="polite" className="text-sm text-ink-muted tabular-nums">
              {index + 1} de {items.length}
            </p>
            <button type="button" onClick={onClose} className={controlClass}>
              <X aria-hidden="true" className="size-5" />
              <span className="sr-only">Fechar foto ampliada</span>
            </button>
          </div>

          <figure className="flex min-h-0 flex-1 flex-col">
            <div
              className="relative min-h-0 flex-1 touch-pan-y select-none"
              onPointerDown={onPointerDown}
              onPointerUp={onPointerUp}
            >
              <Image
                key={item.src}
                src={item.src}
                alt={item.alt}
                fill
                sizes="100vw"
                placeholder="blur"
                blurDataURL={item.blurDataURL}
                className="object-contain motion-safe:animate-lightbox-in"
              />
            </div>
            <figcaption
              aria-live="polite"
              className="container-site shrink-0 py-6 text-center font-display text-title"
            >
              {item.caption}
            </figcaption>
          </figure>

          <button
            type="button"
            onClick={() => go(-1)}
            className={`${controlClass} absolute top-1/2 left-3 -translate-y-1/2 sm:left-6`}
          >
            <ChevronLeft aria-hidden="true" className="size-6" />
            <span className="sr-only">Foto anterior</span>
          </button>
          <button
            type="button"
            onClick={() => go(1)}
            className={`${controlClass} absolute top-1/2 right-3 -translate-y-1/2 sm:right-6`}
          >
            <ChevronRight aria-hidden="true" className="size-6" />
            <span className="sr-only">Próxima foto</span>
          </button>

          {/* Pré-carrega as vizinhas para a troca ser instantânea. */}
          <div
            aria-hidden="true"
            className="pointer-events-none fixed size-px overflow-hidden opacity-0"
          >
            {neighbors.map((neighbor) => (
              <Image
                key={neighbor.src}
                src={neighbor.src}
                alt=""
                width={neighbor.width}
                height={neighbor.height}
                sizes="100vw"
                loading="eager"
              />
            ))}
          </div>
        </div>
      )}
    </dialog>
  );
}
