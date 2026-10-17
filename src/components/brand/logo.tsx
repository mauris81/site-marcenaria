import Image from "next/image";
import Link from "next/link";

import { cn } from "@/lib/utils";

type LogoProps = {
  className?: string;
  onClick?: () => void;
};

/** Monograma do logo + nome em texto real (nítido, legível por buscadores e leitores de tela). */
export function Logo({ className, onClick }: LogoProps) {
  return (
    <Link
      href="/"
      onClick={onClick}
      className={cn("group inline-flex items-center gap-3", className)}
    >
      <Image
        src="/brand/monogram.webp"
        alt=""
        width={44}
        height={44}
        unoptimized
        className="size-11 rounded-[10px] ring-1 ring-line transition duration-500 ease-out-expo group-hover:ring-brand/60"
      />
      <span className="flex flex-col leading-none">
        <span className="text-[0.95rem] font-bold tracking-[0.16em] uppercase">Marcenaria</span>
        <span className="mt-1.5 text-[0.68rem] font-medium tracking-[0.46em] text-brand uppercase">
          Butantã
        </span>
      </span>
    </Link>
  );
}
