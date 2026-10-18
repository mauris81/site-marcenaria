import { Reveal } from "@/components/motion/reveal";

import { SectionHeading } from "./section-heading";

type DifferentialsProps = {
  eyebrow?: string;
  title: string;
  items: { title: string; text: string }[];
};

export function Differentials({ eyebrow, title, items }: DifferentialsProps) {
  return (
    <section aria-labelledby="diferenciais" className="theme-light">
      <div className="container-site py-24 md:py-32">
        <SectionHeading id="diferenciais" eyebrow={eyebrow} title={title} />
        <Reveal stagger className="mt-16 grid gap-x-12 gap-y-14 md:grid-cols-3">
          {items.map((item, index) => (
            <div key={item.title} className="border-t border-line-strong pt-8">
              <span className="font-display text-sm text-brand tabular-nums">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-4 font-display text-title">{item.title}</h3>
              <p className="mt-3 text-ink-muted">{item.text}</p>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
