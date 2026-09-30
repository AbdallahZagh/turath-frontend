"use client";

import { usePathname, useSearchParams } from "next/navigation";

/** Current path plus query string (e.g. `/hotels/x?checkIn=…&guests=2`), for sign-in return links. */
export function useCurrentPath(): string {
  const pathname = usePathname();
  const query = useSearchParams().toString();
  return query ? `${pathname}?${query}` : pathname;
}
