"use client";

import { Clock } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useMemo, useRef, useState, type ReactNode } from "react";

import {
  formatPickerTime,
  parseHHmm,
  toHHmm,
  type HourCycle,
} from "@/lib/format/datetime";
import { isLocale } from "@/i18n/config";

import type { ControlSize } from "./controlScale";
import type { FieldVariant } from "./field.types";
import { PickerField } from "./PickerField";
import { WheelColumn, type WheelItem } from "./WheelColumn";

export type TimePickerVariant = FieldVariant;
export type TimePickerSize = ControlSize;

type TimePickerProps = {
  variant?: TimePickerVariant;
  size?: TimePickerSize;
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
  hourCycle?: HourCycle;
  minuteStep?: number;
};

function pad2(n: number): string {
  return String(n).padStart(2, "0");
}

function to12Hour(hours: number): { hour: number; period: "am" | "pm" } {
  const period = hours >= 12 ? "pm" : "am";
  const hour = hours % 12 === 0 ? 12 : hours % 12;
  return { hour, period };
}

function from12Hour(hour: number, period: "am" | "pm"): number {
  if (period === "am") {
    return hour === 12 ? 0 : hour;
  }
  return hour === 12 ? 12 : hour + 12;
}

function buildMinutes(step: number): WheelItem[] {
  const safe = step > 0 && step <= 30 ? step : 1;
  const items: WheelItem[] = [];
  for (let minute = 0; minute < 60; minute += safe) {
    items.push({ value: String(minute), label: pad2(minute) });
  }
  return items;
}

export function TimePicker({
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
  hourCycle,
  minuteStep = 1,
}: TimePickerProps): ReactNode {
  const t = useTranslations("picker");
  const rawLocale = useLocale();
  const locale = isLocale(rawLocale) ? rawLocale : "en";
  const cycle = hourCycle ?? "12";
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [uncontrolled, setUncontrolled] = useState(defaultValue);

  const selected = value ?? uncontrolled;
  const parsed = parseHHmm(selected);
  const hours = parsed?.hours ?? 12;
  const minutes = parsed?.minutes ?? 0;
  const twelve = to12Hour(hours);

  const minuteItems = useMemo(() => buildMinutes(minuteStep), [minuteStep]);
  const hourItems = useMemo<WheelItem[]>(() => {
    if (cycle === "24") {
      return Array.from({ length: 24 }, (_, hour) => ({
        value: String(hour),
        label: pad2(hour),
      }));
    }
    return Array.from({ length: 12 }, (_, index) => {
      const hour = index + 1;
      return { value: String(hour), label: String(hour) };
    });
  }, [cycle]);

  const periodItems = useMemo<WheelItem[]>(
    () => [
      { value: "am", label: t("am") },
      { value: "pm", label: t("pm") },
    ],
    [t],
  );

  function commit(nextHours: number, nextMinutes: number): void {
    const nearest =
      minuteItems.reduce((best, item) => {
        const candidate = Number(item.value);
        return Math.abs(candidate - nextMinutes) < Math.abs(best - nextMinutes)
          ? candidate
          : best;
      }, Number(minuteItems[0]?.value ?? 0));
    const next = toHHmm(nextHours, nearest);
    if (value === undefined) {
      setUncontrolled(next);
    }
    onChange?.(next);
  }

  const display = selected
    ? formatPickerTime(selected, locale, cycle)
    : "";

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
      placeholder={placeholder ?? t("timePlaceholder")}
      icon={icon ?? <Clock className="size-3.5" />}
      disabled={disabled}
      required={required}
      id={id}
      name={name}
      className={className}
      display={display}
      hiddenValue={selected}
      isEmpty={!selected}
      open={open}
      onOpenChange={setOpen}
      estimatedHeight={260}
      maxHeightCap={280}
      menuWidth={cycle === "12" ? 248 : 176}
      triggerRef={triggerRef}
      menuRef={menuRef}
      menu={
        <div className="relative">
          <div
            aria-hidden
            className="bg-option-hover pointer-events-none absolute inset-x-2 top-1/2 z-0 h-10 -translate-y-1/2 rounded-xl"
          />
          <div className="relative z-[1] flex w-max justify-center">
            <WheelColumn
              aria-label={t("hour")}
              items={hourItems}
              value={String(cycle === "12" ? twelve.hour : hours)}
              onChange={(next) => {
                const hourValue = Number(next);
                commit(
                  cycle === "12" ? from12Hour(hourValue, twelve.period) : hourValue,
                  minutes,
                );
              }}
            />
            <WheelColumn
              aria-label={t("minute")}
              items={minuteItems}
              value={String(
                minuteItems.reduce((best, item) => {
                  const candidate = Number(item.value);
                  return Math.abs(candidate - minutes) < Math.abs(best - minutes)
                    ? candidate
                    : best;
                }, Number(minuteItems[0]?.value ?? 0)),
              )}
              onChange={(next) => commit(hours, Number(next))}
            />
            {cycle === "12" ? (
              <WheelColumn
                aria-label={t("period")}
                className="w-18"
                items={periodItems}
                value={twelve.period}
                onChange={(next) =>
                  commit(from12Hour(twelve.hour, next as "am" | "pm"), minutes)
                }
              />
            ) : null}
          </div>
        </div>
      }
    />
  );
}
