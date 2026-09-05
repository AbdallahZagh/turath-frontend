"use client";

import { Minus, Plus, Users } from "lucide-react";
import { useTranslations } from "next-intl";
import {
  useId,
  useState,
  type ChangeEvent,
  type KeyboardEvent,
  type ReactNode,
} from "react";

import { cn } from "@/lib/cn";

import {
  FIELD_BASE,
  FIELD_GROUP_MAIN,
  FIELD_STACK_LABEL,
  FIELD_VARIANT,
} from "./controlClasses";
import { controlStyle, type ControlSize } from "./controlScale";
import type { FieldVariant } from "./field.types";

export type StepperVariant = FieldVariant;
export type StepperSize = ControlSize;

type StepperProps = {
  variant?: StepperVariant;
  size?: StepperSize;
  gap?: string;
  paddingX?: string;
  paddingY?: string;
  rounded?: string;
  minHeight?: string;
  value?: number;
  defaultValue?: number;
  onChange?: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  name?: string;
  label?: string;
  icon?: ReactNode;
  disabled?: boolean;
  required?: boolean;
  id?: string;
  className?: string;
};

const VARIANT_RADIUS: Record<StepperVariant, string> = {
  main: "0.625rem",
  glass: "0.5rem",
  plain: "0.5rem",
};

const BUTTON_VARIANT: Record<StepperVariant, string> = {
  main: [
    "border-field-main-border bg-surface text-prose",
    "hover:border-primary hover:text-prose",
    "dark:border-dust/35 dark:bg-pine dark:hover:border-dust",
  ].join(" "),
  glass: [
    "border-primary/35 bg-glass-control text-prose backdrop-blur-sm",
    "hover:border-primary",
    "dark:border-[var(--glass-highlight)] dark:bg-glass",
  ].join(" "),
  plain: [
    "border-border bg-app text-prose",
    "hover:bg-option-hover",
    "dark:border-plain-edge dark:bg-canopy",
  ].join(" "),
};

const FOCUS_WITHIN: Record<StepperVariant, string> = {
  main: [
    "focus-within:text-prose focus-within:border-primary focus-within:shadow-field",
    "dark:focus-within:text-foam dark:focus-within:border-foam dark:focus-within:shadow-field",
  ].join(" "),
  glass: "",
  plain: [
    "focus-within:shadow-plain-focus",
    "dark:focus-within:shadow-plain-focus",
  ].join(" "),
};

