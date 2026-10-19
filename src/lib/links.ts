import type { LinkItem, Site } from "@/lib/content";
import { whatsappUrl } from "@/lib/whatsapp";

export type LinkIcon = "form" | "site" | "partners" | "whatsapp" | "instagram" | "maps" | "phone";

export type ResolvedLink = {
  label: string;
  text?: string;
  href: string;
  icon: LinkIcon;
  /** Abre em nova aba (sites e apps de fora). */
  external: boolean;
  /** Página do próprio site: navega com <Link>. */
  internal: boolean;
};

/** Transforma um item de links.json no endereço final, com os contatos de site.json. */
export function resolveLink(link: LinkItem, site: Site): ResolvedLink {
  const base = { label: link.label, text: link.text };
  switch (link.type) {
    case "page":
      return { ...base, href: link.path, icon: link.icon, external: false, internal: true };
    case "url":
      return { ...base, href: link.url, icon: link.icon, external: true, internal: false };
    case "whatsapp":
      return {
        ...base,
        href: whatsappUrl(site.contact.whatsapp, link.message),
        icon: link.icon ?? "whatsapp",
        external: true,
        internal: false,
      };
    case "instagram":
      return {
        ...base,
        text: link.text ?? site.contact.instagram.handle,
        href: site.contact.instagram.url,
        icon: "instagram",
        external: true,
        internal: false,
      };
    case "maps":
      if (!site.contact.googleMaps) throw new Error("site.json: falta contact.googleMaps");
      return {
        ...base,
        href: site.contact.googleMaps,
        icon: "maps",
        external: true,
        internal: false,
      };
    case "phone":
      return {
        ...base,
        text: link.text ?? site.contact.phone,
        href: `tel:+${site.contact.whatsapp}`,
        icon: "phone",
        external: false,
        internal: false,
      };
  }
}
