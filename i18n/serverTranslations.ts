import { getLocale, getTranslations as getIntlTranslations } from "next-intl/server";

import { withDisplayDigits } from "./displayDigits";

/**
 * The app's server `getTranslations`: next-intl's, with Arabic-Indic digits in Arabic output
 * (docs/PAGES.md §0, "Digits"). Import this instead of next-intl/server's.
 */
export const getTranslations = (async (namespace?: string) => {
  const [t, locale] = await Promise.all([getIntlTranslations(namespace as never), getLocale()]);
  return withDisplayDigits(t, locale, namespace);
}) as typeof getIntlTranslations;
