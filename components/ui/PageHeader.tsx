"use client";

import { Plus, type LucideIcon } from "lucide-react";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import type { ReactNode } from "react";

import { Button } from "@/components/ui/Button";
import {
  getPageHeader,
  type PageHeaderActionKind,
  type PageHeaderActionSpec,
} from "@/config/pageHeaders";
import { usePageHeaderStore } from "@/store/pageHeaderStore";

const ACTION_ICON: Record<PageHeaderActionKind, LucideIcon> = {
  add: Plus,
};

function PageHeaderActionButton({ spec }: { spec: PageHeaderActionSpec }): ReactNode {
  const t = useTranslations(spec.labelNs);
  const onClick = usePageHeaderStore((state) => state.handlers[spec.id]);
  const Icon = ACTION_ICON[spec.kind];

  if (!onClick) {
    return null;
  }

  return (
    <Button size="sm" onClick={onClick}>
      <Icon className="size-4" aria-hidden />
      {t(spec.labelKey)}
    </Button>
  );
}

export function PageHeader(): ReactNode {
  const pathname = usePathname();
  const spec = getPageHeader(pathname);
  const t = useTranslations(spec?.namespace ?? "admin.headers");

  if (!spec) {
    return null;
  }

  const actions = spec.actions ?? [];

  return (
    <header
      className={
        spec.fillViewport
          ? "flex shrink-0 flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"
          : "mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"
      }
    >
      <div className="flex flex-col gap-2">
        <h1 className="font-heading text-prose text-3xl font-semibold tracking-tight sm:text-4xl">
          {t(`${spec.page}.title`)}
        </h1>
        <p className="text-prose-muted max-w-2xl text-sm leading-relaxed sm:text-base">
          {t(`${spec.page}.description`)}
        </p>
      </div>
      {actions.length > 0 ? (
        <div className="flex shrink-0 items-center gap-2">
          {actions.map((action) => (
            <PageHeaderActionButton key={action.id} spec={action} />
          ))}
        </div>
      ) : null}
    </header>
  );
}
