/** Primeiro elemento focável da página: deixa quem usa teclado pular o menu. */
export function SkipLink() {
  return (
    <a
      href="#conteudo"
      className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[60] focus:rounded-full focus:bg-primary focus:px-5 focus:py-3 focus:text-sm focus:font-semibold focus:text-on-primary"
    >
      Pular para o conteúdo
    </a>
  );
}
