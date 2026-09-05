import type { InputHTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/cn";

import { controlStyle, type ControlScaleProps } from "./controlScale";

type CheckboxProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "type" | "className" | "size"
> &
  ControlScaleProps & {
    className?: string;
  };

const CHECKBOX = [
  "appearance-none [-webkit-appearance:none] grid size-[1.25em] place-content-center",
  "m-0 box-border shrink-0 cursor-pointer",
  "text-[length:var(--control-font-size)] rounded-(--control-radius)",
  "bg-field-main border-2 border-field-main-border",
  "transition-[border-color,background-color,box-shadow] duration-150",
  "motion-reduce:transition-none",
  "after:mb-[0.12em] after:box-border after:h-[0.58em] after:w-[0.32em] after:content-['']",
  "after:border-b-2 after:border-e-2 after:border-primary-foreground",
  "after:origin-center after:scale-0 after:rotate-45 after:transition-transform after:duration-150",
  "checked:border-primary checked:bg-primary checked:after:scale-100",
  "focus-visible:outline-ring focus-visible:outline-2 focus-visible:outline-offset-[3px]",
  "disabled:pointer-events-none disabled:opacity-40",
  "dark:bg-field-main dark:border-field-main-border",
  "dark:checked:border-foam dark:checked:bg-foam dark:checked:after:border-ink",
].join(" ");

export function Checkbox({
  className,
  size,
  gap,
  paddingX,
  paddingY,
  rounded,
  ...rest
}: CheckboxProps): ReactNode {
  return (
    <input
      type="checkbox"
      className={cn(CHECKBOX, className)}
      style={controlStyle({
        size,
        gap,
        paddingX,
        paddingY,
        rounded,
        defaultRadius: "0.3em",
      })}
      {...rest}
    />
  );
}
