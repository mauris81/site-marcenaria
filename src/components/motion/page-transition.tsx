import { ViewTransition, type ReactNode } from "react";

/**
 * Transição entre páginas com a View Transitions API do navegador (via React):
 * a página antiga sai desfocando e a nova entra subindo. Vai em cada page.tsx,
 * não no layout — layouts persistem entre navegações, então não "entram" nem "saem".
 * Sem suporte no navegador, a troca acontece normalmente, só que sem animação.
 */
export function PageTransition({ children }: { children: ReactNode }) {
  return (
    <ViewTransition enter="page-enter" exit="page-exit" default="none">
      {children}
    </ViewTransition>
  );
}
