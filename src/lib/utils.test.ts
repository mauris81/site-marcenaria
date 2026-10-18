import { describe, expect, it } from "vitest";

import { cn } from "./utils";
import { whatsappUrl } from "./whatsapp";

describe("cn", () => {
  it("mantém tamanho e cor de texto do design system juntos", () => {
    expect(cn("text-lead", "text-ink-muted")).toBe("text-lead text-ink-muted");
  });

  it("resolve conflitos entre tokens do mesmo tipo (a última vence)", () => {
    expect(cn("text-ink", "text-brand")).toBe("text-brand");
    expect(cn("text-title", "text-heading")).toBe("text-heading");
  });

  it("ignora valores falsos", () => {
    expect(cn("px-4", false, undefined, "py-2")).toBe("px-4 py-2");
  });
});

describe("whatsappUrl", () => {
  it("codifica a mensagem para a URL", () => {
    expect(whatsappUrl("5511994408731", "Olá, vim pelo site")).toBe(
      "https://wa.me/5511994408731?text=Ol%C3%A1%2C%20vim%20pelo%20site",
    );
  });

  it("funciona sem mensagem", () => {
    expect(whatsappUrl("5511994408731")).toBe("https://wa.me/5511994408731");
  });
});
