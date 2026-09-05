"use client";

import { useRouter } from "next/navigation";
import type { KeyboardEvent, ReactNode } from "react";

import { GlassPanel } from "@/components/ui/GlassPanel";
import { Pagination } from "@/components/ui/Pagination";
import { Skeleton } from "@/components/ui/Skeleton";
import { cn } from "@/lib/cn";

export type TableAlign = "start" | "center" | "end";

export type TableColumn<T> = {
  id: string;
  header: ReactNode;
  cell: (row: T) => ReactNode;
  align?: TableAlign;
  className?: string;
  headerClassName?: string;
};

export type TablePagination = {
  page: number;
  pageCount: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
};

type TableProps<T> = {
  columns: TableColumn<T>[];
  rows: T[];
  getRowId: (row: T) => string;
  getRowHref?: (row: T) => string | undefined;
  onRowClick?: (row: T) => void;
  caption?: string;
  emptyMessage?: string;
  isLoading?: boolean;
  loadingRowCount?: number;
  pagination?: TablePagination;
  /** Stretch to leftover column height; only the table body scrolls. */
  fill?: boolean;
  className?: string;
};

const ALIGN: Record<TableAlign, string> = {
  start: "text-start",
  center: "text-center",
  end: "text-end",
};

const CELL = "px-5 py-3 text-sm align-middle";
const HEADER_CELL =
  "px-5 py-3 text-xs font-semibold tracking-wide whitespace-nowrap uppercase align-middle";

export function Table<T>({
  columns,
  rows,
  getRowId,
  getRowHref,
  onRowClick,
  caption,
  emptyMessage,
  isLoading = false,
  loadingRowCount = 8,
  pagination,
  fill = false,
  className,
}: TableProps<T>): ReactNode {
  const router = useRouter();
  const showEmpty = !isLoading && rows.length === 0;

  function openRow(row: T): void {
    onRowClick?.(row);
    const href = getRowHref?.(row);
    if (href) {
      router.push(href);
    }
  }

  function rowIsInteractive(row: T): boolean {
    return Boolean(onRowClick || getRowHref?.(row));
  }

  function onRowKeyDown(event: KeyboardEvent<HTMLTableRowElement>, row: T): void {
    if (!rowIsInteractive(row)) {
      return;
    }
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openRow(row);
    }
  }

  return (
    <GlassPanel
      className={cn(
        "flex flex-col p-0",
        fill && "min-h-0 flex-1",
        className,
      )}
    >
      <div
        className={cn(
          "min-w-0",
          fill ? "min-h-0 flex-1 overflow-auto" : "overflow-x-auto",
          pagination ? "rounded-t-[inherit]" : "rounded-[inherit]",
        )}
      >
        <table className="w-full min-w-max border-collapse text-start">
          {caption ? <caption className="sr-only">{caption}</caption> : null}
          <thead className="sticky top-0 z-10">
            <tr className="border-glass-border bg-table-header border-b">
              {columns.map((column) => (
                <th
                  key={column.id}
                  scope="col"
                  className={cn(
                    HEADER_CELL,
                    "bg-table-header text-prose",
                    ALIGN[column.align ?? "start"],
                    column.headerClassName,
                  )}
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-glass-border divide-y">
            {isLoading
              ? Array.from({ length: loadingRowCount }, (_, index) => (
                  <tr key={`skeleton-${index}`}>
                    {columns.map((column) => (
                      <td
                        key={column.id}
                        className={cn(CELL, ALIGN[column.align ?? "start"])}
                      >
                        <Skeleton className="h-4 w-24 rounded-full" />
                      </td>
                    ))}
                  </tr>
                ))
              : null}

            {showEmpty ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="text-prose-muted px-5 py-16 text-center text-sm"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : null}

            {!isLoading
              ? rows.map((row) => {
                  const interactive = rowIsInteractive(row);
                  return (
                    <tr
                      key={getRowId(row)}
                      className={cn(
                        "transition-colors",
                        interactive &&
                          "hover:bg-option-hover focus-visible:bg-option-hover cursor-pointer",
                      )}
                      tabIndex={interactive ? 0 : undefined}
                      onClick={interactive ? () => openRow(row) : undefined}
                      onKeyDown={interactive ? (event) => onRowKeyDown(event, row) : undefined}
                    >
                      {columns.map((column) => (
                        <td
                          key={column.id}
                          className={cn(
                            CELL,
                            "text-prose",
                            ALIGN[column.align ?? "start"],
                            (column.align ?? "start") === "end" &&
                              "[&>div]:ms-auto [&>div]:w-fit",
                            column.className,
                          )}
                        >
                          {column.cell(row)}
                        </td>
                      ))}
                    </tr>
                  );
                })
              : null}
          </tbody>
        </table>
      </div>
      {pagination ? (
        <div className="border-glass-border min-w-0 shrink-0 rounded-b-[inherit] border-t">
          <Pagination
            page={pagination.page}
            pageCount={pagination.pageCount}
            pageSize={pagination.pageSize}
            total={pagination.total}
            onPageChange={pagination.onPageChange}
            onPageSizeChange={pagination.onPageSizeChange}
          />
        </div>
      ) : null}
    </GlassPanel>
  );
}
