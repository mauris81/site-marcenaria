"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { clsx } from "clsx";
import { AlertCircle, CheckCircle2, ChevronDown } from "lucide-react";
import { useEffect, useMemo, useState, type ComponentProps, type ReactNode } from "react";
import { useForm } from "react-hook-form";

import { WhatsAppIcon } from "@/components/icons/brand";
import { buttonVariants } from "@/components/ui/button";
import {
  buildQuoteMessage,
  createQuoteSchema,
  formatPhone,
  OTHER_NEIGHBORHOOD,
  type QuoteFormValues,
} from "@/lib/quote";
import { whatsappUrl } from "@/lib/whatsapp";

type QuoteFormProps = {
  title: string;
  neighborhoods: string[];
  projectTypes: string[];
  whatsapp: string;
  privacy: string;
};

type Status = { url: string; blocked: boolean } | null;

const controlClass =
  "min-h-12 w-full rounded-md border border-line-strong bg-canvas px-4 text-base text-ink placeholder:text-ink-muted transition-colors duration-300 hover:border-ink focus:border-brand aria-invalid:border-danger";

/**
 * Pedido de orçamento enviado pelo WhatsApp, com a mensagem já preenchida.
 * Os erros aparecem campo a campo, ao sair de cada um (e todos no envio, com o
 * foco indo para o primeiro); o tipo de projeto chega pré-selecionado quando a
 * pessoa vem de uma página de serviço (?tipo=...).
 */
