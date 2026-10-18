import Image, { type ImageProps } from "next/image";

import { getPhoto } from "@/lib/content";

type PhotoProps = Omit<
  ImageProps,
  "src" | "alt" | "width" | "height" | "placeholder" | "blurDataURL"
> & {
  /** `id` da foto em src/content/photos.json. */
  id: string;
  /** Texto alternativo para este contexto; use "" se a foto for decorativa. Padrão: o do catálogo. */
  alt?: string;
  /** Enquadramento (CSS `object-position`); padrão: o ponto focal do catálogo. */
  position?: string;
};

/** Foto do catálogo nas versões otimizadas, com placeholder borrado enquanto carrega. */
export async function Photo({ id, alt, position, fill, style, ...props }: PhotoProps) {
  const photo = await getPhoto(id);
  if (!photo) throw new Error(`A foto "${id}" não existe em src/content/photos.json.`);

  return (
    <Image
      src={`/images/${photo.id}`}
      alt={alt ?? photo.alt}
      {...(fill ? { fill } : { width: photo.width, height: photo.height })}
      placeholder="blur"
      blurDataURL={photo.blurDataURL}
      style={{ objectPosition: position ?? photo.position, ...style }}
      {...props}
    />
  );
}
