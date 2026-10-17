import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";

import { buttonVariants } from "@/components/ui/button";

// Guia de estilo vivo: documenta tokens e componentes para quem mantém o site.
// Fica fora dos buscadores e não aparece na navegação.
export const metadata: Metadata = {
  title: "Design system",
  robots: { index: false, follow: false },
};

type Token = {
  name: string;
  swatch: string;
  usage: string;
  hex: { dark: string; light: string };
  contrast?: { dark: string; light: string };
};

const tokens: Token[] = [
  {
    name: "canvas",
    swatch: "bg-canvas",
    usage: "Fundo das seções",
    hex: { dark: "#110D0A", light: "#F3EDE4" },
  },
  {
    name: "surface",
    swatch: "bg-surface",
    usage: "Cartões e camadas",
    hex: { dark: "#1A1410", light: "#FBF8F3" },
  },
  {
    name: "ink",
    swatch: "bg-ink",
    usage: "Texto principal",
    hex: { dark: "#F3EDE4", light: "#1A1410" },
    contrast: { dark: "16,6:1", light: "15,7:1" },
  },
  {
    name: "ink-muted",
    swatch: "bg-ink-muted",
    usage: "Texto de apoio",
    hex: { dark: "#B5A797", light: "#5F5246" },
    contrast: { dark: "8,2:1", light: "6,5:1" },
  },
  {
    name: "brand",
    swatch: "bg-brand",
    usage: "Acentos e destaques",
    hex: { dark: "#E3B07E", light: "#8A5A2E" },
    contrast: { dark: "9,9:1", light: "5,0:1" },
  },
  {
    name: "primary",
    swatch: "bg-primary",
    usage: "Botão principal",
    hex: { dark: "#E3B07E", light: "#1A1410" },
  },
];

const typeScale = [
  {
    name: "Display XL",
    spec: "Fraunces Light · 48–104 px",
    className: "font-display text-display-xl font-light",
    sample: "Do projeto à montagem",
  },
  {
    name: "Display",
    spec: "Fraunces Light · 40–76 px",
    className: "font-display text-display font-light",
    sample: "Móveis para cada ambiente",
  },
  {
    name: "Heading",
    spec: "Fraunces Regular · 32–52 px",
    className: "font-display text-heading",
    sample: "Processo claro, resultado sob medida",
  },
  {
    name: "Title",
    spec: "Fraunces Regular · 22–28 px",
    className: "font-display text-title",
    sample: "Projeto bem resolvido",
  },
  {
    name: "Lead",
    spec: "Manrope Regular · 17–20 px",
    className: "text-lead text-ink-muted",
    sample:
      "Móveis planejados em São Paulo com desenho personalizado, execução cuidadosa e acabamento de alto padrão.",
  },
  {
    name: "Body",
    spec: "Manrope Regular · 16 px",
    className: "text-ink-muted",
    sample:
      "Cada ambiente começa com escuta, medidas corretas e soluções pensadas para a rotina de quem vai usar o espaço todos os dias.",
  },
  {
    name: "Eyebrow",
    spec: "Manrope SemiBold · 12 px · caixa alta",
    className: "text-eyebrow font-semibold uppercase text-brand",
    sample: "01 — Planejamento",
  },
];

const principles = [
  {
    title: "Tons do próprio logo",
    text: "Carvalho claro sobre madeira escura: a paleta nasce da marca, não de um template.",
  },
  {
    title: "Tipografia editorial",
    text: "Fraunces nos títulos, com corte óptico para grandes tamanhos; Manrope no texto e na interface.",
  },
  {
    title: "Ritmo claro e escuro",
    text: "Seções alternam de tema com as mesmas classes, guiando a leitura sem pesar.",
  },
  {
    title: "Textura sutil",
    text: "Um grão leve dá sensação de material. É desligado para quem pede alto contraste.",
  },
];

function ArrowIcon() {
  return (
    <ArrowRight
      aria-hidden="true"
      className="size-4 transition-transform duration-500 ease-out-expo group-hover:translate-x-1"
    />
  );
}

