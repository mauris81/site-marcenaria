import type { Route } from "next";

import { Emphasis } from "@/components/ui/emphasis";
import { Photo } from "@/components/ui/photo";
import type { Service } from "@/lib/content";

import { CabinetReveal } from "./cabinet-reveal";
import { DrawerReveal } from "./drawer-reveal";
import { SlatsReveal } from "./slats-reveal";

type ServiceShowcaseProps = {
  service: Service & { showcase: NonNullable<Service["showcase"]> };
  index: number;
};

/**
 * Traduz o `showcase` de um serviço (services.json) na cena correspondente.
 * As fotos são renderizadas aqui, no servidor, e entram na cena como conteúdo
 * pronto: ficam no HTML (SEO) e carregam sob demanda (lazy loading).
 */
export function ServiceShowcase({ service, index }: ServiceShowcaseProps) {
  const { showcase } = service;
  const props = {
    id: `cena-${service.slug}`,
    index,
    label: service.name,
    title: <Emphasis text={showcase.title} />,
    text: service.card.text,
    href: `/${service.slug}` as Route,
    cta: service.card.cta,
    photos: showcase.photos.map((id) => (
      <Photo
        key={id}
        id={id}
        fill
        sizes="(min-width: 1024px) 20vw, 42vw"
        className="object-cover"
      />
    )),
  };

  switch (showcase.reveal) {
    case "door":
      return <CabinetReveal {...props} />;
    case "drawer":
      return <DrawerReveal {...props} />;
    case "slats":
      return <SlatsReveal {...props} />;
  }
}
