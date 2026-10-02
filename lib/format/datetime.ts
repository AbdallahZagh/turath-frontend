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

/**
 * The one place date and time display preferences live (docs/PAGES.md §0, "Dates and times").
 * Screens never pass an hour cycle or a pattern of their own; change a value here and every
 * date and time in the app follows.
 */
export const DATE_TIME_PREFS: { hourCycle: HourCycle; mediumDatePattern: string } = {
  hourCycle: "24",
  mediumDatePattern: "d MMM yyyy",
};

const TIME_PATTERN: Record<HourCycle, string> = { "12": "h:mm a", "24": "HH:mm" };

/** Date and time on one line: "3 Oct 2026, 20:30" / "٣ تشرين الأول ٢٠٢٦، ٢٠:٣٠". */
const DATE_TIME_JOINER: Record<Locale, string> = { en: ", ", ar: "، " };

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

/** Businesses keep Syrian time; "today" for arrivals and demo bookings is the day in Damascus. */
export const SYRIA_TIME_ZONE = "Asia/Damascus";

const SYRIA_DAY = new Intl.DateTimeFormat("en-CA", {
  timeZone: SYRIA_TIME_ZONE,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

/**
 * Today's date in Damascus as `yyyy-MM-dd`, whatever the server's or browser's own time zone, so
 * server and client agree on what "today" is.
 */
export function todayInSyria(now: Date = new Date()): string {
  const parts = SYRIA_DAY.formatToParts(now);
  const part = (type: Intl.DateTimeFormatPartTypes): string =>
    parts.find((item) => item.type === type)?.value ?? "";
  return `${part("year")}-${part("month")}-${part("day")}`;
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

/** The everyday date, in cards, lists and summaries: "18 Aug 2026" / "١٨ آب ٢٠٢٦". */
export function formatMediumDate(iso: string, locale: Locale): string {
  const date = parseIsoDate(iso);
  if (!date) {
    return "";
  }
  return formatDisplayDate(date, DATE_TIME_PREFS.mediumDatePattern, locale);
}

/** Clock time of an ISO datetime, in the configured hour cycle. */
export function formatTime(iso: string, locale: Locale): string {
  const date = parseIsoDate(iso);
  if (!date) {
    return "";
  }
  return formatDisplayDate(date, TIME_PATTERN[DATE_TIME_PREFS.hourCycle], locale);
}

/** Medium date and clock time of an ISO datetime, joined with "," (Arabic "،"). */
export function formatDateTime(iso: string, locale: Locale): string {
  const date = formatMediumDate(iso, locale);
  const time = formatTime(iso, locale);
  return date && time ? `${date}${DATE_TIME_JOINER[locale]}${time}` : "";
}

/** A medium date and an `HH:mm` clock time, joined like `formatDateTime`. */
export function formatDateAndPickerTime(iso: string, hhmm: string, locale: Locale): string {
  const date = formatMediumDate(iso, locale);
  const time = formatPickerTime(hhmm, locale);
  return date && time ? `${date}${DATE_TIME_JOINER[locale]}${time}` : date;
}

/** Short weekday for chart axes: "Tue" / "الثلاثاء". */
export function formatWeekdayShort(iso: string, locale: Locale): string {
  const date = parseIsoDate(iso);
  if (!date) {
    return "";
  }
  return formatDisplayDate(date, "EEE", locale);
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

/** An `HH:mm` clock time, in the configured hour cycle. */
export function formatPickerTime(hhmm: string, locale: Locale): string {
  const parsed = parseHHmm(hhmm);
  if (!parsed) {
    return "";
  }
  const date = new Date(2000, 0, 1, parsed.hours, parsed.minutes);
  return formatDisplayDate(date, TIME_PATTERN[DATE_TIME_PREFS.hourCycle], locale);
}
