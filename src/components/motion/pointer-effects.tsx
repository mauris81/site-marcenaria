"use client";

import { useEffect, useRef } from "react";

import { gsap } from "@/lib/gsap";

import { POINTER_OK } from "./pointer-depth";

type Mover = { x: (value: number) => void; y: (value: number) => void };

/**
 * Efeitos de cursor para o site todo, com um único par de "ouvintes":
 * - botões com a classe `magnetic` puxam levemente o cursor quando ele chega perto;
 * - uma luz quente e sutil acompanha o cursor sobre a textura de madeira.
 * Só em computador e sem "reduzir movimento"; no toque, nada disso existe.
 */
export function PointerEffects() {
  const lightRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const light = lightRef.current;
    const media = window.matchMedia(POINTER_OK);
    if (!light || !media.matches) return;

    const movers = new WeakMap<HTMLElement, Mover>();
    const moverFor = (element: HTMLElement) => {
      let mover = movers.get(element);
      if (!mover) {
        mover = {
          x: gsap.quickTo(element, "x", { duration: 0.6, ease: "power3.out" }),
          y: gsap.quickTo(element, "y", { duration: 0.6, ease: "power3.out" }),
        };
        movers.set(element, mover);
      }
      return mover;
    };

    let active: HTMLElement | null = null;
    let frame = 0;
    let pointer = { x: -9999, y: -9999 };

    const release = (element: HTMLElement | null) => {
      if (!element) return;
      const mover = moverFor(element);
      mover.x(0);
      mover.y(0);
    };

    const onMove = (event: PointerEvent) => {
      pointer = { x: event.clientX, y: event.clientY };
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        light.style.setProperty("--x", `${pointer.x}px`);
        light.style.setProperty("--y", `${pointer.y}px`);
      });

      const target = (event.target as Element | null)?.closest<HTMLElement>(".magnetic") ?? null;
      if (target !== active) {
        release(active);
        active = target;
      }
      if (!target) return;
      const box = target.getBoundingClientRect();
      const mover = moverFor(target);
      mover.x((event.clientX - (box.left + box.width / 2)) * 0.28);
      mover.y((event.clientY - (box.top + box.height / 2)) * 0.35);
    };
    const onLeaveWindow = () => {
      release(active);
      active = null;
      light.style.setProperty("--x", "-9999px");
    };

    light.hidden = false;
    document.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeaveWindow);
    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeaveWindow);
    };
  }, []);

  return (
    <div
      ref={lightRef}
      hidden
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-30 bg-[radial-gradient(600px_circle_at_var(--x,-9999px)_var(--y,-9999px),rgb(255_196_130/0.07),transparent_70%)]"
    />
  );
}
