"use client";

import { useRef, type ReactNode } from "react";

import { ShowcaseCopy, type ShowcaseCopyProps } from "./showcase-copy";
import { ShowcaseStage } from "./showcase-stage";
import { useScrollScene } from "./use-scroll-scene";

type SlidingDoorRevealProps = Omit<ShowcaseCopyProps, "hint"> & {
  /** Fotos já renderizadas no servidor (4), no ambiente atrás da porta. */
  photos: ReactNode[];
};

// Voltas das roldanas para a porta percorrer a própria largura: deslocamento ÷
// circunferência (roldana com 9% da largura da porta) — vale em qualquer tamanho.
const WHEEL_TURNS = (1 / (Math.PI * 0.09)) * 360;

/**
 * Porta de correr com trilho aparente que desliza com a rolagem: as roldanas
 * giram no trilho, a porta balança de leve ao arrancar e ao parar, a luz do
 * ambiente atravessa o vão e as fotos aparecem lá dentro.
 *
 * No HTML do servidor (e para quem pede "reduzir movimento") a porta já está
 * aberta, encostada na parede; o GSAP a fecha só quando vai animá-la.
 */
export function SlidingDoorReveal({ photos, ...copy }: SlidingDoorRevealProps) {
  const ref = useRef<HTMLElement>(null);

  useScrollScene(ref, (timeline) => {
    // 0 → 0,12: a câmera se aproxima da parede.
    timeline.fromTo("[data-wall]", { scale: 0.92 }, { scale: 1, duration: 0.12 }, 0);
    // 0,1 → 0,6: a porta corre no trilho e desacelera no fim, como um amortecedor.
    // `x: 0` zera o deslocamento que o GSAP herda do `translate` CSS (porta aberta
    // no HTML); sem isso, ele se somaria ao xPercent.
    timeline.fromTo(
      "[data-sliding-door]",
      { x: 0, xPercent: 0 },
      { x: 0, xPercent: 100, duration: 0.5, ease: "power3.inOut" },
      0.1,
    );
    timeline.fromTo(
      "[data-wheel]",
      { rotation: 0 },
      { rotation: WHEEL_TURNS, duration: 0.5, ease: "power3.inOut" },
      0.1,
    );
    // Pendurada no trilho, a porta balança de leve ao arrancar e ao parar.
    timeline.to(
      "[data-sliding-door]",
      { keyframes: { rotation: [0, -0.8, 0.4, 0] }, duration: 0.5 },
      0.1,
    );
    // 0,22 → 0,64: a luz do ambiente atravessa o vão e se espalha pelo piso.
    timeline.fromTo("[data-room-shade]", { opacity: 0.88 }, { opacity: 0, duration: 0.4 }, 0.22);
    timeline.fromTo("[data-floor-light]", { opacity: 0 }, { opacity: 1, duration: 0.4 }, 0.24);
    timeline.fromTo("[data-spot]", { opacity: 0.25 }, { opacity: 1, duration: 0.4 }, 0.24);
    // 0,45 → 0,85: as fotos aparecem no ambiente, uma a uma.
    timeline.fromTo(
      "[data-room-item]",
      { autoAlpha: 0.35, y: 22, scale: 0.95 },
      { autoAlpha: 1, y: 0, scale: 1, duration: 0.2, stagger: 0.05, ease: "power2.out" },
      0.45,
    );
  });

  return (
    <ShowcaseStage
      ref={ref}
      labelledBy={copy.id}
      copy={<ShowcaseCopy {...copy} hint="Role para deslizar a porta" />}
      scene={
        <div className="relative isolate">
          {/* Foco de luz atrás da parede, mais intenso com a porta aberta. */}
          <div
            data-spot
            aria-hidden="true"
            className="pointer-events-none absolute inset-[-15%] -z-10 bg-[radial-gradient(closest-side,rgb(227_176_126/0.16),transparent)]"
          />
          <div
            data-wall
            className="relative mx-auto aspect-[4/5] w-full max-w-[min(100%,38svh)] overflow-hidden rounded-md bg-linear-to-b from-espresso-800 to-espresso-900 shadow-lift lg:aspect-[16/11] lg:max-w-none"
          >
            {/* Piso de madeira e rodapé */}
            <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-[13%] floor-oak" />
            <div
              aria-hidden="true"
              className="absolute inset-x-0 bottom-[13%] h-[1.2%] bg-black/60"
            />

            {/* Vão da porta, com o ambiente iluminado */}
            <div className="absolute top-[15%] bottom-[13%] left-[8%] w-[58%] overflow-hidden bg-espresso-950 shadow-[inset_0_0_50px_rgb(0_0_0/0.85)] ring-1 ring-black/60">
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgb(255_200_140/0.3),transparent_70%)] mix-blend-screen"
              />
              <ul className="relative grid h-full grid-cols-2 grid-rows-2 gap-2 p-2.5 lg:gap-3 lg:p-4">
                {photos.map((photo, index) => (
                  <li
                    key={index}
                    data-room-item
                    className="relative overflow-hidden rounded-sm shadow-soft ring-1 ring-black/40"
                  >
                    {photo}
                  </li>
                ))}
              </ul>
              <div
                data-room-shade
                aria-hidden="true"
                className="absolute inset-0 bg-black opacity-0"
              />
            </div>

            {/* Luz que sai pelo vão e se espalha no piso */}
            <div
              data-floor-light
              aria-hidden="true"
              className="absolute bottom-0 left-[4%] h-[13%] w-[66%] bg-linear-to-b from-[rgb(255_196_130/0.4)] to-transparent [clip-path:polygon(6%_0,94%_0,100%_100%,0_100%)]"
            />

            {/* Trilho aparente, com o batente de fim de curso */}
            <div
              aria-hidden="true"
              className="absolute top-[9%] -right-[3%] left-[3%] h-[1.4%] rounded-full hardware-black"
            />
            <div
              aria-hidden="true"
              className="absolute top-[8.3%] left-[3%] h-[2.8%] w-[1.4%] rounded-[1px] hardware-black"
            />

            {/* Porta: começa aberta no HTML; a borda de cima fica na linha do trilho. */}
            <div
              data-sliding-door
              aria-hidden="true"
              className="absolute top-[9%] bottom-[13.6%] left-[6%] w-[62%] origin-top translate-x-full"
            >
              {/* Folha em carvalho, com puxador de barra e sombra na parede */}
              <div className="absolute inset-x-0 top-[5%] bottom-0 rounded-[3px] veneer-oak shadow-[18px_22px_40px_-12px_rgb(0_0_0/0.75)]">
                <span className="absolute top-1/2 left-[6%] h-[42%] w-[2.4%] -translate-y-1/2 rounded-full hardware-black" />
              </div>
              {/* Ferragens: alça presa à folha e roldana correndo sobre o trilho */}
              {["left-[16%]", "left-[84%]"].map((position) => (
                <div key={position} className={`absolute top-0 ${position} aspect-[1/2] w-[9%]`}>
                  <span className="absolute top-0 left-1/2 h-full w-[34%] -translate-x-1/2 rounded-b-[2px] hardware-black" />
                  <span className="absolute inset-x-0 top-0 aspect-square -translate-y-[70%]">
                    <span
                      data-wheel
                      className="absolute inset-0 rounded-full bg-[radial-gradient(circle,#5a5a60_0_16%,#1b1b1e_18%_66%,#3d3d42_68%_76%,#0c0c0e_78%)] shadow-[0_2px_6px_rgb(0_0_0/0.6)]"
                    >
                      {/* Raio: deixa ver a roldana girando */}
                      <span className="absolute top-[14%] left-1/2 h-[34%] w-[12%] -translate-x-1/2 rounded-full bg-zinc-500/80" />
                    </span>
                  </span>
                </div>
              ))}
            </div>
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
