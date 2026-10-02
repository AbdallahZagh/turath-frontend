"use client";

import { useLocale } from "next-intl";
import type { ReactNode } from "react";

import { isLocale } from "@/i18n/config";
import { useTranslations } from "@/i18n/translations";
import { formatMediumDate } from "@/lib/format/datetime";

import type { ControlSize } from "./controlScale";
import { DatePicker } from "./DatePicker";
import type { FieldVariant } from "./field.types";
import { FilterChips } from "./FilterChips";

type MultiDatePickerProps = {
  /** ISO dates (yyyy-mm-dd), kept sorted. */
  value: readonly string[];
  onChange: (value: string[]) => void;
  label?: string;
  id?: string;
  variant?: FieldVariant;
  size?: ControlSize;
  min?: string;
};

/** The shared date picker in multi-date mode, with each chosen date as a removable chip. */
export function MultiDatePicker({
  value,
  onChange,
  label,
  id,
  variant,
  size,
  min,
}: MultiDatePickerProps): ReactNode {
  const t = useTranslations("picker");
  const rawLocale = useLocale();
  const locale = isLocale(rawLocale) ? rawLocale : "en";

  function toggle(iso: string): void {
    onChange(
      value.includes(iso) ? value.filter((date) => date !== iso) : [...value, iso].sort(),
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <DatePicker
        id={id}
        label={label}
        variant={variant}
        size={size}
        min={min}
        showToday={false}
        selectedDates={value}
        onToggleDate={toggle}
      />
      <FilterChips
        listLabel={t("chosenDates")}
        chips={value.map((iso) => {
          const date = formatMediumDate(iso, locale);
          return {
            id: iso,
            value: date,
            removeLabel: t("removeDate", { date }),
            onRemove: () => toggle(iso),
          };
        })}
      />
    </div>
  );
}
