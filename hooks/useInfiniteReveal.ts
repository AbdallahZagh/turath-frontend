import { useCallback, useState } from "react";

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
  const stateKey = `${resetKey}:${pageSize}`;
  const [reveal, setReveal] = useState({ key: stateKey, count: pageSize });
  const count = reveal.key === stateKey ? reveal.count : pageSize;

  const visible = items.slice(0, count);
  const hasMore = count < items.length;

  const loadMore = useCallback(() => {
    setReveal((current) => ({
      key: stateKey,
      count: Math.min((current.key === stateKey ? current.count : pageSize) + pageSize, items.length),
    }));
  }, [items.length, pageSize, stateKey]);

  return { visible, hasMore, loadMore };
}
