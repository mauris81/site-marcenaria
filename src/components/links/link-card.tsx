import {
  ArrowUpRight,
  ClipboardList,
  Globe,
  Handshake,
  MapPin,
  Phone,
  type LucideIcon,
} from "lucide-react";
import type { Route } from "next";
import Link from "next/link";
import type { ComponentType, SVGProps } from "react";

import { InstagramIcon, WhatsAppIcon } from "@/components/icons/brand";
import type { LinkIcon, ResolvedLink } from "@/lib/links";

const icons: Record<LinkIcon, LucideIcon | ComponentType<SVGProps<SVGSVGElement>>> = {
  form: ClipboardList,
  site: Globe,
  partners: Handshake,
  whatsapp: WhatsAppIcon,
  instagram: InstagramIcon,
  maps: MapPin,
  phone: Phone,
};

export function LinkIconGlyph({ icon, className }: { icon: LinkIcon; className?: string }) {
  const Icon = icons[icon];
  return <Icon aria-hidden="true" className={className} />;
}

type LinkCardProps = { link: ResolvedLink };

/** Um botão da lista: ícone, título, linha de apoio e a seta de saída. */
export function LinkCard({ link }: LinkCardProps) {
  const className =
    "group flex min-h-[4.5rem] items-center gap-4 rounded-2xl border border-line bg-surface/80 p-3 pr-5 backdrop-blur-sm transition duration-500 ease-out-expo hover:-translate-y-0.5 hover:border-brand/50 hover:shadow-lift focus-visible:border-brand/50";

  const content = (
    <>
      <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-brand/10 text-brand ring-1 ring-brand/15 transition-colors duration-500 group-hover:bg-brand/15">
        <LinkIconGlyph icon={link.icon} className="size-5" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block font-semibold text-ink">{link.label}</span>
        {link.text ? (
          <span className="mt-0.5 line-clamp-2 block text-sm text-ink-muted">{link.text}</span>
        ) : null}
      </span>
      <ArrowUpRight
        aria-hidden="true"
        className="size-5 shrink-0 text-ink-muted transition duration-500 ease-out-expo group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-brand"
      />
    </>
  );

  if (link.internal) {
    return (
      <Link href={link.href as Route} className={className}>
        {content}
      </Link>
    );
  }

  return (
    <a
      href={link.href}
      className={className}

      {...(link.external && { target: "_blank", rel: "noopener noreferrer" })}
    >
      {content}
      {link.external ? <span className="sr-only"> (abre em nova aba)</span> : null}
    </a>
  );
}
