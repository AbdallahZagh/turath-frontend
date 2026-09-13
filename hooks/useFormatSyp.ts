"use client";

import { useLocale } from "next-intl";
import { useCallback } from "react";

import { formatSyp } from "@/lib/format/money";
import { useCurrencyStore } from "@/store/currencyStore";

export function useFormatSyp(): (amountSyp: number) => string {
  const locale = useLocale();
  const currency = useCurrencyStore((state) => state.currency);

  return useCallback(
    (amountSyp: number) => formatSyp(amountSyp, locale, currency),
    [locale, currency],
  );
}
