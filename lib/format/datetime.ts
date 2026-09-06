import { ar, enUS } from "date-fns/locale";
import {
  format,
  isValid,
  parse,
  parseISO,
  type Locale as DateFnsLocale,
} from "date-fns";

import type { Locale } from "@/i18n/config";

export type HourCycle = "12" | "24";

const ISO_DATE_ONLY = /^\d{4}-\d{2}-\d{2}$/;

export function dateFnsLocale(locale: Locale): DateFnsLocale {
  return locale === "ar" ? ar : enUS;
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

export function formatPickerDate(iso: string, locale: Locale): string {
  const date = parseIsoDate(iso);
  if (!date) {
    return "";
  }
  return format(date, "PPP", { locale: dateFnsLocale(locale) });
}

export function formatMediumDate(iso: string, locale: Locale): string {
  const date = parseIsoDate(iso);
  if (!date) {
    return "";
  }
  return format(date, "PP", { locale: dateFnsLocale(locale) });
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
  return format(date, pattern, { locale: dateFnsLocale(locale) });
}
