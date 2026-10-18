import { SplitHeading } from "@/components/motion/split-heading";
import { Emphasis } from "@/components/ui/emphasis";
import { cn } from "@/lib/utils";

type SectionHeadingProps = {
  id: string;
  eyebrow?: string;
  /** Aceita *ênfase* entre asteriscos. */
  title: string;
  text?: string;
  align?: "left" | "center";
  className?: string;
};

/** Cabeçalho padrão das seções: rótulo, título (h2) e texto de apoio. */
export function SectionHeading({
  id,
  eyebrow,
  title,
  text,
  align = "left",
  className,
}: SectionHeadingProps) {
  return (
    <div className={cn("max-w-3xl", align === "center" && "mx-auto text-center", className)}>
      {eyebrow && <p className="text-eyebrow font-semibold text-brand uppercase">{eyebrow}</p>}
      <SplitHeading id={id} className="mt-5 font-display text-heading">
        <Emphasis text={title} />
      </SplitHeading>
      {text && <p className="mt-5 text-lead text-ink-muted">{text}</p>}
    </div>
  );
}
