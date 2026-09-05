import { useCallback, useEffect, useState } from "react";

const CARD_PAGE_SIZE = 9;

type InfiniteRevealResult<T> = {
  visible: T[];
  hasMore: boolean;
  loadMore: () => void;
};

export function useInfiniteReveal<T>(
  items: T[],
  resetKey = "",
  pageSize = CARD_PAGE_SIZE,
): InfiniteRevealResult<T> {
  const [count, setCount] = useState(pageSize);

  useEffect(() => {
    setCount(pageSize);
  }, [resetKey, pageSize]);

  const visible = items.slice(0, count);
  const hasMore = count < items.length;

  const loadMore = useCallback(() => {
    setCount((current) => Math.min(current + pageSize, items.length));
  }, [items.length, pageSize]);

  return { visible, hasMore, loadMore };
}
