import type { Locale } from "@/i18n/config";

/**
 * Between the parts of one line ("Room · 2 guests"). Arabic never uses "·"; the parts are set
 * apart by an em space instead (docs/PAGES.md §0). Dates with times use `formatDateTime`.
 */
const PART_SEPARATOR: Record<Locale, string> = { en: " · ", ar: "\u2003" };

/** Between the items of a list ("English · Arabic" / «الإنجليزية، العربية»). */
const LIST_SEPARATOR: Record<Locale, string> = { en: " · ", ar: "، " };

export function partSeparator(locale: Locale): string {
  return PART_SEPARATOR[locale];
}

export function listSeparator(locale: Locale): string {
  return LIST_SEPARATOR[locale];
}

/**
 * A short phrase that may wrap at its last space only ("14 تشرين الأول" / "2026"), so a date in a
 * narrow column never splits a month name or leaves the day on its own.
 */
export function wrapAtLastSpaceOnly(text: string): string {
  const last = text.lastIndexOf(" ");
  return last < 0
    ? text
    : `${text.slice(0, last).replaceAll(" ", "\u00A0")} ${text.slice(last + 1)}`;
}

/**
 * Keeps each date or time whole and lets a table cell wrap only between the parts: after the range
 * dash or the date–time joiner ("2 Oct 2026 –" / "4 Oct 2026", "5 Oct 2026," / "19:30").
 */
export function wrapBetweenParts(text: string): string {
  return text.replaceAll(" ", "\u00A0").replace(/(–|,|،)\u00A0/g, "$1 ");
}
