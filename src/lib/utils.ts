import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

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
        "whatsapp",
        "whatsapp-hover",
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
