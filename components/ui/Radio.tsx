import type { InputHTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/cn";

import { controlStyle, type ControlScaleProps } from "./controlScale";

type RadioProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "type" | "className" | "size"
> &
  ControlScaleProps & {
    className?: string;
  };

const RADIO = [
  "appearance-none [-webkit-appearance:none] grid size-[1.25em] place-content-center",
  "m-0 box-border shrink-0 cursor-pointer",
  "text-[length:var(--control-font-size)] rounded-(--control-radius)",
  "bg-field-main border-2 border-field-main-border",
  "transition-[border-color,background-color,box-shadow] duration-150",
  "motion-reduce:transition-none",
  "after:size-[0.55em] after:rounded-full after:bg-primary after:content-['']",
  "after:scale-0 after:transition-transform after:duration-150",
  "checked:border-primary checked:after:scale-100",
  "focus-visible:outline-ring focus-visible:outline-2 focus-visible:outline-offset-[3px]",
  "disabled:pointer-events-none disabled:opacity-40",
  "dark:bg-field-main dark:border-field-main-border dark:after:bg-foam",
].join(" ");

export function Radio({
  className,
  size,
  gap,
  paddingX,
  paddingY,
  rounded,
  ...rest
}: RadioProps): ReactNode {
  return (
    <input
      type="radio"
      className={cn(RADIO, className)}
      style={controlStyle({
        size,
        gap,
        paddingX,
        paddingY,
        rounded,
        defaultRadius: "9999px",
      })}
      {...rest}
    />
  );
}
