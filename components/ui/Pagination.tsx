"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import type { ReactNode } from "react";

import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import { TABLE_PAGE_SIZES } from "@/hooks/usePagination";
import { cn } from "@/lib/cn";
import { formatCount } from "@/lib/format/number";

export type PaginationProps = {
  page: number;
  pageCount: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  pageSizeOptions?: readonly number[];
  className?: string;
};

const PAGER_PAD = {
  paddingX: "0.45em",
  paddingY: "0.28em",
  minHeight: "1.75rem",
  rounded: "0.4em",
} as const;

function pageWindow(page: number, pageCount: number): number[] {
  const span = 5;
  const start = Math.max(1, Math.min(page - 2, pageCount - span + 1));
  const end = Math.min(pageCount, start + span - 1);
  const pages: number[] = [];
  for (let n = Math.max(1, start); n <= end; n += 1) {
    pages.push(n);
  }
  return pages;
}

export function Pagination({
  page,
  pageCount,
  pageSize,
  total,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = TABLE_PAGE_SIZES,
  className,
}: PaginationProps): ReactNode {
  const t = useTranslations("ui.pagination");
  const locale = useLocale();
  const from = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, total);
  const pages = pageWindow(page, pageCount);

  return (
    <nav
      aria-label={t("label")}
      className={cn(
        "flex min-w-0 flex-col gap-2.5 px-4 py-2.5 sm:flex-row sm:items-center sm:justify-between",
        className,
      )}
    >
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-prose-muted text-xs font-medium">{t("perPage")}</span>
        <Select
          variant="glass"
          size="sm"
          compact
          paddingX="0.7em"
          paddingY="0.28em"
          minHeight="1.75rem"
          rounded="0.4em"
          value={String(pageSize)}
          onChange={(value) => onPageSizeChange(Number(value))}
          label={t("perPage")}
          className="w-auto"
          options={pageSizeOptions.map((size) => ({
            value: String(size),
            label: formatCount(size, locale),
          }))}
        />
        <p className="text-prose-muted text-xs tabular-nums">
          {t("summary", { from, to, total })}
        </p>
      </div>
      <div className="flex flex-wrap items-center gap-1">
        <Button
          type="button"
          variant="glass"
          size="sm"
          {...PAGER_PAD}
          disabled={page <= 1}
          aria-label={t("previous")}
          onClick={() => onPageChange(page - 1)}
        >
          <ChevronLeft className="size-3.5 rtl:scale-x-[-1]" aria-hidden />
        </Button>
        {pages.map((n) => (
          <Button
            key={n}
            type="button"
            variant={n === page ? "solid" : "glass"}
            size="sm"
            {...PAGER_PAD}
            className="min-w-7"
            aria-label={t("page", { page: n })}
            aria-current={n === page ? "page" : undefined}
            onClick={() => onPageChange(n)}
          >
            {formatCount(n, locale)}
          </Button>
        ))}
        <Button
          type="button"
          variant="glass"
          size="sm"
          {...PAGER_PAD}
          disabled={page >= pageCount}
          aria-label={t("next")}
          onClick={() => onPageChange(page + 1)}
        >
          <ChevronRight className="size-3.5 rtl:scale-x-[-1]" aria-hidden />
        </Button>
      </div>
    </nav>
  );
}
