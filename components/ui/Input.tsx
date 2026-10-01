"use client";

import { useLocale } from "next-intl";
import {
  useId,
  useState,
  type ChangeEvent,
  type FocusEvent,
  type InputHTMLAttributes,
  type ReactNode,
} from "react";

import { cn } from "@/lib/cn";
import { normalizeNumberInput, parseNumberInput, toDisplayDigits } from "@/lib/format/digits";
import { formatCount } from "@/lib/format/number";

import {
  FIELD_BASE,
  FIELD_GROUP_MAIN,
  FIELD_STACK_LABEL,
  FIELD_VARIANT,
} from "./controlClasses";
import { controlStyle, type ControlSize } from "./controlScale";
import type { FieldVariant } from "./field.types";

export type InputVariant = FieldVariant;
export type InputSize = ControlSize;

type InputProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "className" | "size"
> & {
  variant?: InputVariant;
  size?: InputSize;
  gap?: string;
  paddingX?: string;
  paddingY?: string;
  rounded?: string;
  minHeight?: string;
  label?: string;
  /** Leading icon (main variant). The text starts after it, lined up with Select and DatePicker. */
  icon?: ReactNode;
  className?: string;
  /**
   * Money amount (controlled `value`): shows grouped display digits (1,500,000 / ١٬٥٠٠٬٠٠٠)
   * when blurred and plain digits while focused. The field width never changes.
   */
  amount?: boolean;
};

/** Room for a 1rem icon plus the control gap, same as the Select trigger. */
const FIELD_ICON_PADDING = "ps-[calc(var(--control-px)+1rem+var(--control-gap))]";

const VARIANT_RADIUS: Record<InputVariant, string> = {
  main: "0.625rem",
  glass: "0.5rem",
  plain: "0.5rem",
};

export function Input({
  variant = "plain",
  size = "md",
  gap,
  paddingX,
  paddingY,
  rounded,
  minHeight,
  label,
  icon,
  className,
  id,
  placeholder,
  disabled,
  amount = false,
  ...fieldProps
}: InputProps): ReactNode {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const locale = useLocale();
  const [focusedText, setFocusedText] = useState<string | null>(null);
  const rest = numberFieldProps(fieldProps, amount, locale, focusedText, setFocusedText);
  const style = controlStyle({
    size,
    paddingX,
    paddingY,
    rounded,
    minHeight,
    defaultRadius: VARIANT_RADIUS[variant],
    gap: variant === "main" ? (gap ?? "0.625rem") : gap,
  });

  if (variant === "main") {
    return (
      <div className={cn(FIELD_GROUP_MAIN, className)} style={style}>
        <div className="relative">
          <input
            {...rest}
            id={inputId}
            className={cn(FIELD_BASE, FIELD_VARIANT.main, icon && FIELD_ICON_PADDING)}
            placeholder={placeholder}
            disabled={disabled}
            aria-label={label}
          />
          {icon ? (
            <span
              aria-hidden
              className="text-prose-muted pointer-events-none absolute inset-y-0 start-(--control-px) z-[6] inline-flex items-center"
            >
              {icon}
            </span>
          ) : null}
        </div>
        {label ? (
          <label className={FIELD_STACK_LABEL} htmlFor={inputId}>
            {label}
          </label>
        ) : null}
      </div>
    );
  }

  return (
    <input
      {...rest}
      id={inputId}
      style={style}
      disabled={disabled}
      placeholder={placeholder}
      aria-label={label ?? placeholder}
      className={cn(FIELD_BASE, FIELD_VARIANT[variant], className)}
    />
  );
}

type FieldProps = Omit<InputHTMLAttributes<HTMLInputElement>, "className" | "size">;

/**
 * Number fields are text fields: browsers reject Arabic or Persian digits in `type="number"`.
 * Controlled number fields show display digits when not focused (docs/PAGES.md §0, "Digits").
 * What the person types is never rewritten while they type; forms read it with
 * `parseNumberInput` (lib/format/digits.ts) before validating or saving.
 */
function numberFieldProps(
  props: FieldProps,
  amount: boolean,
  locale: string,
  focusedText: string | null,
  setFocusedText: (text: string | null) => void,
): FieldProps {
  if (props.type !== "number" && !amount) {
    return props;
  }
  const { step, inputMode, ...rest } = props;
  // Browser number limits do not apply to a text field; forms validate the parsed value instead.
  delete rest.type;
  delete rest.min;
  delete rest.max;
  const decimal = step === "any" || (step !== undefined && !Number.isInteger(Number(step)));
  const field: FieldProps = {
    ...rest,
    type: "text",
    inputMode: inputMode ?? (decimal ? "decimal" : "numeric"),
    autoComplete: rest.autoComplete ?? "off",
  };
  // Uncontrolled fields (React Hook Form `register`) show exactly what the browser holds.
  if (rest.value === undefined) {
    return field;
  }
  // Controlled fields show display digits (Arabic-Indic in Arabic) when not being edited.
  const raw = String(rest.value);
  const parsed = parseNumberInput(raw, { decimal, negative: true });
  const plain = parsed === undefined ? raw : toDisplayDigits(normalizeNumberInput(raw), locale);
  const blurred = parsed !== undefined && amount ? formatCount(parsed, locale) : plain;
  return {
    ...field,
    value: focusedText ?? blurred,
    onFocus: (event: FocusEvent<HTMLInputElement>) => {
      setFocusedText(plain);
      rest.onFocus?.(event);
    },
    onChange: (event: ChangeEvent<HTMLInputElement>) => {
      setFocusedText(event.target.value);
      rest.onChange?.(event);
    },
    onBlur: (event: FocusEvent<HTMLInputElement>) => {
      setFocusedText(null);
      rest.onBlur?.(event);
    },
  };
}
