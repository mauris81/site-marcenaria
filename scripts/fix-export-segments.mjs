// Contorna um bug do `output: "export"` do Next.js 16.4 no Windows.
//
// O exportador monta o nome dos arquivos de pré-carregamento (prefetch) a partir
// de `path.relative`, que no Windows usa "\" — e só troca "/" por ".". Resultado:
// grava `orcamento/__next.orcamento/__PAGE__.txt`, enquanto o navegador pede
// `orcamento/__next.orcamento.__PAGE__.txt` (404 e prefetch perdido).
//
// Este script achata essas pastas para o nome que o cliente espera. Em Linux/macOS
// (e no build de CI) o bug não ocorre, nada é encontrado e o script não faz nada.
// Pode ser removido quando o Next corrigir `collectSegmentPaths` em export/index.js.

import { readdir, rename, rm } from "node:fs/promises";
import { join, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";

const outDir = fileURLToPath(new URL("../out/", import.meta.url));

async function filesIn(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(
    entries.map((entry) => {
      const path = join(directory, entry.name);
      return entry.isDirectory() ? filesIn(path) : [path];
    }),
  );
  return nested.flat();
}

async function flattenSegmentDirs(directory) {
  let moved = 0;
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const path = join(directory, entry.name);

    if (!entry.name.startsWith("__next.")) {
      moved += await flattenSegmentDirs(path);
      continue;
    }

    for (const file of await filesIn(path)) {
      const flatName = `${entry.name}.${relative(path, file).split(sep).join(".")}`;
      await rename(file, join(directory, flatName));
      moved += 1;
    }
    await rm(path, { recursive: true });
  }
  return moved;
}

const moved = await flattenSegmentDirs(outDir);
if (moved > 0) {
  console.log(`fix-export-segments: ${moved} arquivo(s) de prefetch corrigido(s).`);
}
