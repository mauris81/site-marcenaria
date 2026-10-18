import "server-only";

import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

// Só para componentes de servidor, que rodam no build. No navegador, o
// tailwind-merge somaria cerca de 29 KB de JavaScript e montaria o mapa de
// classes durante a hidratação (~17 ms num PC, bem mais num celular). Componentes
// de cliente, e o que eles importam, usam o clsx direto, sem classes conflitantes.
// O "server-only" faz o build falhar se o cn for parar no navegador.
//
// O tailwind-merge precisa conhecer os tokens próprios do projeto. Sem isso,
// `text-lead` (tamanho) e `text-ink` (cor) seriam tratados como conflitantes
// e um deles seria descartado silenciosamente.
const twMerge = extendTailwindMerge({
  extend: {
    theme: {
      color: [
        "canvas",
        "surface",
        "ink",
        "ink-muted",
        "brand",
        "line",
        "line-strong",
        "primary",
        "on-primary",
        "danger",
        "whatsapp",
        "whatsapp-hover",
        "whatsapp-bright",
        "whatsapp-bright-hover",
      ],
      text: ["display-xl", "display", "heading", "title", "lead", "eyebrow"],
      ease: ["out-expo", "out-quart", "in-out-quint"],
      shadow: ["soft", "lift"],
    },
  },
});

/** Junta classes condicionalmente e resolve conflitos do Tailwind (a última vence). */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
