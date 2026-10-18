"use client";

import type { ImageLoaderProps } from "next/image";

import { basePath } from "./base-path";

// Loader do next/image para o export estático. Em vez de otimizar sob demanda
// (o que exigiria um servidor), aponta para as versões WebP que
// scripts/optimize-images.mjs gera no build — uma para cada largura que o
// next/image pode pedir (src/lib/image-widths.json).
export default function imageLoader({ src, width }: ImageLoaderProps) {
  if (!src.startsWith("/images/")) return src;
  // O next/image não aplica o basePath a `src` em texto; aplicamos aqui.
  return `${basePath}${src}-${width}.webp`;
}
