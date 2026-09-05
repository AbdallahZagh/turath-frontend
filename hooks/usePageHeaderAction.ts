import { useEffect, useRef } from "react";

import { usePageHeaderStore } from "@/store/pageHeaderStore";

export function usePageHeaderAction(id: string, onClick: () => void): void {
  const register = usePageHeaderStore((state) => state.register);
  const unregister = usePageHeaderStore((state) => state.unregister);
  const onClickRef = useRef(onClick);
  onClickRef.current = onClick;

  useEffect(() => {
    register(id, () => {
      onClickRef.current();
    });
    return () => unregister(id);
  }, [id, register, unregister]);
}
