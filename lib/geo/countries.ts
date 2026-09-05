import isoCountries from "i18n-iso-countries";
import arLocale from "i18n-iso-countries/langs/ar.json";
import enLocale from "i18n-iso-countries/langs/en.json";
import {
  getCountries,
  getCountryCallingCode,
  isSupportedCountry,
} from "libphonenumber-js";

import type { Locale } from "@/i18n/config";

isoCountries.registerLocale(enLocale);
isoCountries.registerLocale(arLocale);

export const SYRIA_ISO2 = "SY";

export type CountryListKind = "nationality" | "phone";

export function countryDialPrefix(iso2: string): string {
  const code = iso2.toUpperCase();
  if (!isSupportedCountry(code)) {
    return "";
  }
  return `+${getCountryCallingCode(code)}`;
}

export function countryName(iso2: string, locale: Locale): string {
  return isoCountries.getName(iso2.toUpperCase(), locale, { select: "official" }) ?? iso2.toUpperCase();
}

export function countrySearchText(iso2: string): string {
  const code = iso2.toUpperCase();
  const dial = countryDialPrefix(code);
  return `${countryName(code, "en")} ${countryName(code, "ar")} ${code} ${dial}`.toLowerCase();
}

function isoList(kind: CountryListKind): string[] {
  if (kind === "phone") {
    return [...getCountries()];
  }
  return Object.keys(isoCountries.getAlpha2Codes());
}

export function sortedCountryIso2(
  locale: Locale,
  kind: CountryListKind = "nationality",
  pin = SYRIA_ISO2,
): string[] {
  const collator = new Intl.Collator(locale, { sensitivity: "base" });
  return isoList(kind).sort((left, right) => {
    if (left === pin) {
      return -1;
    }
    if (right === pin) {
      return 1;
    }
    return collator.compare(countryName(left, locale), countryName(right, locale));
  });
}
