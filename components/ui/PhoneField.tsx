"use client";

import { useLocale, useTranslations } from "next-intl";
import { useId, useMemo, useState, type ReactNode } from "react";

import { isLocale, type Locale } from "@/i18n/config";
import { cn } from "@/lib/cn";
import { countryDialPrefix, SYRIA_ISO2 } from "@/lib/geo/countries";

import { CountryFlag } from "./CountryFlag";
import { FIELD_GROUP_MAIN, FIELD_STACK_LABEL } from "./controlClasses";
import { controlStyle, type ControlScaleProps } from "./controlScale";
import { countrySelectOptions } from "./countryOptions";
import { Select } from "./Select";

type PhoneFieldProps = ControlScaleProps & {
  allowInternational?: boolean;
  label: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  countryIso?: string;
  onCountryChange?: (iso2: string) => void;
  name?: string;
  id?: string;
  required?: boolean;
  autoComplete?: string;
  className?: string;
};

const PHONE_WRAPPER = [
  "border-field-main-border bg-field-main flex items-stretch overflow-hidden",
  "rounded-(--control-radius) border-2 transition-[border-color,box-shadow] duration-300",
  "has-focus:border-primary has-focus:shadow-field dark:has-focus:border-foam",
  "has-[[aria-expanded=true]]:border-primary has-[[aria-expanded=true]]:shadow-field",
  "dark:has-[[aria-expanded=true]]:border-foam",
].join(" ");

const PHONE_PREFIX = [
  "text-prose-muted border-field-main-border flex self-stretch items-center justify-center gap-2",
  "border-e-2 px-3 leading-none text-(length:--control-font-size) font-medium select-none",
  "dark:text-dust",
].join(" ");

const PHONE_INPUT = [
  "text-prose placeholder:text-prose-muted min-w-0 flex-1 self-stretch bg-transparent text-start outline-none",
  "px-3 py-(--control-py) leading-none text-(length:--control-font-size)",
  "dark:text-dust dark:placeholder:text-dust",
].join(" ");

export function PhoneField({
  allowInternational = false,
  label,
  placeholder,
  value,
  onChange,
  countryIso,
  onCountryChange,
  name,
  id,
  required,
  autoComplete = "tel-national",
  className,
  size,
  gap,
  paddingX,
  paddingY,
  rounded,
}: PhoneFieldProps): ReactNode {
  const t = useTranslations("countries");
  const rawLocale = useLocale();
  const locale: Locale = isLocale(rawLocale) ? rawLocale : "en";
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const [uncontrolledIso, setUncontrolledIso] = useState(SYRIA_ISO2);
  const iso = countryIso ?? uncontrolledIso;
  const options = useMemo(
    () => countrySelectOptions(locale, "phone"),
    [locale],
  );

  const style = controlStyle({
    size,
    gap,
    paddingX,
    paddingY,
    rounded,
    defaultRadius: "0.625rem",
  });

  function setIso(next: string): void {
    if (countryIso === undefined) {
      setUncontrolledIso(next);
    }
    onCountryChange?.(next);
  }

  return (
    <div className={cn(FIELD_GROUP_MAIN, className)} style={style}>
      <div className={PHONE_WRAPPER}>
        {allowInternational ? (
          <Select
            chrome="inline"
            compact
            searchable
            variant="main"
            name={name ? `${name}Country` : undefined}
            options={options}
            value={iso}
            onChange={setIso}
            label={t("callingCode")}
            searchPlaceholder={t("search")}
            emptyMessage={t("empty")}
            menuMinWidth={320}
            triggerClassName={cn(PHONE_PREFIX, "cursor-pointer")}
            formatTrigger={(option) => (
              <span className="inline-flex items-center gap-2">
                {option.leading}
                <span>{option.hint}</span>
              </span>
            )}
          />
        ) : (
          <span className={PHONE_PREFIX}>
            <CountryFlag iso2={SYRIA_ISO2} />
            <span>{countryDialPrefix(SYRIA_ISO2)}</span>
            {name ? (
              <input type="hidden" name={`${name}Country`} value={SYRIA_ISO2} />
            ) : null}
          </span>
        )}
        <input
          id={inputId}
          name={name}
          type="tel"
          inputMode="tel"
          autoComplete={autoComplete}
          required={required}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          aria-label={label}
          className={PHONE_INPUT}
        />
      </div>
      <label className={FIELD_STACK_LABEL} htmlFor={inputId}>
        {label}
      </label>
    </div>
  );
}