export function Stepper({
  variant = "plain",
  size = "md",
  gap,
  paddingX,
  paddingY,
  rounded,
  minHeight,
  value,
  defaultValue = 1,
  onChange,
  min = 0,
  max = 99,
  step = 1,
  name,
  label,
  icon,
  disabled,
  required,
  id,
  className,
}: StepperProps): ReactNode {
  const t = useTranslations("stepper");
  const generatedId = useId();
  const stepperId = id ?? generatedId;
  const labelId = `${stepperId}-label`;
  const namedLabel = label ?? t("value");
  const isControlled = value !== undefined;
  const [uncontrolled, setUncontrolled] = useState(defaultValue);
  const [draft, setDraft] = useState<string | null>(null);
  const count = isControlled ? value : uncontrolled;
  const shown = draft ?? String(count);
  const live =
    draft !== null && draft !== "" ? Number.parseInt(draft, 10) : count;
  const liveCount = Number.isFinite(live) ? live : count;
  const atMin = liveCount <= min;
  const atMax = liveCount >= max;
  const maxDigits = Math.max(String(max).length, 1);

  const style = controlStyle({
    size,
    paddingX,
    paddingY,
    rounded,
    minHeight,
    defaultRadius: VARIANT_RADIUS[variant],
    gap: variant === "main" ? (gap ?? "0.625rem") : gap,
  });

  function commit(next: number): void {
    const clamped = Math.min(max, Math.max(min, next));
    if (!isControlled) {
      setUncontrolled(clamped);
    }
    onChange?.(clamped);
  }

  function flushDraft(): void {
    if (draft === null) {
      return;
    }
    if (draft === "") {
      setDraft(null);
      return;
    }
    const parsed = Number.parseInt(draft, 10);
    setDraft(null);
    if (Number.isFinite(parsed)) {
      commit(parsed);
    }
  }

  function onDraftChange(event: ChangeEvent<HTMLInputElement>): void {
    const next = event.target.value.replace(/[^\d]/g, "");
    if (next.length > maxDigits) {
      return;
    }
    setDraft(next);
  }

  function onInputKeyDown(event: KeyboardEvent<HTMLInputElement>): void {
    if (event.key === "ArrowDown" || event.key === "ArrowLeft") {
      event.preventDefault();
      setDraft(null);
      commit(liveCount - step);
      return;
    }
    if (event.key === "ArrowUp" || event.key === "ArrowRight") {
      event.preventDefault();
      setDraft(null);
      commit(liveCount + step);
      return;
    }
    if (event.key === "Home") {
      event.preventDefault();
      setDraft(null);
      commit(min);
      return;
    }
    if (event.key === "End") {
      event.preventDefault();
      setDraft(null);
      commit(max);
      return;
    }
    if (event.key === "Enter") {
      event.preventDefault();
      flushDraft();
    }
  }

  const field = (
    <div
      className={cn(
        FIELD_BASE,
        FIELD_VARIANT[variant],
        FOCUS_WITHIN[variant],
        "flex items-center gap-3",
        disabled && "pointer-events-none opacity-40",
      )}
    >
      <span
        className="text-prose-muted flex size-[1.85em] shrink-0 items-center justify-center rounded-full"
        aria-hidden
      >
        {icon ?? <Users className="size-[1.1em]" />}
      </span>
      <input
        id={stepperId}
        type="text"
        inputMode="numeric"
        autoComplete="off"
        enterKeyHint="done"
        name={name}
        required={required}
        disabled={disabled}
        value={shown}
        aria-label={variant === "main" ? undefined : namedLabel}
        aria-labelledby={variant === "main" && label ? labelId : undefined}
        aria-valuenow={liveCount}
        aria-valuemin={min}
        aria-valuemax={max}
        role="spinbutton"
        className="caret-primary min-w-0 flex-1 bg-transparent text-start font-semibold tabular-nums outline-none"
        onChange={onDraftChange}
        onFocus={(event) => event.currentTarget.select()}
        onBlur={flushDraft}
        onKeyDown={onInputKeyDown}
      />
      <div className="flex shrink-0 items-center gap-1.5">
        <button
          type="button"
          tabIndex={-1}
          disabled={disabled || atMin}
          aria-label={t("decrease", { label: namedLabel })}
          className={cn(
            "flex size-[1.85em] items-center justify-center rounded-full border",
            "transition-colors disabled:pointer-events-none disabled:opacity-30",
            BUTTON_VARIANT[variant],
          )}
          onMouseDown={(event) => event.preventDefault()}
          onClick={() => {
            setDraft(null);
            commit(liveCount - step);
          }}
        >
          <Minus className="size-[0.85em]" aria-hidden />
        </button>
        <button
          type="button"
          tabIndex={-1}
          disabled={disabled || atMax}
          aria-label={t("increase", { label: namedLabel })}
          className={cn(
            "flex size-[1.85em] items-center justify-center rounded-full border",
            "transition-colors disabled:pointer-events-none disabled:opacity-30",
            BUTTON_VARIANT[variant],
          )}
          onMouseDown={(event) => event.preventDefault()}
          onClick={() => {
            setDraft(null);
            commit(liveCount + step);
          }}
        >
          <Plus className="size-[0.85em]" aria-hidden />
        </button>
      </div>
    </div>
  );

  if (variant === "main") {
    return (
      <div className={cn(FIELD_GROUP_MAIN, className)} style={style}>
        {field}
        {label ? (
          <label className={FIELD_STACK_LABEL} htmlFor={stepperId} id={labelId}>
            {label}
          </label>
        ) : null}
      </div>
    );
  }

  return (
    <div className={cn("w-full", className)} style={style}>
      {field}
    </div>
  );
}
