// Condições de movimento, sem depender do GSAP: os componentes importam estas
// constantes direto, e o GSAP em si só é baixado quando a primeira animação é
// montada (ver components/motion/use-lazy-gsap.ts).

/** Condição para animar: só para quem não pediu "reduzir movimento" no sistema. */
export const MOTION_OK = "(prefers-reduced-motion: no-preference)";

/** Só em computador (mouse/touchpad) e sem "reduzir movimento". */
export const POINTER_OK = `${MOTION_OK} and (hover: hover) and (pointer: fine)`;
