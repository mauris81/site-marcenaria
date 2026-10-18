import * as z from "zod/mini";

// Regras do formulário de orçamento, separadas da interface: o mesmo schema
// valida no navegador e é coberto por testes (quote.test.ts). Usa o Zod Mini,
// a versão do Zod feita para o navegador: as mesmas regras com um quarto do
// tamanho (cerca de 22 KB em vez de 88 KB de JavaScript).

export const OTHER_NEIGHBORHOOD = "Outro bairro";

export function onlyDigits(value: string) {
  return value.replace(/\D/g, "");
}

/**
 * Máscara de telefone brasileiro enquanto a pessoa digita:
 * (11) 91234-5678 para celular (11 dígitos) e (11) 4002-8922 para fixo (10).
 */
export function formatPhone(value: string) {
  const digits = onlyDigits(value).slice(0, 11);
  if (digits.length === 0) return "";
  if (digits.length <= 2) return `(${digits}`;
  const ddd = digits.slice(0, 2);
  const number = digits.slice(2);
  const split = digits.length === 11 ? 5 : 4;
  if (number.length <= split) return `(${ddd}) ${number}`;
  return `(${ddd}) ${number.slice(0, split)}-${number.slice(split)}`;
}

export function createQuoteSchema(options: { neighborhoods: string[]; projectTypes: string[] }) {
  const neighborhoods = [...options.neighborhoods, OTHER_NEIGHBORHOOD];
  return z.object({
    nome: z.string().check(z.trim(), z.minLength(2, "Informe seu nome.")),
    telefone: z
      .string()
      .check(
        z.refine(
          (value) => /^\d{10,11}$/.test(onlyDigits(value)),
          "Informe um telefone com DDD, como (11) 91234-5678.",
        ),
      ),
    email: z.union([z.literal(""), z.email("Confira o e-mail, por exemplo: nome@exemplo.com.")]),
    bairro: z
      .string()
      .check(z.refine((value) => neighborhoods.includes(value), "Selecione o bairro.")),
    tipo: z
      .string()
      .check(
        z.refine((value) => options.projectTypes.includes(value), "Selecione o tipo de projeto."),
      ),
    mensagem: z.string().check(z.trim(), z.maxLength(1000, "Use até 1.000 caracteres.")),
  });
}

export type QuoteFormValues = z.infer<ReturnType<typeof createQuoteSchema>>;

/** Mensagem que chega pronta no WhatsApp — com todos os dados preenchidos, inclusive e-mail. */
export function buildQuoteMessage(data: QuoteFormValues) {
  return [
    "Olá! Vim pelo site e gostaria de solicitar um orçamento.",
    "",
    `Nome: ${data.nome}`,
    `Telefone: ${data.telefone}`,
    data.email ? `E-mail: ${data.email}` : null,
    `Bairro: ${data.bairro}`,
    `Tipo de projeto: ${data.tipo}`,
    "",
    `Mensagem: ${data.mensagem || "Sem mensagem adicional"}`,
  ]
    .filter((line) => line !== null)
    .join("\n");
}
