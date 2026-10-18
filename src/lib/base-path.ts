// Prefixo das URLs quando o site é publicado num subcaminho — no GitHub Pages
// de projeto, /site-marcenaria. Vem de NEXT_PUBLIC_BASE_PATH (definido no
// workflow de publicação) e fica vazio no desenvolvimento local.
//
// O next/link, o roteador e os arquivos do próprio Next já aplicam o prefixo
// sozinhos; isto cobre só os caminhos escritos à mão (fotos e logo).
export const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function withBasePath(path: `/${string}`) {
  return `${basePath}${path}`;
}
