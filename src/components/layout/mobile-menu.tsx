"use client";

import { ArrowUpRight, Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { Logo } from "@/components/brand/logo";
import { InstagramIcon, WhatsAppIcon } from "@/components/icons/brand";
import { buttonVariants } from "@/components/ui/button";

import type { NavItem } from "./site-header";

type MobileMenuProps = {
  nav: NavItem[];
  whatsappHref: string;
  instagramHref: string;
};

// Menu em <dialog> nativo aberto com showModal(): o navegador cuida do que é
// difícil acertar à mão — foco preso dentro do menu, fechar com Esc, resto da
// página inerte para leitores de tela e foco devolvido ao botão ao fechar.
export function MobileMenu({ nav, whatsappHref, instagramHref }: MobileMenuProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const show = () => {
    dialogRef.current?.showModal();
    setOpen(true);
  };
  const close = () => dialogRef.current?.close();

  // Fecha se a rota mudar por outro caminho (ex.: botão voltar do navegador).
  useEffect(() => {
    dialogRef.current?.close();
  }, [pathname]);

  const links: NavItem[] = [
    { label: "Início", href: "/" },
    ...nav,
    { label: "Orçamento", href: "/orcamento" },
  ];

  return (
    <>
      <button
        type="button"
        onClick={show}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls="menu-principal"
        className="inline-flex size-11 items-center justify-center rounded-full border border-line-strong text-ink transition duration-300 hover:bg-ink/5 lg:hidden"
      >
        <Menu aria-hidden="true" className="size-5" />
        <span className="sr-only">Abrir menu</span>
      </button>

      <dialog
        id="menu-principal"
        ref={dialogRef}
        aria-label="Menu"
        onClose={() => setOpen(false)}
        className="m-0 h-dvh max-h-none w-full max-w-none -translate-y-3 bg-canvas p-0 text-ink opacity-0 transition-all transition-discrete duration-500 ease-out-expo backdrop:bg-transparent open:translate-y-0 open:opacity-100 starting:open:-translate-y-3 starting:open:opacity-0"
      >
        <div className="container-site flex min-h-full flex-col">
          <div className="flex h-20 items-center justify-between">
            <Logo onClick={close} />
            <button
              type="button"
              onClick={close}
              className="inline-flex size-11 items-center justify-center rounded-full border border-line-strong transition duration-300 hover:bg-ink/5"
            >
              <X aria-hidden="true" className="size-5" />
              <span className="sr-only">Fechar menu</span>
            </button>
          </div>

          <nav aria-label="Menu principal" className="mt-6 flex-1">
            <ul className="divide-y divide-line border-y border-line">
              {links.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={close}
                    aria-current={pathname === item.href ? "page" : undefined}
                    className="group flex min-h-16 items-center justify-between gap-4 py-3 font-display text-title transition-colors duration-300 hover:text-brand aria-[current=page]:text-brand"
                  >
                    {item.label}
                    <ArrowUpRight
                      aria-hidden="true"
                      className="size-5 text-ink-muted transition-transform duration-500 ease-out-expo group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="grid gap-3 py-8 pb-[max(2rem,env(safe-area-inset-bottom))]">
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className={buttonVariants({ variant: "whatsapp", size: "lg" })}
            >
              <WhatsAppIcon className="size-5" />
              Conversar no WhatsApp
            </a>
            <a
              href={instagramHref}
              target="_blank"
              rel="noopener noreferrer"
              className={buttonVariants({ variant: "secondary", size: "lg" })}
            >
              <InstagramIcon className="size-5" />
              Ver no Instagram
            </a>
          </div>
        </div>
      </dialog>
    </>
  );
}
