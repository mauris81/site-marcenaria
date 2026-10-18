"use client";

import { useRef, type CSSProperties, type ReactNode } from "react";

import { ShowcaseCopy, type ShowcaseCopyProps } from "./showcase-copy";
import { ShowcaseStage } from "./showcase-stage";
import { useScrollScene } from "./use-scroll-scene";

// Trecho da lâmina em cada frente (gaveta de cima, do meio e de baixo).
const FRONT_POSITIONS = ["0% 0%", "100% 55%", "35% 100%"];

type DrawerRevealProps = Omit<ShowcaseCopyProps, "hint"> & {
  /** Fotos já renderizadas no servidor (4 a 6), arrumadas nas divisórias da gaveta. */
  photos: ReactNode[];
};

/**
 * Cômoda cuja gaveta de cima desliza para fora com a rolagem, revelando uma
 * bandeja com divisórias onde estão as fotos; no fim, a câmera inclina e se
 * aproxima para olhar dentro da gaveta.
 *
 * A gaveta é uma caixa 3D de verdade montada com CSS: frente, laterais, fundo e
 * traseira são planos girados (rotateX/rotateY) a partir das bordas da frente.
 * A profundidade vem da variável --depth (px), que muda com a largura da tela.
 * Com "reduzir movimento", a cena 3D dá lugar à gaveta aberta vista de cima,
 * plana — as fotos aparecem sem distorção.
 */
