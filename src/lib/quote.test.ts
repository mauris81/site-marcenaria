import { describe, expect, it } from "vitest";

import { buildQuoteMessage, createQuoteSchema, formatPhone, OTHER_NEIGHBORHOOD } from "./quote";

const schema = createQuoteSchema({
  neighborhoods: ["Butantã", "Pinheiros"],
  projectTypes: ["Cozinha planejada", "Home office"],
});

const valid = {
  nome: "Ana Souza",
  telefone: "(11) 91234-5678",
  email: "",
  bairro: "Butantã",
  tipo: "Cozinha planejada",
  mensagem: "",
};

describe("formatPhone", () => {
  it("formata celular com 9 dígitos (bug do site antigo: (11) 9585-22265)", () => {
    expect(formatPhone("11912345678")).toBe("(11) 91234-5678");
  });

  it("formata telefone fixo com 8 dígitos", () => {
    expect(formatPhone("1140028922")).toBe("(11) 4002-8922");
  });

  it("formata enquanto a pessoa digita e ignora o que não é número", () => {
    expect(formatPhone("1")).toBe("(1");
    expect(formatPhone("1199")).toBe("(11) 99");
    expect(formatPhone("11 9 1234-5678")).toBe("(11) 91234-5678");
  });

  it("limita a 11 dígitos", () => {
    expect(formatPhone("119123456789999")).toBe("(11) 91234-5678");
  });
});

describe("schema do orçamento", () => {
  it("aceita um pedido completo", () => {
    expect(schema.safeParse(valid).success).toBe(true);
  });

  it("aceita bairro fora da lista como 'Outro bairro'", () => {
    expect(schema.safeParse({ ...valid, bairro: OTHER_NEIGHBORHOOD }).success).toBe(true);
  });

  it("tira os espaços das pontas do nome e da mensagem", () => {
    const result = schema.safeParse({
      ...valid,
      nome: "  Ana Souza ",
      mensagem: " Cozinha em L  ",
    });
    expect(result.data).toMatchObject({ nome: "Ana Souza", mensagem: "Cozinha em L" });
  });

  it("limita a mensagem a 1.000 caracteres", () => {
    expect(schema.safeParse({ ...valid, mensagem: "a".repeat(1000) }).success).toBe(true);
    const result = schema.safeParse({ ...valid, mensagem: "a".repeat(1001) });
    expect(result.error?.issues.map((issue) => issue.message)).toEqual([
      "Use até 1.000 caracteres.",
    ]);
  });

  it("explica cada campo inválido em linguagem clara", () => {
    const result = schema.safeParse({
      ...valid,
      nome: " ",
      telefone: "1234",
      email: "ana@",
      bairro: "",
      tipo: "",
    });
    expect(result.success).toBe(false);
    const messages = Object.fromEntries(
      (result.error?.issues ?? []).map((issue) => [issue.path[0], issue.message]),
    );
    expect(messages).toMatchObject({
      nome: "Informe seu nome.",
      telefone: expect.stringContaining("DDD"),
      email: expect.stringContaining("e-mail"),
      bairro: "Selecione o bairro.",
      tipo: "Selecione o tipo de projeto.",
    });
  });
});

describe("buildQuoteMessage", () => {
  it("inclui o e-mail quando informado (o site antigo o descartava)", () => {
    const message = buildQuoteMessage({ ...valid, email: "ana@exemplo.com" });
    expect(message).toContain("E-mail: ana@exemplo.com");
  });

  it("omite a linha de e-mail quando vazio e usa texto padrão sem mensagem", () => {
    const message = buildQuoteMessage(valid);
    expect(message).not.toContain("E-mail");
    expect(message).toContain("Mensagem: Sem mensagem adicional");
    expect(message).toContain("Tipo de projeto: Cozinha planejada");
  });
});
