import { describe, expect, it } from "vitest";

import links from "@/content/links.json";
import site from "@/content/site.json";

import type { LinkItem, Site } from "./content";
import { resolveLink } from "./links";

const typedSite = site as Site;

describe("página de links", () => {
  it("monta o WhatsApp com o número de site.json e a mensagem do botão", () => {
    const link = resolveLink(
      { type: "whatsapp", label: "Parcerias", message: "Olá, parceria" },
      typedSite,
    );
    expect(link.href).toBe("https://wa.me/5511958522265?text=Ol%C3%A1%2C%20parceria");
    expect(link.icon).toBe("whatsapp");
    expect(link.external).toBe(true);
  });

  it("usa o telefone, o Instagram e o Google de site.json", () => {
    expect(resolveLink({ type: "phone", label: "Ligar" }, typedSite)).toMatchObject({
      href: "tel:+5511958522265",
      text: "(11) 95852-2265",
    });
    expect(resolveLink({ type: "instagram", label: "Instagram" }, typedSite)).toMatchObject({
      href: "https://www.instagram.com/marcenariabutanta",
      text: "@marcenariabutanta",
    });
    expect(resolveLink({ type: "maps", label: "Google" }, typedSite).href).toBe(
      site.contact.googleMaps,
    );
  });

  it("navega dentro do site para páginas internas", () => {
    expect(
      resolveLink(
        { type: "page", icon: "form", label: "Orçamento", path: "/orcamento" },
        typedSite,
      ),
    ).toMatchObject({ href: "/orcamento", internal: true, external: false });
  });

  it("resolve todos os botões de links.json", () => {
    for (const item of links.links as LinkItem[]) {
      expect(resolveLink(item, typedSite).href).toMatch(/^(https:\/\/|tel:|\/)/);
    }
  });
});
