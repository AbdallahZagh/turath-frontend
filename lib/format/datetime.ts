import { ar, enUS } from "date-fns/locale";
import {
  format,
  isValid,
  parse,
  parseISO,
  type Locale as DateFnsLocale,
} from "date-fns";

import type { Locale } from "@/i18n/config";
import { toDisplayDigits } from "@/lib/format/digits";

export type HourCycle = "12" | "24";

const ISO_DATE_ONLY = /^\d{4}-\d{2}-\d{2}$/;

/**
 * Levantine (Syrian) month names, January first. date-fns `ar` uses Egyptian/Gulf names
 * (يناير، أغسطس …); Turath shows these instead in every Arabic date (docs/PAGES.md §0).
 */
export const LEVANTINE_MONTHS = [
  "كانون الثاني",
  "شباط",
  "آذار",
  "نيسان",
  "أيار",
  "حزيران",
  "تموز",
  "آب",
  "أيلول",
  "تشرين الأول",
  "تشرين الثاني",
  "كانون الأول",
] as const;

const arLevant: DateFnsLocale = {
  ...ar,
  localize: {
    ...ar.localize,
    // Every width (MMM, MMMM, LLL, LLLL) uses the full name, as date-fns `ar` already does;
    // the narrow single letter (MMMMM) is left to date-fns.
    month: (month, options) =>
      options?.width === "narrow" ? ar.localize.month(month, options) : LEVANTINE_MONTHS[month],
  },
};

export function dateFnsLocale(locale: Locale): DateFnsLocale {
  return locale === "ar" ? arLevant : enUS;
}

/** Parses `yyyy-MM-dd` as local midnight, or a full ISO datetime via `parseISO`. */
export function parseIsoDate(value: string): Date | undefined {
  if (ISO_DATE_ONLY.test(value)) {
    const parsed = parse(value, "yyyy-MM-dd", new Date());
    return isValid(parsed) ? parsed : undefined;
  }
  const parsed = parseISO(value);
  return isValid(parsed) ? parsed : undefined;
}

export function toIsoDate(date: Date): string {
  return format(date, "yyyy-MM-dd");
}

/**
 * Any date shown to people: date-fns pattern in the locale, with Arabic-Indic digits in Arabic
 * (date-fns `ar` prints Latin digits). Stored and URL dates use `toIsoDate` instead.
 */
export function formatDisplayDate(date: Date, pattern: string, locale: Locale): string {
  return toDisplayDigits(format(date, pattern, { locale: dateFnsLocale(locale) }), locale);
}

export function formatPickerDate(iso: string, locale: Locale): string {
  const date = parseIsoDate(iso);
  if (!date) {
    return "";
  }
  return formatDisplayDate(date, "PPP", locale);
}

export function formatMediumDate(iso: string, locale: Locale): string {
  const date = parseIsoDate(iso);
  if (!date) {
    return "";
  }
  return formatDisplayDate(date, "PP", locale);
}

/** Compact day, month and year for lists such as review dates: "18 Aug 2026" / "١٨ آب ٢٠٢٦". */
export function formatShortDate(iso: string, locale: Locale): string {
  const date = parseIsoDate(iso);
  if (!date) {
    return "";
  }
  return formatDisplayDate(date, "d MMM yyyy", locale);
}

/** Full month name, for page dates such as "Last updated": "September 20, 2026" / "٢٠ أيلول ٢٠٢٦". */
export function formatLongDate(iso: string, locale: Locale): string {
  const date = parseIsoDate(iso);
  if (!date) {
    return "";
  }
  return formatDisplayDate(date, locale === "ar" ? "d MMMM yyyy" : "MMMM d, yyyy", locale);
}

export function parseHHmm(value: string): { hours: number; minutes: number } | undefined {
  const match = /^([01]?\d|2[0-3]):([0-5]\d)$/.exec(value);
  if (!match) {
    return undefined;
  }
  return { hours: Number(match[1]), minutes: Number(match[2]) };
}

export function toHHmm(hours: number, minutes: number): string {
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}

export function formatPickerTime(
  hhmm: string,
  locale: Locale,
  hourCycle: HourCycle,
): string {
  const parsed = parseHHmm(hhmm);
  if (!parsed) {
    return "";
  }
  const date = new Date(2000, 0, 1, parsed.hours, parsed.minutes);
  const pattern = hourCycle === "12" ? "h:mm a" : "HH:mm";
  return formatDisplayDate(date, pattern, locale);
}
