import type { Locale } from "@/i18n/config";
import { toDisplayDigits } from "@/lib/format/digits";

export type LocalizedName = {
  en: string;
  ar: string;
};

export function localizedName(name: LocalizedName, locale: Locale): string {
  return name[locale];
}

/**
 * Localized content shown as reading text (durations, descriptions): the locale's value with its
 * digits in display form (Arabic-Indic in Arabic, §0 Digits). Data stays Latin, as the API sends
 * it; use `localizedName` for values that go back into forms or URLs.
 */
export function localizedDisplayText(text: LocalizedName, locale: Locale): string {
  return toDisplayDigits(text[locale], locale);
}

/**
 * A person or business name placed inside translated text (message arguments, aria labels):
 * U+2068 FIRST-STRONG ISOLATE … U+2069, the string form of `<bdi>`. Keeps "Lina M." whole, with
 * its full stop on the right side, inside an Arabic sentence. In JSX, wrap names in `<bdi>`.
 */
export function isolateName(name: string): string {
  return `\u2068${name}\u2069`;
}
