"use client";

import { Check, Share2 } from "lucide-react";
import { useState } from "react";

type ShareButtonProps = { url: string; title: string; text: string };

/**
 * Compartilha a página pelo menu nativo do celular (WhatsApp, Instagram...).
 * Sem esse menu (a maioria dos navegadores de computador), copia o link.
 */
export function ShareButton({ url, title, text }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  async function share() {
    if (navigator.share) {
      try {
        await navigator.share({ url, title, text });
      } catch {
        // A pessoa fechou o menu de compartilhamento: nada a fazer.
      }
      return;
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      window.prompt("Copie o link:", url);
    }
  }

  return (
    <button
      type="button"
      onClick={share}
      className="inline-flex min-h-11 items-center gap-2 rounded-full border border-line px-5 text-sm font-semibold text-ink-muted transition duration-300 hover:border-line-strong hover:text-ink"
    >
      {copied ? (
        <Check aria-hidden="true" className="size-4 text-brand" />
      ) : (
        <Share2 aria-hidden="true" className="size-4" />
      )}
      <span aria-live="polite">{copied ? "Link copiado" : "Compartilhar esta página"}</span>
    </button>
  );
}
