"use client";

import type { ReactNode } from "react";

import type { Locale } from "@/i18n/config";
import {
  countryDialPrefix,
  countryName,
  countrySearchText,
  sortedCountryIso2,
  type CountryListKind,
} from "@/lib/geo/countries";

import { CountryFlag } from "./CountryFlag";
import type { SelectOption } from "./Select";

export function countrySelectOptions(
  locale: Locale,
  kind: CountryListKind = "nationality",
): SelectOption[] {
  const withDial = kind === "phone";
  return sortedCountryIso2(locale, kind).map((iso2) => ({
    value: iso2,
    label: countryName(iso2, locale),
    leading: <CountryFlag iso2={iso2} />,
    hint: withDial ? countryDialPrefix(iso2) : undefined,
    keywords: countrySearchText(iso2),
  }));
}
