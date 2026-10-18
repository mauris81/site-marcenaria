import type { ReactNode, Ref } from "react";

type ShowcaseStageProps = {
  ref: Ref<HTMLElement>;
  labelledBy: string;
  copy: ReactNode;
  scene: ReactNode;
};

/**
 * Estrutura de uma cena: a seção é alta (260svh) e o palco fica preso na tela
 * (sticky) enquanto ela passa — é essa distância de rolagem que "abre" o móvel.
 * O espaço é reservado pelo CSS desde o HTML do servidor, então nada pula
 * quando o JavaScript carrega. Com "reduzir movimento", vira uma seção comum.
 */
export function ShowcaseStage({ ref, labelledBy, copy, scene }: ShowcaseStageProps) {
  return (
    <article ref={ref} aria-labelledby={labelledBy} className="relative motion-safe:h-[260svh]">
      <div className="flex items-center overflow-hidden py-20 motion-safe:sticky motion-safe:top-0 motion-safe:h-svh motion-safe:py-0">
        <div className="container-site grid w-full items-center gap-10 pt-16 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-16 lg:pt-0">
          {copy}
          {scene}
        </div>
      </div>
    </article>
  );
}
