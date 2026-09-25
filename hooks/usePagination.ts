import { useMemo, useState } from "react";

export const TABLE_PAGE_SIZES = [5, 10, 25, 50] as const;
const TABLE_PAGE_SIZE = 5;

type PaginationResult<T> = {
  page: number;
  pageCount: number;
  pageSize: number;
  total: number;
  rows: T[];
  setPage: (page: number) => void;
  setPageSize: (pageSize: number) => void;
};

export function usePagination<T>(
  items: T[],
  resetKey = "",
): PaginationResult<T> {
  const [pagination, setPagination] = useState({ resetKey, page: 1 });
  const [pageSize, setPageSizeState] = useState(TABLE_PAGE_SIZE);
  const total = items.length;
  const pageCount = Math.max(1, Math.ceil(total / pageSize));

  const page = pagination.resetKey === resetKey ? Math.min(pagination.page, pageCount) : 1;

  const rows = useMemo(() => {
    const current = Math.min(page, pageCount);
    const start = (current - 1) * pageSize;
    return items.slice(start, start + pageSize);
  }, [items, page, pageCount, pageSize]);

  function setPageSize(next: number): void {
    setPageSizeState(next);
    setPagination({ resetKey, page: 1 });
  }

  function setPage(next: number): void {
    setPagination({ resetKey, page: Math.min(Math.max(1, next), pageCount) });
  }

  return {
    page,
    pageCount,
    pageSize,
    total,
    rows,
    setPage,
    setPageSize,
  };
}
