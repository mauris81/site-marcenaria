"use client";

import { clsx } from "clsx";
import { useRef, type ReactNode } from "react";

import { ShowcaseCopy, type ShowcaseCopyProps } from "./showcase-copy";
import { ShowcaseStage } from "./showcase-stage";
import { useScrollScene } from "./use-scroll-scene";

const SLATS = 14;

type SlatsRevealProps = Omit<ShowcaseCopyProps, "hint"> & {
  /** Fotos já renderizadas no servidor (1 a 3), lado a lado atrás do ripado. */
  photos: ReactNode[];
};

/**
 * Painel ripado que se abre com a rolagem: as ripas giram como venezianas, em
 * onda, e revelam as fotos — que já se entreveem pelas frestas desde o início.
 * Com "reduzir movimento" (ou sem JS), as fotos aparecem sem o ripado.
 */
export function SlatsReveal({ photos, ...copy }: SlatsRevealProps) {
  const ref = useRef<HTMLElement>(null);

  useScrollScene(ref, (timeline) => {
    const wave = { each: 0.018, from: "start" } as const;

    // 0 → 0,12: a câmera se aproxima do painel fechado.
    timeline.fromTo("[data-panel]", { scale: 0.94 }, { scale: 1, duration: 0.12 }, 0);
    timeline.fromTo("[data-slats]", { autoAlpha: 1 }, { autoAlpha: 1, duration: 0.01 }, 0);
    // 0,1 → ~0,75: as ripas giram em onda, escurecendo ao virar para longe da luz.
    timeline.fromTo(
      "[data-slat]",
      { rotationY: 0, transformPerspective: 700 },
      { rotationY: 84, duration: 0.42, ease: "power2.inOut", stagger: wave },
      0.1,
    );
    timeline.fromTo(
      "[data-slat-shade]",
      { opacity: 0 },
      { opacity: 0.6, duration: 0.42, stagger: wave },
      0.1,
    );
    // 0,2 → 0,7: as fotos "acendem" e se assentam.
    timeline.fromTo("[data-photos-dim]", { opacity: 0.55 }, { opacity: 0, duration: 0.5 }, 0.2);
    timeline.fromTo("[data-photos]", { scale: 1.1 }, { scale: 1, duration: 0.55 }, 0.15);
    // 0,72 → 0,84: o ripado se dissolve e deixa as fotos limpas.
    timeline.to("[data-slats]", { autoAlpha: 0, duration: 0.12 }, 0.72);
  });

  return (
    <ShowcaseStage
      ref={ref}
      labelledBy={copy.id}
      copy={<ShowcaseCopy {...copy} hint="Role para girar as ripas" />}
      scene={
        <div className="relative isolate">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-[-15%] -z-10 bg-[radial-gradient(closest-side,rgb(227_176_126/0.14),transparent)]"
          />
          <div
            data-panel
            className="relative mx-auto aspect-[4/5] w-full max-w-[min(100%,35svh)] overflow-hidden rounded-md carcass p-2 lg:aspect-[4/3] lg:max-w-none"
          >
            {/* Fotos atrás do ripado */}
            <div className="relative h-full overflow-hidden rounded-sm">
              <ul
                data-photos
                className={clsx(
                  "grid h-full gap-1.5",
                  photos.length === 3 && "grid-cols-3",
                  photos.length === 2 && "grid-cols-2",
                )}
              >
                {photos.map((photo, index) => (
                  <li key={index} className="relative overflow-hidden">
                    {photo}
                  </li>
                ))}
              </ul>
              <div
                data-photos-dim
                aria-hidden="true"
                className="absolute inset-0 bg-black opacity-0"
              />
            </div>

            {/* Ripado: frestas deixam entrever as fotos desde o começo. */}
            <div
              data-slats
              aria-hidden="true"
              className="invisible absolute inset-2 flex gap-[3px] motion-reduce:hidden"
            >
              {Array.from({ length: SLATS }, (_, index) => (
                <div key={index} data-slat className="relative h-full flex-1">
                  <div className="absolute inset-0 rounded-[1px] veneer-slat" />
                  <div data-slat-shade className="absolute inset-0 bg-black opacity-0" />
                </div>
              ))}
            </div>
          </div>
          <div
            aria-hidden="true"
            className="mx-auto mt-4 h-5 w-3/4 rounded-[50%] bg-black/50 blur-xl lg:mt-6 lg:h-6"
          />
        </div>
      }
    />
  );
}
