import { serializeJsonLd } from "@/lib/structured-data";

/** Dados estruturados da página (schema.org), lidos pelo Google; invisível na tela. */
export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: serializeJsonLd(data) }}
    />
  );
}
