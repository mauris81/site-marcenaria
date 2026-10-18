"use client";

import { useRef } from "react";

import { gsap, MOTION_OK, useGSAP } from "@/lib/gsap";

type ProcessStepsProps = {
  steps: { label: string; title: string; text: string }[];
};

/**
 * Etapas ligadas por uma linha dourada que se desenha conforme a rolagem.
 * Só a linha (decorativa) acompanha o scroll; o texto aparece uma única vez,
 * então nunca fica escondido mesmo que a rolagem não percorra a seção inteira.
 */
export function ProcessSteps({ steps }: ProcessStepsProps) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const root = ref.current;
      if (!root) return;

      const mm = gsap.matchMedia();
      mm.add({ desktop: "(min-width: 768px)", motion: MOTION_OK }, (context) => {
        const { desktop, motion } = context.conditions as { desktop: boolean; motion: boolean };
        if (!motion) return;

        gsap.from("[data-process-line]", {
          [desktop ? "scaleX" : "scaleY"]: 0,
          ease: "none",
          scrollTrigger: { trigger: root, start: "top 70%", end: "bottom 60%", scrub: 0.6 },
        });
        // `opacity`, e não `autoAlpha`: o texto segue acessível ao leitor de tela
        // mesmo antes de aparecer.
        gsap.from("[data-process-number]", {
          scale: 0.3,
          opacity: 0,
          stagger: 0.15,
          ease: "back.out(2.2)",
          scrollTrigger: { trigger: root, start: "top 80%", once: true },
        });
        gsap.from("[data-process-step]", {
          opacity: 0,
          y: 32,
          stagger: 0.15,
          scrollTrigger: { trigger: root, start: "top 80%", once: true },
        });
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className="relative">
      {/* Trilho (cinza) e progresso (dourado): vertical no celular, horizontal no desktop. */}
      <div
        aria-hidden="true"
        className="absolute top-6 bottom-6 left-6 w-px bg-line-strong md:top-6 md:right-0 md:bottom-auto md:left-0 md:h-px md:w-full"
      />
      <div
        aria-hidden="true"
        data-process-line
        className="absolute top-6 bottom-6 left-6 w-px origin-top bg-brand md:top-6 md:right-0 md:bottom-auto md:left-0 md:h-px md:w-full md:origin-left"
      />
      <ol className="relative grid gap-12 md:grid-cols-3 md:gap-10">
        {steps.map((step, index) => (
          <li key={step.title} data-process-step className="relative pl-20 md:pt-20 md:pl-0">
            <span
              data-process-number
              className="absolute top-0 left-0 grid size-12 place-items-center rounded-full border border-brand bg-canvas font-display text-lg text-brand tabular-nums"
            >
              {String(index + 1).padStart(2, "0")}
            </span>
            <p className="text-eyebrow font-semibold text-ink-muted uppercase">{step.label}</p>
            <h3 className="mt-3 font-display text-title">{step.title}</h3>
            <p className="mt-3 text-ink-muted">{step.text}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}
