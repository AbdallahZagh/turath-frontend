import { House, Search } from "lucide-react";
import type { ReactNode } from "react";

import { Logo } from "@/components/logo/Logo";
import { Button } from "@/components/ui/Button";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { PAGE_TITLE_CLASS } from "@/components/ui/pageTitle";
import { useTranslations } from "@/i18n/translations";

type NotFoundPanelProps = {
  /** Where "Back to home" goes: the public home, or the portal home inside a portal shell. */
  homeHref?: string;
};

/** Branded 404 panel shared by the public site and the user, business, and admin portals. */
export function NotFoundPanel({ homeHref = "/" }: NotFoundPanelProps): ReactNode {
  const t = useTranslations("notFound");

  return (
    <GlassPanel className="mx-auto max-w-lg flex-none items-center px-6 py-10 text-center sm:px-10 sm:py-12">
      <Logo variant="main" className="h-12 sm:h-14" />
      <h1 className={`${PAGE_TITLE_CLASS} mt-8`}>{t("title")}</h1>
      <p className="text-prose-muted mt-3 max-w-sm text-sm leading-relaxed sm:text-base">
        {t("description")}
      </p>
      <div className="mt-8 flex w-full flex-col justify-center gap-3 sm:w-auto sm:flex-row">
        <Button href={homeHref}>
          <House className="size-4" aria-hidden />
          {t("home")}
        </Button>
        <Button href="/search" variant="outline">
          <Search className="size-4" aria-hidden />
          {t("search")}
        </Button>
      </div>
    </GlassPanel>
  );
}

/** The panel placed under the fixed public header. */
export function PublicNotFoundSection(): ReactNode {
  return (
    <div className="flex min-h-[70svh] items-center px-4 pt-28 pb-20 sm:px-6 sm:pt-32 sm:pb-24">
      <NotFoundPanel />
    </div>
  );
}