export function DrawerReveal({ photos, ...copy }: DrawerRevealProps) {
  const ref = useRef<HTMLElement>(null);

  useScrollScene(ref, (timeline) => {
    // Profundidade da gaveta (--depth, definida na cena e herdada pela gaveta).
    const depth = () => {
      const drawer = ref.current?.querySelector("[data-drawer]");
      return drawer ? parseFloat(getComputedStyle(drawer).getPropertyValue("--depth")) || 240 : 240;
    };

    // 0 → 0,12: a câmera se aproxima da cômoda fechada, vista um pouco de cima.
    timeline.fromTo(
      "[data-world]",
      { rotationX: -10, yPercent: 0, scale: 0.9 },
      { rotationX: -10, scale: 1, duration: 0.12 },
      0,
    );
    // 0,12 → 0,5: a gaveta desliza para fora em profundidade.
    timeline.fromTo(
      "[data-drawer]",
      { z: 0 },
      { z: () => depth(), duration: 0.38, ease: "power2.inOut" },
      0.12,
    );
    // 0,3 → 0,6: a luz interna da gaveta acende.
    timeline.fromTo("[data-drawer-light]", { opacity: 0 }, { opacity: 1, duration: 0.3 }, 0.3);
    // 0,42 → 0,85: a câmera inclina e se aproxima para olhar dentro da gaveta.
    timeline.to(
      "[data-world]",
      { rotationX: -52, scale: 1.05, yPercent: 8, duration: 0.43, ease: "power2.inOut" },
      0.42,
    );
    timeline.fromTo(
      "[data-tray-item]",
      { autoAlpha: 0.4, scale: 0.92 },
      { autoAlpha: 1, scale: 1, duration: 0.2, stagger: 0.04, ease: "power2.out" },
      0.55,
    );
  });

  // Frente de gaveta com o veio na horizontal; cada gaveta mostra outro trecho da lâmina.
  const drawerFront = (position: string) => (
    <div
      aria-hidden="true"
      className="absolute inset-0 rounded-[3px] veneer-oak-across [--veneer-size:150%_auto]"
      style={{ "--veneer-position": position } as CSSProperties}
    >
      <span className="absolute top-1/2 left-1/2 h-1.5 w-1/3 -translate-x-1/2 -translate-y-1/2 handle-brass" />
    </div>
  );

  return (
    <ShowcaseStage
      ref={ref}
      labelledBy={copy.id}
      copy={<ShowcaseCopy {...copy} hint="Role para puxar a gaveta" />}
      scene={
        <div className="relative isolate mx-auto w-full max-w-[min(100%,40svh)] [--depth:190px] lg:max-w-[min(100%,480px)] lg:[--depth:280px]">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-[-25%] -z-10 bg-[radial-gradient(closest-side,rgb(227_176_126/0.14),transparent)]"
          />

          {/* Cena 3D (animada). Câmera acima e à esquerda: dá para ver a lateral da gaveta saindo. */}
          <div className="flex h-[46svh] items-center overflow-hidden [mask-image:linear-gradient(to_bottom,transparent,black_10%,black_90%,transparent)] [perspective-origin:35%_-40%] [perspective:1400px] motion-reduce:hidden lg:h-[64svh]">
            {/* Mundo: a cômoda inteira, girando em torno da gaveta de cima (a "câmera" inclina). */}
            <div
              data-world
              className="relative w-full origin-[50%_17%] [transform:translateY(8%)_rotateX(-52deg)_scale(1.05)] [transform-style:preserve-3d]"
            >
              {/* Tampo */}
              <div
                aria-hidden="true"
                className="absolute inset-x-0 bottom-full h-[calc(var(--depth)*0.45)] origin-bottom [transform:rotateX(90deg)] veneer-oak-across brightness-125"
              />
              {/* Corpo com as três gavetas */}
              <div className="relative grid grid-rows-3 gap-2 rounded-sm carcass p-2 [transform-style:preserve-3d]">
                <div className="relative aspect-[5/2] [transform-style:preserve-3d] lg:aspect-[3/1]">
                  {/* Vão escuro que aparece quando a gaveta sai */}
                  <div aria-hidden="true" className="absolute inset-0 bg-black" />
                  {/* Gaveta: caixa 3D que desliza (já aberta no HTML do servidor) */}
                  <div
                    data-drawer
                    className="absolute inset-0 [transform:translateZ(var(--depth))] [transform-style:preserve-3d]"
                  >
                    {/* Fundo com divisórias e fotos: face para cima, da traseira até a frente da gaveta */}
                    <div className="absolute inset-x-0 top-full h-[var(--depth)] origin-top [transform:translateZ(calc(var(--depth)*-1))_rotateX(90deg)] melamine">
                      <div
                        data-drawer-light
                        aria-hidden="true"
                        className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgb(255_210_150/0.45),transparent_75%)]"
                      />
                      <ul className="relative grid h-full grid-cols-3 grid-rows-2 gap-1.5 p-2 lg:gap-2.5 lg:p-3">
                        {photos.map((photo, index) => (
                          <li
                            key={index}
                            data-tray-item
                            className="relative overflow-hidden rounded-[2px] ring-4 ring-espresso-700/90"
                          >
                            {photo}
                          </li>
                        ))}
                      </ul>
                    </div>
                    {/* Laterais e traseira */}
                    <div
                      aria-hidden="true"
                      className="absolute inset-y-0 left-0 w-[var(--depth)] origin-left [transform:rotateY(90deg)] veneer-oak-across brightness-75"
                    />
                    <div
                      aria-hidden="true"
                      className="absolute inset-y-0 right-0 w-[var(--depth)] origin-right [transform:rotateY(-90deg)] veneer-oak-across brightness-75"
                    />
                    <div
                      aria-hidden="true"
                      className="absolute inset-0 [transform:translateZ(calc(var(--depth)*-1))] veneer-oak-across brightness-50"
                    />
                    {drawerFront(FRONT_POSITIONS[0])}
                  </div>
                </div>
                {/* Gavetas de baixo (fixas) */}
                {FRONT_POSITIONS.slice(1).map((position) => (
                  <div key={position} className="relative aspect-[5/2] lg:aspect-[3/1]">
                    {drawerFront(position)}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Reduzir movimento: gaveta aberta vista de cima, plana e legível. */}
          <div className="hidden motion-reduce:block">
            <ul className="grid grid-cols-3 gap-2 rounded-t-sm melamine p-3">
              {photos.map((photo, index) => (
                <li
                  key={index}
                  className="relative aspect-[4/3] overflow-hidden rounded-[2px] ring-4 ring-espresso-700/90"
                >
                  {photo}
                </li>
              ))}
            </ul>
            <div className="relative h-14">{drawerFront(FRONT_POSITIONS[0])}</div>
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
