"use client";

import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useMemo, useRef, useState, type ReactNode } from "react";
import {
  addMonths,
  addYears,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isAfter,
  isBefore,
  isSameDay,
  isSameMonth,
  startOfMonth,
  startOfWeek,
} from "date-fns";

import { cn } from "@/lib/cn";
import {
  dateFnsLocale,
  formatPickerDate,
  parseIsoDate,
  toIsoDate,
} from "@/lib/format/datetime";
import { isLocale } from "@/i18n/config";

import type { ControlSize } from "./controlScale";
import type { FieldVariant } from "./field.types";
import { PickerField } from "./PickerField";

export type DatePickerVariant = FieldVariant;
export type DatePickerSize = ControlSize;

type CalendarView = "days" | "months" | "years";

type DatePickerProps = {
  variant?: DatePickerVariant;
  size?: DatePickerSize;
  gap?: string;
  paddingX?: string;
  paddingY?: string;
  rounded?: string;
  minHeight?: string;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  name?: string;
  label?: string;
  placeholder?: string;
  icon?: ReactNode;
  disabled?: boolean;
  required?: boolean;
  id?: string;
  className?: string;
  min?: string;
  max?: string;
  showToday?: boolean;
  centerOn?: string;
};

const WEEKDAYS = [0, 1, 2, 3, 4, 5, 6] as const;

function clampDate(date: Date, min?: Date, max?: Date): Date {
  if (min && isBefore(date, min)) {
    return min;
  }
  if (max && isAfter(date, max)) {
    return max;
  }
  return date;
}

function isDisabled(date: Date, min?: Date, max?: Date): boolean {
  if (min && isBefore(date, min)) {
    return true;
  }
  if (max && isAfter(date, max)) {
    return true;
  }
  return false;
}

