import { Fragment } from "react";

/**
 * Título que entra palavra por palavra, cada uma saindo do desfoque com um
 * pequeno atraso (CSS puro: roda na primeira pintura, sem JS). As palavras nunca
 * ficam invisíveis — só desfocadas —, então o título conta para o LCP desde o
 * primeiro quadro. Trechos entre *asteriscos* recebem ênfase (itálico dourado).
 */
export function CascadeText({ text }: { text: string }) {
  let word = 0;
  return text.split("*").map((segment, index) => {
    const parts = segment.split(/(\s+)/).map((part, key) =>
      part.trim() === "" ? (
        part
      ) : (
        <span
          key={key}
          className="inline-block motion-safe:animate-word-focus"
          style={{ animationDelay: `${word++ * 75}ms` }}
        >
          {part}
        </span>
      ),
    );
    return index % 2 === 1 ? (
      <em key={index} className="text-brand">
        {parts}
      </em>
    ) : (
      <Fragment key={index}>{parts}</Fragment>
    );
  });
}
