import { useId, type ReactNode, type TextareaHTMLAttributes } from "react";

import { cn } from "@/lib/cn";

import {
  FIELD_BASE,
  FIELD_GROUP_MAIN,
  FIELD_ICON_PADDING,
  FIELD_ICON_SLOT,
  FIELD_STACK_LABEL,
  FIELD_VARIANT,
} from "./controlClasses";
import { controlStyle, type ControlSize } from "./controlScale";
import type { FieldVariant } from "./field.types";

export type TextareaVariant = FieldVariant;
export type TextareaSize = ControlSize;

type TextareaProps = Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "className"> & {
  variant?: TextareaVariant;
  size?: TextareaSize;
  gap?: string;
  paddingX?: string;
  paddingY?: string;
  rounded?: string;
  minHeight?: string;
  label?: string;
  /** Leading icon (main variant), level with the first line of text. */
  icon?: ReactNode;
  className?: string;
};

/**
 * Top-aligned icon: starts below the main field's 2px border and top padding and is one text
 * line tall (FIELD_BASE line-height 1.2), so it is centred on the first line, not the box.
 */
const FIRST_LINE_ICON =
  "top-[calc(var(--control-py)+2px)] h-[calc(var(--control-font-size)*1.2)]";

const VARIANT_RADIUS: Record<TextareaVariant, string> = {
  main: "0.625rem",
  glass: "0.5rem",
  plain: "0.5rem",
};

export function Textarea({
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
  rows = 3,
  ...rest
}: TextareaProps): ReactNode {
  const generatedId = useId();
  const textareaId = id ?? generatedId;
  const style = controlStyle({
    size,
    paddingX,
    paddingY,
    rounded,
    minHeight: minHeight ?? "6.5rem",
    defaultRadius: VARIANT_RADIUS[variant],
    gap: variant === "main" ? (gap ?? "0.625rem") : gap,
  });

  if (variant === "main") {
    return (
      <div className={cn(FIELD_GROUP_MAIN, className)} style={style}>
        <div className="relative">
          <textarea
            {...rest}
            id={textareaId}
            rows={rows}
            className={cn(
              FIELD_BASE,
              FIELD_VARIANT.main,
              "min-h-(--control-min-height) resize-y",
              icon && FIELD_ICON_PADDING,
            )}
            placeholder={placeholder}
            disabled={disabled}
            aria-label={label}
          />
          {icon ? (
            <span aria-hidden className={cn(FIELD_ICON_SLOT, FIRST_LINE_ICON)}>
              {icon}
            </span>
          ) : null}
        </div>
        {label ? (
          <label className={FIELD_STACK_LABEL} htmlFor={textareaId}>
            {label}
          </label>
        ) : null}
      </div>
    );
  }

  return (
    <textarea
      {...rest}
      id={textareaId}
      rows={rows}
      style={style}
      disabled={disabled}
      placeholder={placeholder}
      aria-label={label ?? placeholder}
      className={cn(
        FIELD_BASE,
        FIELD_VARIANT[variant],
        "min-h-(--control-min-height) resize-y",
        className,
      )}
    />
  );
}