export function DatePicker({
  variant = "plain",
  size = "md",
  gap,
  paddingX,
  paddingY,
  rounded,
  minHeight,
  value,
  defaultValue = "",
  onChange,
  name,
  label,
  placeholder,
  icon,
  disabled,
  required,
  id,
  className,
  min,
  max,
  showToday = true,
  centerOn,
}: DatePickerProps): ReactNode {
  const t = useTranslations("picker");
  const rawLocale = useLocale();
  const locale = isLocale(rawLocale) ? rawLocale : "en";
  const dfsLocale = dateFnsLocale(locale);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [uncontrolled, setUncontrolled] = useState(defaultValue);
  const [view, setView] = useState<CalendarView>("days");

  const selectedIso = value ?? uncontrolled;
  const selectedDate = parseIsoDate(selectedIso);
  const minDate = min ? parseIsoDate(min) : undefined;
  const maxDate = max ? parseIsoDate(max) : undefined;
  const today = new Date();

  const [cursor, setCursor] = useState(() => selectedDate ?? today);

  const weekStartsOn = dfsLocale.options?.weekStartsOn ?? 0;

  const weekdayLabels = useMemo(() => {
    const start = startOfWeek(new Date(2024, 0, 7), { weekStartsOn, locale: dfsLocale });
    return WEEKDAYS.map((offset) => {
      const day = new Date(start);
      day.setDate(start.getDate() + offset);
      return format(day, "EEEEEE", { locale: dfsLocale });
    });
  }, [dfsLocale, weekStartsOn]);

  const days = useMemo(() => {
    const start = startOfWeek(startOfMonth(cursor), { weekStartsOn, locale: dfsLocale });
    const end = endOfWeek(endOfMonth(cursor), { weekStartsOn, locale: dfsLocale });
    return eachDayOfInterval({ start, end });
  }, [cursor, dfsLocale, weekStartsOn]);

  const yearStart = Math.floor(cursor.getFullYear() / 12) * 12;
  const years = Array.from({ length: 12 }, (_, index) => yearStart + index);

  function commit(date: Date): void {
    const next = toIsoDate(clampDate(date, minDate, maxDate));
    if (value === undefined) {
      setUncontrolled(next);
    }
    onChange?.(next);
    setCursor(date);
    setView("days");
    setOpen(false);
  }

  function shiftCursor(amount: number): void {
    if (view === "days") {
      setCursor((current) => addMonths(current, amount));
      return;
    }
    if (view === "months") {
      setCursor((current) => addYears(current, amount));
      return;
    }
    setCursor((current) => addYears(current, amount * 12));
  }

  const headerLabel =
    view === "days"
      ? format(cursor, "LLLL yyyy", { locale: dfsLocale })
      : view === "months"
        ? format(cursor, "yyyy", { locale: dfsLocale })
        : `${yearStart} – ${yearStart + 11}`;

  const display = selectedIso ? formatPickerDate(selectedIso, locale) : "";

  return (
    <PickerField
      variant={variant}
      size={size}
      gap={gap}
      paddingX={paddingX}
      paddingY={paddingY}
      rounded={rounded}
      minHeight={minHeight}
      label={label}
      placeholder={placeholder ?? t("datePlaceholder")}
      icon={icon ?? <Calendar className="size-3.5" />}
      disabled={disabled}
      required={required}
      id={id}
      name={name}
      className={className}
      display={display}
      hiddenValue={selectedIso}
      isEmpty={!selectedIso}
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (next) {
          setView("days");
          setCursor(selectedDate ?? (centerOn ? parseIsoDate(centerOn) : undefined) ?? today);
        }
      }}
      estimatedHeight={420}
      maxHeightCap={460}
      menuWidth={296}
      triggerRef={triggerRef}
      menuRef={menuRef}
      menu={
        <div className="flex w-70 flex-col gap-3">
          <div className="flex items-center gap-1">
            <button
              type="button"
              className="text-prose hover:bg-option-hover flex size-9 items-center justify-center rounded-lg"
              aria-label={t("previous")}
              onClick={() => shiftCursor(-1)}
            >
              <ChevronLeft className="size-4 rtl:rotate-180" />
            </button>
            <button
              type="button"
              className="text-prose hover:bg-option-hover min-w-0 flex-1 rounded-lg px-2 py-2 text-sm font-semibold"
              onClick={() =>
                setView((current) =>
                  current === "days" ? "months" : current === "months" ? "years" : "days",
                )
              }
            >
              {headerLabel}
            </button>
            <button
              type="button"
              className="text-prose hover:bg-option-hover flex size-9 items-center justify-center rounded-lg"
              aria-label={t("next")}
              onClick={() => shiftCursor(1)}
            >
              <ChevronRight className="size-4 rtl:rotate-180" />
            </button>
          </div>

          {view === "days" ? (
            <div>
              <div className="mb-1 grid grid-cols-7">
                {weekdayLabels.map((day, index) => (
                  <div
                    key={`${index}-${day}`}
                    className="text-prose-muted py-1 text-center text-[0.7rem] font-semibold uppercase"
                  >
                    {day}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-7">
                {days.map((day) => {
                  const iso = toIsoDate(day);
                  const outside = !isSameMonth(day, cursor);
                  const selected = selectedDate ? isSameDay(day, selectedDate) : false;
                  const isToday = isSameDay(day, today);
                  const blocked = isDisabled(day, minDate, maxDate);

                  return (
                    <button
                      key={iso}
                      type="button"
                      disabled={blocked}
                      className={cn(
                        "mx-auto flex size-9 items-center justify-center rounded-full text-sm font-medium",
                        outside && "text-prose-muted/50",
                        !outside && !selected && "text-prose hover:bg-option-hover",
                        isToday && !selected && "ring-ring ring-1",
                        selected && "bg-primary text-primary-foreground",
                        blocked && "opacity-30",
                      )}
                      onClick={() => commit(day)}
                    >
                      {format(day, "d")}
                    </button>
                  );
                })}
              </div>
            </div>
          ) : null}

          {view === "months" ? (
            <div className="grid grid-cols-3 gap-1">
              {Array.from({ length: 12 }, (_, month) => {
                const date = new Date(cursor.getFullYear(), month, 1);
                const active =
                  selectedDate?.getFullYear() === date.getFullYear() &&
                  selectedDate.getMonth() === month;
                return (
                  <button
                    key={month}
                    type="button"
                    className={cn(
                      "rounded-lg px-2 py-3 text-sm font-medium",
                      active
                        ? "bg-primary text-primary-foreground"
                        : "text-prose hover:bg-option-hover",
                    )}
                    onClick={() => {
                      setCursor(date);
                      setView("days");
                    }}
                  >
                    {format(date, "LLL", { locale: dfsLocale })}
                  </button>
                );
              })}
            </div>
          ) : null}

          {view === "years" ? (
            <div className="grid grid-cols-3 gap-1">
              {years.map((year) => {
                const active = selectedDate?.getFullYear() === year;
                return (
                  <button
                    key={year}
                    type="button"
                    className={cn(
                      "rounded-lg px-2 py-3 text-sm font-medium",
                      active
                        ? "bg-primary text-primary-foreground"
                        : "text-prose hover:bg-option-hover",
                    )}
                    onClick={() => {
                      setCursor(new Date(year, cursor.getMonth(), 1));
                      setView("months");
                    }}
                  >
                    {year}
                  </button>
                );
              })}
            </div>
          ) : null}

          {showToday ? (
            <button
              type="button"
              className="text-primary hover:bg-option-hover self-center rounded-lg px-3 py-1.5 text-sm font-semibold"
              onClick={() => commit(today)}
            >
              {t("today")}
            </button>
          ) : null}
        </div>
      }
    />
  );
}
