"use client";

import { useRef, type ReactNode } from "react";

import { ShowcaseCopy, type ShowcaseCopyProps } from "./showcase-copy";
import { ShowcaseStage } from "./showcase-stage";
import { useScrollScene } from "./use-scroll-scene";

type CabinetRevealProps = Omit<ShowcaseCopyProps, "hint"> & {
  /** Fotos já renderizadas no servidor (4 a 6), arrumadas nas prateleiras. */
  photos: ReactNode[];
};

/**
 * Armário de duas portas que se abre com a rolagem: as portas giram nas
 * dobradiças, a fita de LED acende e as fotos sobem nas prateleiras.
 *
 * No HTML do servidor (e para quem pede "reduzir movimento") o armário já está
 * aberto e iluminado; o GSAP fecha as portas só quando vai animá-las.
 */
export function CabinetReveal({ photos, ...copy }: CabinetRevealProps) {
  const ref = useRef<HTMLElement>(null);

  useScrollScene(ref, (timeline) => {
    // 0 → 0,1: a câmera se aproxima do armário fechado.
    timeline.fromTo("[data-cabinet]", { scale: 0.9 }, { scale: 1, duration: 0.12 }, 0);
    // 0,1 → 0,55: as portas abrem nas dobradiças e escurecem ao virar para longe da luz.
    timeline.fromTo(
      "[data-door='left']",
      { rotationY: 0 },
      { rotationY: -100, duration: 0.45, ease: "power2.inOut" },
      0.1,
    );
    timeline.fromTo(
      "[data-door='right']",
      { rotationY: 0 },
      { rotationY: 100, duration: 0.45, ease: "power2.inOut" },
      0.1,
    );
    timeline.fromTo("[data-door-shade]", { opacity: 0 }, { opacity: 0.65, duration: 0.45 }, 0.1);
    // 0,28 → 0,6: a fita de LED acende — piscando, como um LED de verdade — e a luz invade o interior.
    timeline.set("[data-led]", { opacity: 0.12 }, 0);
    timeline.to(
      "[data-led]",
      { keyframes: { opacity: [0.12, 1, 0.25, 0.9, 0.5, 1] }, duration: 0.2 },
      0.28,
    );
    timeline.fromTo("[data-glow]", { opacity: 0 }, { opacity: 1, duration: 0.32 }, 0.28);
    timeline.fromTo("[data-spot]", { opacity: 0.25 }, { opacity: 1, duration: 0.4 }, 0.25);
    // 0,45 → 0,85: as fotos sobem nas prateleiras, uma a uma.
    timeline.fromTo(
      "[data-shelf-item]",
      { autoAlpha: 0.35, y: 28, scale: 0.94 },
      { autoAlpha: 1, y: 0, scale: 1, duration: 0.2, stagger: 0.04, ease: "power2.out" },
      0.45,
    );
  });

  return (
    <ShowcaseStage
      ref={ref}
      labelledBy={copy.id}
      copy={<ShowcaseCopy {...copy} hint="Role para abrir as portas" />}
      scene={
        // Margem lateral: espaço para as portas abertas sem invadir a coluna de texto.
        <div className="relative isolate [perspective:2200px] lg:px-[9%]">
          {/* Foco de luz atrás do móvel, mais intenso quando ele abre. */}
          <div
            data-spot
            aria-hidden="true"
            className="pointer-events-none absolute inset-[-15%] -z-10 bg-[radial-gradient(closest-side,rgb(227_176_126/0.16),transparent)]"
          />
          <div
            data-cabinet
            className="relative mx-auto aspect-[4/5] w-full max-w-[min(100%,38svh)] rounded-md carcass p-2.5 [transform-style:preserve-3d] lg:aspect-[4/3] lg:max-w-none"
          >
            {/* Interior do armário */}
            <div className="relative h-full overflow-hidden rounded-sm bg-espresso-800 shadow-[inset_0_0_70px_rgb(0_0_0/0.9)]">
              <div
                data-led
                aria-hidden="true"
                className="absolute inset-x-6 top-2 z-10 h-1 rounded-full bg-oak-100 shadow-[0_0_24px_6px_rgb(255_214_160/0.55)]"
              />
              <div
                data-glow
                aria-hidden="true"
                className="absolute inset-0 z-10 bg-[radial-gradient(ellipse_at_top,rgb(255_200_140/0.28),transparent_65%)] mix-blend-screen"
              />
              {/* Prateleira central */}
              <div
                aria-hidden="true"
                className="absolute inset-x-0 top-1/2 z-0 h-2 -translate-y-1/2 melamine opacity-80"
              />
              <ul className="relative grid h-full grid-cols-2 grid-rows-2 gap-3 p-4 pt-6 lg:grid-cols-3 lg:gap-4 lg:p-6 lg:pt-8 [&>li:nth-child(n+5)]:hidden lg:[&>li:nth-child(n+5)]:block">
                {photos.map((photo, index) => (
                  <li
                    key={index}
                    data-shelf-item
                    className="relative overflow-hidden rounded-sm shadow-soft ring-1 ring-black/40"
                  >
                    {photo}
                  </li>
                ))}
              </ul>
            </div>

            {/* Portas: frente em carvalho com puxador, verso em MDF claro. */}
            {(["left", "right"] as const).map((side) => (
              <div
                key={side}
                data-door={side}
                aria-hidden="true"
                className={
                  side === "left"
                    ? "absolute inset-y-2.5 left-2.5 w-[calc(50%-0.75rem)] origin-left [transform:rotateY(-100deg)] [transform-style:preserve-3d] motion-reduce:hidden"
                    : "absolute inset-y-2.5 right-2.5 w-[calc(50%-0.75rem)] origin-right [transform:rotateY(100deg)] [transform-style:preserve-3d] motion-reduce:hidden"
                }
              >
                <div className="absolute inset-0 rounded-[3px] veneer-oak [backface-visibility:hidden]">
                  <span
                    className={
                      side === "left"
                        ? "absolute top-1/2 right-4 h-2/5 w-1.5 -translate-y-1/2 handle-brass"
                        : "absolute top-1/2 left-4 h-2/5 w-1.5 -translate-y-1/2 handle-brass"
                    }
                  />
                  <span
                    data-door-shade
                    className="absolute inset-0 rounded-[3px] bg-black opacity-0"
                  />
                </div>
                {/* Verso (girado 180°: a dobradiça fica no lado oposto ao da frente). */}
                <div className="absolute inset-0 [transform:rotateY(180deg)] rounded-[3px] melamine [backface-visibility:hidden]">
                  <span className="absolute inset-0 rounded-[3px] bg-linear-to-b from-black/25 to-black/50" />
                  {["top-[12%]", "bottom-[12%]"].map((position) => (
                    <span
                      key={position}
                      className={`absolute ${position} ${side === "left" ? "right-1" : "left-1"} h-9 w-2.5 rounded-sm bg-linear-to-b from-zinc-300 to-zinc-500 shadow-sm`}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
          {/* Sombra no chão */}
          <div
            aria-hidden="true"
            className="mx-auto mt-6 h-6 w-3/4 rounded-[50%] bg-black/50 blur-xl"
          />
        </div>
      }
    />
  );
}
