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
  className?: string;
};

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
        <input
          {...rest}
          id={inputId}
          className={cn(FIELD_BASE, FIELD_VARIANT.main)}
          placeholder={placeholder}
          disabled={disabled}
          aria-label={label}
        />
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