function TokenSwatches({ theme }: { theme: "dark" | "light" }) {
  return (
    <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {tokens.map((token) => (
        <li key={token.name} className="overflow-hidden rounded-xl border border-line bg-surface">
          <div className={`h-20 border-b border-line ${token.swatch}`} />
          <div className="space-y-1 p-3">
            <p className="text-sm font-semibold">{token.name}</p>
            <p className="font-mono text-xs text-ink-muted">{token.hex[theme]}</p>
            <p className="text-xs text-ink-muted">{token.usage}</p>
            {token.contrast && (
              <p className="text-xs font-semibold text-brand">
                Contraste {token.contrast[theme]} · AA
              </p>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}

export default function DesignSystemPage() {
  return (
    <>
      <section className="relative overflow-hidden">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-slats" />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-48 right-[-15%] size-[44rem] rounded-full bg-[radial-gradient(closest-side,rgb(227_176_126/0.14),transparent)]"
        />
        <div className="relative container-site pt-40 pb-24 md:pt-48 md:pb-32">
          <p className="text-eyebrow font-semibold text-brand uppercase">
            Guia de estilo · referência interna
          </p>
          <h1 className="mt-8 max-w-5xl font-display text-display-xl font-light">
            Design system da <em className="text-brand">Marcenaria Butantã</em>
          </h1>
          <p className="mt-8 max-w-2xl text-lead text-ink-muted">
            Tokens, tipografia e componentes que dão forma ao site. Consulte antes de criar uma
            página nova para manter tudo consistente.
          </p>
          <div className="mt-12 flex flex-wrap gap-4">
            <a href="#paleta" className={buttonVariants()}>
              Ver paleta de cores
              <ArrowIcon />
            </a>
            <a href="#tipografia" className={buttonVariants({ variant: "secondary" })}>
              Ver tipografia
            </a>
          </div>
        </div>
      </section>

      <section aria-labelledby="principios" className="border-t border-line">
        <div className="container-site py-20">
          <h2 id="principios" className="sr-only">
            Princípios da direção visual
          </h2>
          <dl className="grid gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
            {principles.map((principle, index) => (
              <div key={principle.title} className="border-t border-line-strong pt-6">
                <dt className="font-display text-title">
                  <span className="mr-3 text-sm text-brand tabular-nums">0{index + 1}</span>
                  {principle.title}
                </dt>
                <dd className="mt-3 text-ink-muted">{principle.text}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section id="paleta" aria-labelledby="paleta-titulo" className="border-t border-line">
        <div className="container-site py-24">
          <p className="text-eyebrow font-semibold text-brand uppercase">Design tokens</p>
          <h2 id="paleta-titulo" className="mt-6 font-display text-heading">
            Paleta e tokens semânticos
          </h2>
          <p className="mt-4 max-w-2xl text-ink-muted">
            Os componentes usam nomes semânticos (
            <code className="font-mono whitespace-nowrap">bg-canvas</code>,{" "}
            <code className="font-mono whitespace-nowrap">text-ink</code>…). Basta aplicar{" "}
            <code className="font-mono whitespace-nowrap">theme-light</code> numa seção para que as
            mesmas classes assumam a versão clara.
          </p>
          <div className="mt-14 grid gap-6 lg:grid-cols-2">
            <div className="rounded-2xl border border-line p-6 sm:p-8">
              <h3 className="font-display text-title">Tema escuro · padrão</h3>
              <div className="mt-6">
                <TokenSwatches theme="dark" />
              </div>
            </div>
            <div className="theme-light rounded-2xl p-6 sm:p-8">
              <h3 className="font-display text-title">Tema claro · seções alternadas</h3>
              <div className="mt-6">
                <TokenSwatches theme="light" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="tipografia" aria-labelledby="tipografia-titulo" className="theme-light">
        <div className="container-site py-24">
          <p className="text-eyebrow font-semibold text-brand uppercase">Tipografia</p>
          <h2 id="tipografia-titulo" className="mt-6 font-display text-heading">
            Escala fluida, sem saltos entre telas
          </h2>
          <ol className="mt-14 divide-y divide-line border-y border-line">
            {typeScale.map((style) => (
              <li
                key={style.name}
                className="grid gap-3 py-8 md:grid-cols-[12rem_1fr] md:items-baseline md:gap-10"
              >
                <div>
                  <p className="text-sm font-semibold">{style.name}</p>
                  <p className="text-xs text-ink-muted">{style.spec}</p>
                </div>
                <p className={style.className}>{style.sample}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section aria-labelledby="componentes-titulo" className="border-b border-line">
        <div className="container-site py-24">
          <p className="text-eyebrow font-semibold text-brand uppercase">Interface</p>
          <h2 id="componentes-titulo" className="mt-6 font-display text-heading">
            Componentes e micro-interações
          </h2>
          <p className="mt-4 max-w-2xl text-ink-muted">
            Passe o mouse ou navegue com Tab: todo elemento interativo tem estado de foco visível e
            área de toque de pelo menos 44 px.
          </p>

          <div className="mt-14 grid gap-6 lg:grid-cols-3">
            <div className="flex flex-col items-start gap-5 rounded-2xl border border-line p-8">
              <p className="text-sm font-semibold">Ações</p>
              <a href="#paleta" className={buttonVariants()}>
                Solicitar orçamento
                <ArrowIcon />
              </a>
              <a href="#tipografia" className={buttonVariants({ variant: "secondary" })}>
                Ver projetos
              </a>
              <a
                href="#principios"
                className="group inline-flex min-h-11 items-center text-sm font-semibold text-brand"
              >
                <span className="bg-[linear-gradient(currentColor,currentColor)] bg-[length:0%_1px] bg-left-bottom bg-no-repeat pb-0.5 transition-[background-size] duration-500 ease-out-expo group-hover:bg-[length:100%_1px] group-focus-visible:bg-[length:100%_1px]">
                  Link com sublinhado animado
                </span>
              </a>
            </div>

            <article className="group rounded-2xl border border-line bg-surface p-8 transition duration-500 ease-out-expo hover:-translate-y-1 hover:border-brand/40 hover:shadow-lift">
              <p className="text-eyebrow font-semibold text-brand uppercase">01 — Planejamento</p>
              <h3 className="mt-6 font-display text-title">Projeto personalizado</h3>
              <p className="mt-3 text-ink-muted">
                Entendemos o ambiente, definimos prioridades e organizamos medidas, materiais e
                acabamentos antes da produção.
              </p>
            </article>

            <article className="theme-light group rounded-2xl p-8 transition duration-500 ease-out-expo hover:-translate-y-1 hover:shadow-lift">
              <p className="text-eyebrow font-semibold text-brand uppercase">02 — Detalhamento</p>
              <h3 className="mt-6 font-display text-title">Soluções funcionais</h3>
              <p className="mt-3 text-ink-muted">
                Definimos divisões internas, ferragens, iluminação e pontos de uso para que o móvel
                funcione bem na prática.
              </p>
            </article>
          </div>
        </div>
      </section>
    </>
  );
}
