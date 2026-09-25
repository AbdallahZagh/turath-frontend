import { useEffect } from "react";

import { usePageHeaderStore } from "@/store/pageHeaderStore";

export function usePageHeaderAction(id: string, onClick: () => void): void {
  const register = usePageHeaderStore((state) => state.register);
  const unregister = usePageHeaderStore((state) => state.unregister);
  useEffect(() => {
    register(id, onClick);
    return () => unregister(id);
  }, [id, onClick, register, unregister]);
}
