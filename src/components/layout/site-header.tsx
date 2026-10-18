"use client";

import type { Route } from "next";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSyncExternalStore } from "react";

import { Logo } from "@/components/brand/logo";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { MobileMenu } from "./mobile-menu";

export type NavItem = { label: string; href: Route };

type SiteHeaderProps = {
  nav: NavItem[];
  whatsappHref: string;
  instagramHref: string;
};

// Estado de rolagem lido direto do navegador via useSyncExternalStore:
// sem efeitos nem re-renderizações a cada pixel, só quando cruza o limite.
function subscribe(onChange: () => void) {
  window.addEventListener("scroll", onChange, { passive: true });
  return () => window.removeEventListener("scroll", onChange);
}
const getScrolled = () => window.scrollY > 24;
const getServerScrolled = () => false;

export function SiteHeader({ nav, whatsappHref, instagramHref }: SiteHeaderProps) {
  const pathname = usePathname();
  const scrolled = useSyncExternalStore(subscribe, getScrolled, getServerScrolled);

  return (
    // Altura fixa: ao rolar, só fundo e borda mudam — nada de layout pulando.
    <header
      data-scrolled={scrolled || undefined}
      className="fixed inset-x-0 top-0 z-50 border-b border-transparent transition-[background-color,border-color,backdrop-filter] duration-500 ease-out-expo [view-transition-name:site-header] data-scrolled:border-line data-scrolled:bg-canvas/92 data-scrolled:backdrop-blur-xl"
    >
      <div className="container-site flex h-20 items-center justify-between gap-6">
        <Logo />

        <nav aria-label="Principal" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={pathname === item.href ? "page" : undefined}
                  className="relative inline-flex min-h-11 items-center px-4 text-sm font-medium text-ink-muted transition-colors duration-300 after:absolute after:inset-x-4 after:bottom-2 after:h-px after:origin-left after:scale-x-0 after:bg-brand after:transition-transform after:duration-500 after:ease-out-expo hover:text-ink hover:after:scale-x-100 aria-[current=page]:text-ink aria-[current=page]:after:scale-x-100"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/orcamento"
            className={cn(buttonVariants({ size: "sm" }), "hidden sm:inline-flex")}
          >
            Solicitar orçamento
          </Link>
          <MobileMenu nav={nav} whatsappHref={whatsappHref} instagramHref={instagramHref} />
        </div>
      </div>
    </header>
  );
}
