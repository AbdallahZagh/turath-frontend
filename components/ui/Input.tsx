import { useId, type InputHTMLAttributes, type ReactNode } from "react";

import { cn } from "@/lib/cn";

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
  ...rest
}: InputProps): ReactNode {
  const generatedId = useId();
  const inputId = id ?? generatedId;
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
