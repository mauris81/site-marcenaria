import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

// Ponto único de entrada do GSAP. Não importe este módulo de forma estática:
// ele é carregado sob demanda (import()) quando a primeira animação é montada,
// para ficar fora do JavaScript inicial da página (ver use-lazy-gsap.ts).
// Registra os plugins uma vez e define os padrões, para todas as animações do
// site acelerarem e frearem da mesma forma.
gsap.registerPlugin(ScrollTrigger, SplitText);

// "expo.out" é a mesma curva do token --ease-out-expo do CSS.
gsap.defaults({ ease: "expo.out", duration: 1.2 });

export { gsap, ScrollTrigger, SplitText };

export type GsapModule = typeof import("./gsap");