export function QuoteForm({
  title,
  neighborhoods,
  projectTypes,
  whatsapp,
  privacy,
}: QuoteFormProps) {
  const schema = useMemo(
    () => createQuoteSchema({ neighborhoods, projectTypes }),
    [neighborhoods, projectTypes],
  );
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitted },
  } = useForm<QuoteFormValues>({
    resolver: zodResolver(schema),
    mode: "onTouched",
    defaultValues: { nome: "", telefone: "", email: "", bairro: "", tipo: "", mensagem: "" },
  });
  const [status, setStatus] = useState<Status>(null);

  useEffect(() => {
    const tipo = new URLSearchParams(window.location.search).get("tipo");
    if (tipo && projectTypes.includes(tipo)) setValue("tipo", tipo);
  }, [projectTypes, setValue]);

  const onSubmit = (data: QuoteFormValues) => {
    const url = whatsappUrl(whatsapp, buildQuoteMessage(data));
    const opened = window.open(url, "_blank");
    if (opened) opened.opener = null;
    setStatus({ url, blocked: !opened });
  };

  const errorCount = Object.keys(errors).length;
  const describedBy = (name: keyof QuoteFormValues) => (errors[name] ? `${name}-erro` : undefined);

  return (
    <form
      noValidate
      onSubmit={handleSubmit(onSubmit)}
      aria-labelledby="formulario-titulo"
      className="rounded-2xl border border-line bg-surface p-6 sm:p-10"
    >
      <h2 id="formulario-titulo" className="font-display text-heading">
        {title}
      </h2>
      <p className="mt-3 text-sm text-ink-muted">
        Campos com <span className="text-brand">*</span> são obrigatórios.
      </p>

      {isSubmitted && errorCount > 0 && (
        <p
          role="alert"
          className="mt-6 flex items-center gap-2 rounded-md border border-danger/50 px-4 py-3 text-sm text-danger"
        >
          <AlertCircle aria-hidden="true" className="size-4 shrink-0" />
          Revise {errorCount === 1
            ? "o campo destacado"
            : `os ${errorCount} campos destacados`}{" "}
          para continuar.
        </p>
      )}

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <Field id="nome" label="Nome" required error={errors.nome?.message}>
          <input
            id="nome"
            type="text"
            autoComplete="name"
            placeholder="Seu nome completo"
            aria-invalid={!!errors.nome}
            aria-describedby={describedBy("nome")}
            className={controlClass}
            {...register("nome")}
          />
        </Field>

        <Field id="telefone" label="Telefone (WhatsApp)" required error={errors.telefone?.message}>
          <input
            id="telefone"
            type="tel"
            inputMode="tel"
            autoComplete="tel-national"
            placeholder="(11) 99999-9999"
            aria-invalid={!!errors.telefone}
            aria-describedby={describedBy("telefone")}
            className={controlClass}
            {...register("telefone", {
              onChange: (event) => {
                event.target.value = formatPhone(event.target.value);
              },
            })}
          />
        </Field>

        <Field id="email" label="E-mail" error={errors.email?.message}>
          <input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="seu.email@exemplo.com"
            aria-invalid={!!errors.email}
            aria-describedby={describedBy("email")}
            className={controlClass}
            {...register("email")}
          />
        </Field>

        <Field id="bairro" label="Bairro" required error={errors.bairro?.message}>
          <Select
            id="bairro"
            invalid={!!errors.bairro}
            describedBy={describedBy("bairro")}
            {...register("bairro")}
          >
            <option value="">Selecione seu bairro</option>
            {neighborhoods.map((neighborhood) => (
              <option key={neighborhood} value={neighborhood}>
                {neighborhood}
              </option>
            ))}
            <option value={OTHER_NEIGHBORHOOD}>{OTHER_NEIGHBORHOOD}</option>
          </Select>
        </Field>

        <div className="md:col-span-2">
          <Field id="tipo" label="Tipo de projeto" required error={errors.tipo?.message}>
            <Select
              id="tipo"
              invalid={!!errors.tipo}
              describedBy={describedBy("tipo")}
              {...register("tipo")}
            >
              <option value="">Selecione o tipo de projeto</option>
              {projectTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </Select>
          </Field>
        </div>

        <div className="md:col-span-2">
          <Field id="mensagem" label="Conte mais sobre o projeto" error={errors.mensagem?.message}>
            <textarea
              id="mensagem"
              rows={5}
              placeholder="Descreva o ambiente, medidas aproximadas, referências, materiais ou cores que você imagina."
              aria-invalid={!!errors.mensagem}
              aria-describedby={describedBy("mensagem")}
              className={clsx(controlClass, "resize-y py-3")}
              {...register("mensagem")}
            />
          </Field>
        </div>
      </div>

      <button
        type="submit"
        className={clsx(
          buttonVariants({ variant: "whatsapp", size: "lg" }),
          "mt-8 w-full sm:w-auto",
        )}
      >
        <WhatsAppIcon className="size-5" />
        Enviar pelo WhatsApp
      </button>

      <div role="status" aria-live="polite">
        {status && (
          <p className="mt-6 flex items-start gap-2 rounded-md border border-line-strong px-4 py-3 text-sm text-ink">
            <CheckCircle2 aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-brand" />
            <span>
              {status.blocked
                ? "O navegador bloqueou a nova aba. "
                : "Pronto! Abrimos o WhatsApp com a sua mensagem preenchida. "}
              <a
                href={status.url}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-brand underline underline-offset-4"
              >
                {status.blocked ? "Abrir o WhatsApp" : "Não abriu? Abrir de novo"}
              </a>
            </span>
          </p>
        )}
      </div>

      <p className="mt-6 text-xs text-ink-muted">{privacy}</p>
    </form>
  );
}

function Field({
  id,
  label,
  required,
  error,
  children,
}: {
  id: string;
  label: string;
  required?: boolean;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-sm font-semibold">
        {label}
        {required && (
          <span aria-hidden="true" className="text-brand">
            {" "}
            *
          </span>
        )}
      </label>
      {children}
      {error && (
        <p id={`${id}-erro`} className="flex items-center gap-1.5 text-sm text-danger">
          <AlertCircle aria-hidden="true" className="size-4 shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
}

function Select({
  invalid,
  describedBy,
  children,
  ...props
}: ComponentProps<"select"> & { invalid: boolean; describedBy?: string }) {
  return (
    <div className="relative">
      <select
        aria-invalid={invalid}
        aria-describedby={describedBy}
        className={clsx(controlClass, "cursor-pointer appearance-none pr-12")}
        {...props}
      >
        {children}
      </select>
      <ChevronDown
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 right-4 size-4 -translate-y-1/2 text-brand"
      />
    </div>
  );
}
