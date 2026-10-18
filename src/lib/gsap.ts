import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

// Ponto único de entrada do GSAP (importe só em Client Components). Registra os
// plugins uma vez e define os padrões, para todas as animações do site
// acelerarem e frearem da mesma forma.
gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);

// "expo.out" é a mesma curva do token --ease-out-expo do CSS.
gsap.defaults({ ease: "expo.out", duration: 1.2 });

/** Condição para animar: só para quem não pediu "reduzir movimento" no sistema. */
export const MOTION_OK = "(prefers-reduced-motion: no-preference)";

export { gsap, ScrollTrigger, SplitText, useGSAP };
