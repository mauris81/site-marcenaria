# Site Marcenaria Butantã

Site institucional multipágina da **Marcenaria Butantã**, marcenaria de móveis planejados em São Paulo. Em produção em [marcenariabutanta.com.br](https://www.marcenariabutanta.com.br).

![Next.js](https://img.shields.io/badge/Next.js-000000?style=flat-square&logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=flat-square&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)
![GSAP](https://img.shields.io/badge/GSAP-0AE448?style=flat-square&logo=greensock&logoColor=black)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=flat-square&logo=vercel&logoColor=white)

Site estático (SSG) em Next.js. Cada página vira um HTML pronto no build e é
publicada pela Vercel, sem servidor. O pedido de orçamento abre o WhatsApp com
a mensagem já preenchida. Conteúdo em JSON validado no build, fotos otimizadas
automaticamente e animações na rolagem, com atenção a acessibilidade e SEO.

**Stack:** Next.js 16 (App Router, export estático) · React 19 · TypeScript ·
Tailwind CSS 4 · GSAP + ScrollTrigger e Lenis (animações) · React Hook Form +
Zod (formulário e validação do conteúdo) · sharp (imagens) · Vitest (testes).

## Como rodar

Requisito: Node 24 (versão em `.nvmrc`).

```bash
npm install
npm run dev        # http://localhost:3000
```

Build de produção e prévia local:

```bash
npm run build      # gera o site em out/
npm run preview    # serve out/ em http://localhost:3000
```

| Comando            | O que faz                                                                        |
| ------------------ | -------------------------------------------------------------------------------- |
| `npm run dev`      | Servidor de desenvolvimento (gera as versões das fotos antes)                    |
| `npm run build`    | Otimiza as fotos, gera as imagens de compartilhamento e exporta o site em `out/` |
| `npm run preview`  | Serve o `out/` localmente                                                        |
| `npm run images`   | Versões WebP das fotos em `public/images/` e `src/content/photos.generated.json` |
| `npm run og`       | Imagens de compartilhamento em `public/og/`                                      |
| `npm run textures` | Texturas de madeira das cenas em `src/assets/textures/` (versionadas)            |
| `npm run check`    | Lint, tipos, testes e formatação (o mesmo que o CI roda)                         |
| `npm run test`     | Testes (Vitest); `npm run test:watch` para o modo contínuo                       |
| `npm run format`   | Formata o código com Prettier                                                    |

## Estrutura

```
src/
  app/              Páginas (App Router): home, [slug] (serviços), orcamento,
                    sitemap.ts e robots.ts
  components/       layout, sections, showcase (cenas 3D), gallery, quote,
                    motion, ui, seo
  content/          Conteúdo do site em JSON (textos, serviços, fotos)
  lib/              Carregamento e validação do conteúdo, SEO, formulário, GSAP
  assets/           Monograma do logo e texturas de madeira das cenas (geradas por
                    scripts/generate-textures.mjs), importados pelo código
scripts/            Otimização das fotos, imagens de compartilhamento, texturas, ajuste do export
assets/photos/      Fotos originais do site (fonte das versões otimizadas)
assets/brand/       Logo original
public/             Gerado no build: fotos otimizadas (images/) e de compartilhamento (og/)
.github/workflows/  Verificação automática (lint, tipos, testes e build)
vercel.json         Publicação na Vercel e cache (um ano para /_next/static e /images)
```

## Conteúdo

Todo texto e toda foto vêm de `src/content/`. Os arquivos são validados no
build (Zod, em `src/lib/content/schemas.ts`). Uma chave digitada errado, um
título longo demais para o Google ou uma foto inexistente param o build, com
uma mensagem que aponta o arquivo e o campo.

| Arquivo                 | Conteúdo                                                                 |
| ----------------------- | ------------------------------------------------------------------------ |
| `site.json`             | Nome, URL de produção, WhatsApp, telefone, Instagram e bairros atendidos |
| `home.json`             | Textos da página inicial                                                 |
| `services.json`         | Um item por serviço: vira página, entra no menu, no rodapé e no sitemap  |
| `quote.json`            | Página de orçamento: textos, tipos de projeto e etapas                   |
| `photos.json`           | Catálogo de fotos: id, arquivo, texto alternativo e enquadramento        |
| `photos.generated.json` | Gerado por `npm run images` (dimensões e placeholder); versionado        |

Trechos de texto entre `*asteriscos*` aparecem em itálico, na cor da marca.

### Adicionar uma foto

1. Copie o arquivo para `assets/photos/` (JPG, PNG ou WebP).
2. Cadastre a foto em `src/content/photos.json`:

   ```json
   {
     "id": "cozinha-ilha-nova",
     "file": "assets/photos/cozinha-ilha-nova.jpg",
     "alt": "Cozinha com ilha central e bancada em pedra"
   }
   ```

   - `id`: letras minúsculas, números e hífens (vira o nome dos arquivos gerados).
   - `alt`: o que aparece na foto. É lido por leitores de tela e pelo Google.
   - Opcionais: `"position": "50% 70%"` (ponto focal ao recortar) e
     `"trim": true` (remove tarjas pretas, como em capturas de tela).

3. Use o `id` onde quiser: na galeria de um serviço
   (`services.json › gallery.items`), numa cena (`showcase.photos`) ou num
   hero (`hero.photo`).
4. Rode `npm run dev` ou `npm run images` para gerar as versões otimizadas e
   inclua `photos.generated.json` no commit.

A pasta `Fotos/` guarda arquivos pessoais e é ignorada pelo Git. As fotos do
site ficam só em `assets/photos/`.

### Adicionar um serviço

Um novo item em `services.json` cria a página `/<slug>` e o coloca no menu, no
rodapé e no sitemap. Use um serviço existente como modelo. O `quoteType` precisa
estar em `quote.json › form.projectTypes`: é o tipo de projeto que o formulário
de orçamento já traz selecionado quando a pessoa vem dessa página.

### Imagem de compartilhamento

Cada página tem uma prévia de 1200×630 (WhatsApp, Instagram, Facebook,
LinkedIn), gerada no build com a foto do hero. Para usar outra foto, defina
`seo.ogPhoto` (e, se quiser, `seo.ogPhotoPosition`) no JSON da página.

## Animações e acessibilidade

- Quem ativa "reduzir movimento" no sistema vê o conteúdo direto, sem as
  animações de rolagem.
- O conteúdo revelado na rolagem continua acessível a leitor de tela e
  teclado: as animações mexem em `opacity`, nunca em `visibility`, e o foco do
  teclado revela o item na hora.
- Regra do GSAP: não anime um elemento que tenha `transition` CSS em opacity
  ou transform; envolva-o num `<div>` (veja o comentário em `Reveal`).
- A página `/design-system` (fora do Google) reúne princípios, paleta,
  tipografia e componentes.

## SEO

Gerado a partir do conteúdo, no build:

- título, descrição e URL canônica de cada página;
- Open Graph e cartão do X com a imagem de compartilhamento;
- dados estruturados (schema.org): empresa (`HomeAndConstructionBusiness`),
  site, serviços e trilha de navegação, só com fatos que estão no conteúdo;
- `/sitemap.xml`, com as fotos do portfólio, e `/robots.txt`.

Depois de publicar, envie o sitemap no Google Search Console:
`https://www.marcenariabutanta.com.br/sitemap.xml`.

## Publicação (Vercel)

A Vercel está ligada a este repositório:

- push na `main` → publica em produção, em
  [www.marcenariabutanta.com.br](https://www.marcenariabutanta.com.br);
- push em qualquer outro ramo → gera uma prévia (só abre para quem tem acesso
  ao projeto na Vercel).

O `vercel.json` fixa como o site é publicado, independente do painel: roda
`npm run build` e serve a pasta `out`. Com `cleanUrls`, `/cozinhas-planejadas`
abre a página, e os endereços antigos com `.html` redirecionam (308) para os
novos, preservando links e posição no Google.

Fluxo de trabalho: desenvolva num ramo, confira a prévia da Vercel e faça o
merge na `main` para publicar. O workflow `.github/workflows/site.yml` roda as
verificações em pull requests e na `main`.

## Qualidade

`npm run check` roda lint, verificação de tipos, testes e formatação, as mesmas
etapas do CI. Os testes cobrem a validação do conteúdo, o formulário de
orçamento (máscara do telefone, mensagens de erro e mensagem do WhatsApp), os
metadados e os dados estruturados.

## Autor

Desenvolvido por [Maurício Magri](https://github.com/mauris81), do layout à publicação.
