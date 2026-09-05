"use client";

import {
  useId,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from "react";

import { cn } from "@/lib/cn";

import {
  SEGMENT_BASE,
  SEGMENT_CHECKED,
  SEGMENT_OPTION,
  SEGMENT_THUMB,
  SEGMENT_VARIANT,
} from "./controlClasses";
import {
  controlStyle,
  CONTROL_SIZE,
  type ControlScaleProps,
  type ControlSize,
} from "./controlScale";
import type { InputVariant } from "./Input";

export type SegmentSwitchVariant = InputVariant;
export type SegmentSwitchSize = ControlSize;

export type SegmentOption = {
  value: string;
  label: string;
  icon?: ReactNode;
  disabled?: boolean;
};

type SegmentSwitchProps = ControlScaleProps & {
  variant?: SegmentSwitchVariant;
  options: SegmentOption[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  name?: string;
  disabled?: boolean;
  id?: string;
  className?: string;
  "aria-label"?: string;
};

const VARIANT_RADIUS: Record<SegmentSwitchVariant, string> = {
  main: "0.625rem",
  glass: "0.5rem",
  plain: "0.5rem",
};

function enabledIndexes(options: SegmentOption[]): number[] {
  return options.flatMap((option, index) => (option.disabled ? [] : [index]));
}

export function SegmentSwitch({
  variant = "plain",
  size,
  gap,
  paddingX,
  paddingY,
  rounded,
  minHeight,
  options,
  value,
  defaultValue,
  onChange,
  name,
  disabled,
  id,
  className,
  "aria-label": ariaLabel,
}: SegmentSwitchProps): ReactNode {
  const generatedId = useId();
  const groupId = id ?? generatedId;
  const selectable = enabledIndexes(options);
  const fallback = options[selectable[0] ?? 0]?.value ?? "";
  const [uncontrolled, setUncontrolled] = useState(defaultValue ?? fallback);
  const selectedValue = value ?? uncontrolled;
  const selectedIndex = Math.max(
    options.findIndex((option) => option.value === selectedValue),
    0,
  );

  const count = Math.max(options.length, 1);
  const scale = CONTROL_SIZE[size ?? "md"];
  const style = controlStyle({
    size,
    gap,
    paddingX: paddingX ?? (size === "sm" ? "1.25em" : size === "lg" ? "1.5em" : "1.35em"),
    paddingY: paddingY ?? scale.py,
    rounded,
    minHeight,
    defaultRadius: VARIANT_RADIUS[variant],
  });

  function focusOption(optionValue: string): void {
    const optionButton = document.querySelector<HTMLElement>(
      `#${CSS.escape(groupId)} [data-value="${CSS.escape(optionValue)}"]`,
    );
    optionButton?.focus();
  }

  function commit(next: string): void {
    if (value === undefined) {
      setUncontrolled(next);
    }
    onChange?.(next);
  }

  function move(direction: 1 | -1): void {
    if (selectable.length === 0) {
      return;
    }

    const currentPos = selectable.indexOf(selectedIndex);
    const start = currentPos === -1 ? (direction === 1 ? -1 : 0) : currentPos;
    const nextPos =
      (start + direction + selectable.length) % selectable.length;
    const next = selectable[nextPos];
    const option = next === undefined ? undefined : options[next];

    if (option) {
      commit(option.value);
      focusOption(option.value);
    }
  }

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>): void {
    if (disabled) {
      return;
    }

    const rtl = getComputedStyle(event.currentTarget).direction === "rtl";
    const goNext =
      event.key === "ArrowDown" ||
      event.key === (rtl ? "ArrowLeft" : "ArrowRight");
    const goPrev =
      event.key === "ArrowUp" ||
      event.key === (rtl ? "ArrowRight" : "ArrowLeft");

    if (goNext) {
      event.preventDefault();
      move(1);
      return;
    }

    if (goPrev) {
      event.preventDefault();
      move(-1);
      return;
    }

    if (event.key === "Home") {
      event.preventDefault();
      const first = selectable[0];
      const option = first === undefined ? undefined : options[first];
      if (option) {
        commit(option.value);
        focusOption(option.value);
      }
      return;
    }

    if (event.key === "End") {
      event.preventDefault();
      const last = selectable[selectable.length - 1];
      const option = last === undefined ? undefined : options[last];
      if (option) {
        commit(option.value);
        focusOption(option.value);
      }
    }
  }

  return (
    <div
      id={groupId}
      role="radiogroup"
      aria-label={ariaLabel}
      aria-disabled={disabled}
      className={cn(
        SEGMENT_BASE,
        SEGMENT_VARIANT[variant],
        "aria-disabled:pointer-events-none aria-disabled:opacity-40",
        className,
      )}
      style={style}
      onKeyDown={onKeyDown}
    >
      {options.length > 0 ? (
        <span
          aria-hidden
          className={cn(
            "pointer-events-none absolute inset-y-[0.22em] z-0 rounded-[calc(var(--control-radius)-0.12em)]",
            "transition-[inset-inline-start] duration-200 motion-reduce:transition-none",
            SEGMENT_THUMB[variant],
          )}
          style={{
            insetInlineStart: `calc(0.22em + ${selectedIndex} * (100% - 0.44em) / ${count})`,
            width: `calc((100% - 0.44em) / ${count})`,
          }}
        />
      ) : null}
      {options.map((option) => {
        const isSelected = option.value === selectedValue;

        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            className={cn(SEGMENT_OPTION, SEGMENT_CHECKED[variant])}
            data-value={option.value}
            aria-checked={isSelected}
            disabled={disabled || option.disabled}
            tabIndex={isSelected ? 0 : -1}
            onClick={() => commit(option.value)}
          >
            <span className="inline-flex items-center justify-center gap-1.5">
              {option.icon}
              <span>{option.label}</span>
            </span>
          </button>
        );
      })}
      {name !== undefined ? (
        <input type="hidden" name={name} value={selectedValue} />
      ) : null}
    </div>
  );
}
