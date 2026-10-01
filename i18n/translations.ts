import { useLocale, useTranslations as useIntlTranslations } from "next-intl";
import { useMemo } from "react";

import { withDisplayDigits } from "./displayDigits";

/**
 * The app's `useTranslations`: next-intl's, with Arabic-Indic digits in Arabic output
 * (docs/PAGES.md §0, "Digits"). Import this instead of next-intl's hook.
 */
export const useTranslations = ((namespace?: string) => {
  const t = useIntlTranslations(namespace as never);
  const locale = useLocale();
  return useMemo(() => withDisplayDigits(t, locale, namespace), [t, locale, namespace]);
}) as typeof useIntlTranslations;
