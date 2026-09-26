"use client";

import { ChevronRight, Plus, type LucideIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import type { ReactNode } from "react";

import { Button } from "@/components/ui/Button";
import { PAGE_TITLE_CLASS } from "@/components/ui/pageTitle";
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

function PageHeaderBreadcrumb({
  parentPath,
  currentTitle,
}: {
  parentPath: string;
  currentTitle: string;
}): ReactNode {
  const parent = getPageHeader(parentPath);
  const t = useTranslations(parent?.namespace ?? "admin.headers");
  const tUi = useTranslations("ui");

  if (!parent) {
    return null;
  }

  return (
    <nav aria-label={tUi("breadcrumb")}>
      <ol className="text-prose-muted flex flex-wrap items-center gap-1.5 text-sm">
        <li>
          <Link
            href={parentPath}
            className="hover:text-primary focus-visible:outline-ring rounded-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2"
          >
            {t(`${parent.page}.title`)}
          </Link>
        </li>
        <li aria-hidden>
          <ChevronRight className="size-3.5 rtl:rotate-180" />
        </li>
        <li aria-current="page" className="text-prose font-medium">
          {currentTitle}
        </li>
      </ol>
    </nav>
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
        {spec.parent ? (
          <PageHeaderBreadcrumb parentPath={spec.parent} currentTitle={t(`${spec.page}.title`)} />
        ) : null}
        <h1 className={PAGE_TITLE_CLASS}>{t(`${spec.page}.title`)}</h1>
        <p className="text-prose-muted max-w-2xl text-sm leading-relaxed sm:text-base">
          {t(`${spec.page}.description`)}
        </p>
      </div>
      {actions.length > 0 ? (
        <div className="flex shrink-0 items-center gap-2 self-end sm:self-auto">
          {actions.map((action) => (
            <PageHeaderActionButton key={action.id} spec={action} />
          ))}
        </div>
      ) : null}
    </header>
  );
}
