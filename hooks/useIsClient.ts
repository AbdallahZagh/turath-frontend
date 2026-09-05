import { useSyncExternalStore } from "react";

function subscribe(): () => void {
  return () => undefined;
}

export function useIsClient(): boolean {
  return useSyncExternalStore(subscribe, () => true, () => false);
}
