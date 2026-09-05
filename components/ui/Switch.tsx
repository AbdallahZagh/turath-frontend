import type { InputHTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/cn";

import { controlStyle, type ControlScaleProps } from "./controlScale";

type SwitchProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "type" | "className" | "size"
> &
  ControlScaleProps & {
    className?: string;
    /** Shrinks the track to sit inside a sm text field. */
    compact?: boolean;
  };

export function Switch({
  className,
  size,
  gap,
  paddingX,
  paddingY,
  rounded,
  compact = false,
  ...rest
}: SwitchProps): ReactNode {
  return (
    <label
      className={cn(
        "relative inline-block cursor-pointer text-[length:var(--control-font-size)]",
        compact ? "h-[1.2em] w-[2.1em]" : "h-[2em] w-[3.5em]",
        className,
      )}
      style={controlStyle({
        size,
        gap,
        paddingX,
        paddingY,
        rounded,
        defaultRadius: "30px",
      })}
    >
      <input
        type="checkbox"
        role="switch"
        className="peer absolute inset-0 z-[1] m-0 size-full cursor-pointer opacity-0 disabled:cursor-not-allowed"
        {...rest}
      />
      <span
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-0 rounded-(--control-radius)",
          "border border-switch-track-border bg-switch-track",
          "transition-[background-color,border-color,box-shadow] duration-[400ms]",
          "motion-reduce:transition-none",
          "before:absolute before:rounded-full before:bg-switch-knob before:content-['']",
          "before:transition-[inset-inline-start,background-color] before:duration-[400ms]",
          "peer-checked:border-switch-track-on-border peer-checked:bg-switch-track-on",
          "peer-checked:before:bg-switch-knob-on",
          "peer-focus-visible:shadow-switch-focus",
          "peer-disabled:opacity-40",
          compact
            ? [
                "before:start-[0.14em] before:bottom-[0.12em] before:size-[0.9em]",
                "peer-checked:before:start-[calc(100%-1.04em)]",
              ].join(" ")
            : [
                "before:start-[0.27em] before:bottom-[0.25em] before:size-[1.4em]",
                "peer-checked:before:start-[calc(100%-1.67em)]",
              ].join(" "),
        )}
      />
    </label>
  );
}
