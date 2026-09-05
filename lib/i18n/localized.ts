import type { Locale } from "@/i18n/config";

export type LocalizedName = {
  en: string;
  ar: string;
};

export function localizedName(name: LocalizedName, locale: Locale): string {
  return name[locale];
}
