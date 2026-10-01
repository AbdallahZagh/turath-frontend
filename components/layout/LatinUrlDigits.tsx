"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, type ReactNode } from "react";

import { toLatinDigits } from "@/lib/format/digits";

const NON_LATIN_DIGIT = /[\u0660-\u0669\u06F0-\u06F9]/;

/**
 * Links and URL params are always Latin (docs/PAGES.md §0, "Digits"). Pages already read
 * hand-typed Arabic or Persian digits (lib/search/bookingSearch.ts); this rewrites the address
 * bar to the Latin form without adding a history entry.
 */
export function LatinUrlDigits(): ReactNode {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const query = searchParams.toString();
    const current = `${pathname}${query ? `?${query}` : ""}`;
    if (!NON_LATIN_DIGIT.test(decodeURIComponent(current))) {
      return;
    }
    const params = new URLSearchParams();
    for (const [key, value] of searchParams.entries()) {
      params.append(toLatinDigits(key), toLatinDigits(value));
    }
    const nextQuery = params.toString();
    const nextPath = toLatinDigits(decodeURIComponent(pathname));
    router.replace(`${nextPath}${nextQuery ? `?${nextQuery}` : ""}${window.location.hash}`, {
      scroll: false,
    });
  }, [pathname, searchParams, router]);

  return null;
}
