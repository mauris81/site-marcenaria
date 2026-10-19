import type { ReactNode } from "react";

import { SiteChrome } from "@/components/layout/site-chrome";

// Páginas do site (home, serviços, orçamento): todas com cabeçalho e rodapé.
// O grupo "(site)" não entra na URL.
export default function SiteLayout({ children }: { children: ReactNode }) {
  return <SiteChrome>{children}</SiteChrome>;
}
