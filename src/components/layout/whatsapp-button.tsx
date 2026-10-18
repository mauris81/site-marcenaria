import { WhatsAppIcon } from "@/components/icons/brand";

/** Atalho flutuante para o canal que mais converte, presente em todas as páginas. */
export function WhatsAppButton({ href }: { href: string }) {
  return (
    // <aside> dá ao atalho uma região própria para leitores de tela (fora dele,
    // o link ficaria "solto" fora de qualquer landmark da página).
    <aside aria-label="Atalho de contato" className="[view-transition-name:whatsapp-fab]">
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="magnetic group fixed right-4 bottom-[max(1rem,env(safe-area-inset-bottom))] z-40 inline-flex size-14 items-center justify-center rounded-full bg-whatsapp text-white shadow-lift transition duration-500 ease-out-expo hover:-translate-y-1 hover:bg-whatsapp-hover sm:right-6 sm:bottom-6"
      >
        <WhatsAppIcon className="size-7" />
        <span className="sr-only">Fale no WhatsApp (abre em nova aba)</span>
        <span
          aria-hidden="true"
          className="pointer-events-none absolute right-full mr-3 hidden translate-x-2 rounded-full bg-surface px-4 py-2 text-sm font-semibold whitespace-nowrap text-ink opacity-0 shadow-soft ring-1 ring-line transition duration-500 ease-out-expo group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100 sm:block"
        >
          Fale no WhatsApp
        </span>
      </a>
    </aside>
  );
}
