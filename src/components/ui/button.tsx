import { cva } from "class-variance-authority";

// Variantes de botão como classes: servem tanto para <button> quanto para links
// (<Link> e <a>), já que a maioria das ações do site é navegação.
// Todas as alturas respeitam o alvo de toque mínimo de 44 px.
export const buttonVariants = cva(
  "group inline-flex shrink-0 items-center justify-center gap-3 rounded-full font-semibold whitespace-nowrap transition duration-500 ease-out-expo disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary: "bg-primary text-on-primary hover:-translate-y-0.5 hover:shadow-lift",
        secondary: "border border-line-strong text-ink hover:border-ink hover:bg-ink/5",
        whatsapp:
          "bg-whatsapp text-white hover:-translate-y-0.5 hover:bg-whatsapp-hover hover:shadow-lift",
      },
      size: {
        sm: "min-h-11 px-5 text-sm",
        md: "min-h-12 px-7 text-sm",
        lg: "min-h-14 px-8 text-base",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);
