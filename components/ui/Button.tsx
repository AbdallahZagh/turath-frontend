import Link from "next/link";
import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";

import { cn } from "@/lib/cn";

import { controlStyle, type ControlSize } from "./controlScale";

export type ButtonVariant = "solid" | "glass" | "outline" | "destructive";
export type ButtonSize = ControlSize;

type ButtonProps = {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  gap?: string;
  paddingX?: string;
  paddingY?: string;
  rounded?: string;
  minHeight?: string;
  className?: string;
  href?: string;
  onClick?: () => void;
  "aria-label"?: string;
  "aria-expanded"?: boolean;
  "aria-haspopup"?: ButtonHTMLAttributes<HTMLButtonElement>["aria-haspopup"];
} & Pick<ButtonHTMLAttributes<HTMLButtonElement>, "type" | "disabled" | "aria-current">;

const VARIANT_RADIUS: Record<ButtonVariant, string> = {
  solid: "0.6em",
  glass: "0.5rem",
  outline: "0.9375em",
  destructive: "0.9375em",
};

const BUTTON_BASE = [
  "group relative inline-flex items-center justify-center",
  "cursor-pointer border-0 font-sans font-medium text-inherit no-underline select-none",
  "text-[length:var(--control-font-size)] leading-[1.2]",
  "gap-(--control-gap) px-(--control-px) py-(--control-py) rounded-(--control-radius)",
  "min-h-(--control-min-height) box-border",
  "[-webkit-tap-highlight-color:transparent]",
  "focus-visible:outline-ring focus-visible:outline-2 focus-visible:outline-offset-[3px]",
  "disabled:pointer-events-none disabled:opacity-40",
].join(" ");

const BUTTON_VARIANT: Record<ButtonVariant, string> = {
  solid: "overflow-hidden bg-primary text-primary-foreground active:scale-[0.97]",
  glass: [
    "text-prose bg-glass-control shadow-[inset_0_1px_0_var(--glass-highlight)] backdrop-blur-sm",
    "active:scale-[0.97]",
    "dark:bg-glass dark:shadow-none",
  ].join(" "),
  outline: [
    "bg-transparent font-semibold text-prose border-[0.125em] border-solid border-prose",
    "transition-[color,background-color,border-color] duration-300 ease-[cubic-bezier(0.23,1,0.32,1)]",
    "hover:bg-primary hover:text-primary-foreground hover:border-primary",
    "active:bg-primary active:text-primary-foreground",
    "motion-reduce:transition-none",
  ].join(" "),
  destructive: [
    "bg-transparent font-semibold text-destructive border-[0.125em] border-solid border-destructive",
    "transition-[color,background-color,border-color] duration-300 ease-[cubic-bezier(0.23,1,0.32,1)]",
    "hover:bg-destructive hover:text-destructive-foreground hover:border-destructive",
    "active:bg-destructive active:text-destructive-foreground",
    "motion-reduce:transition-none",
  ].join(" "),
};

const FRAME =
  "pointer-events-none absolute z-[11] block w-1/2 border-0 border-solid border-primary transition-[height] duration-300 motion-reduce:transition-none dark:border-[var(--glass-highlight)]";

function ButtonChrome({
  variant,
  children,
}: {
  variant: ButtonVariant;
  children: ReactNode;
}): ReactNode {
  return (
    <>
      {variant === "solid" ? (
        <>
          <span
            aria-hidden
            className="bg-blob pointer-events-none absolute top-1/2 left-1/2 z-0 size-0 -translate-x-1/2 -translate-y-1/2 rounded-full transition-[width,height] duration-500 ease-out group-hover:h-[250%] group-hover:w-[250%] motion-reduce:transition-none motion-reduce:group-hover:size-0"
          />
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 z-[1] mt-[-0.25em] rounded-(--control-radius) bg-[image:var(--btn-shade)]"
          />
        </>
      ) : null}
      {variant === "glass" ? (
        <>
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 overflow-hidden rounded-(--control-radius)"
          >
            <span className="bg-shine absolute start-[-75%] top-0 z-10 h-full w-1/2 rotate-12 blur-lg transition-[inset-inline-start] duration-1000 ease-in-out group-hover:start-[125%] motion-reduce:transition-none motion-reduce:group-hover:start-[-75%]" />
          </span>
          <span
            aria-hidden
            className={cn(FRAME, "start-0 top-0 h-[20%] rounded-ss-(--control-radius) border-s-2 border-t-2")}
          />
          <span
            aria-hidden
            className={cn(
              FRAME,
              "end-0 top-0 h-[60%] rounded-se-(--control-radius) border-e-2 border-t-2 group-hover:h-[90%]",
            )}
          />
          <span
            aria-hidden
            className={cn(
              FRAME,
              "start-0 bottom-0 h-[60%] rounded-es-(--control-radius) border-s-2 border-b-2 group-hover:h-[90%]",
            )}
          />
          <span
            aria-hidden
            className={cn(FRAME, "end-0 bottom-0 h-[20%] rounded-ee-(--control-radius) border-e-2 border-b-2")}
          />
        </>
      ) : null}
      <span className="relative z-20 inline-flex items-center gap-(--control-gap) group-data-[variant=solid]:-top-px">
        {children}
      </span>
    </>
  );
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    children,
    variant = "solid",
    size = "md",
    gap,
    paddingX,
    paddingY,
    rounded,
    minHeight,
    className,
    type = "button",
    href,
    onClick,
    disabled,
    "aria-label": ariaLabel,
    "aria-current": ariaCurrent,
    "aria-expanded": ariaExpanded,
    "aria-haspopup": ariaHaspopup,
  },
  ref,
): ReactNode {
  const style = controlStyle({
    size,
    gap,
    paddingX,
    paddingY,
    rounded,
    minHeight,
    defaultRadius: VARIANT_RADIUS[variant],
  });
  const classes = cn(BUTTON_BASE, BUTTON_VARIANT[variant], className);

  if (href) {
    const chrome = <ButtonChrome variant={variant}>{children}</ButtonChrome>;
    const linkProps = {
      href,
      "data-variant": variant,
      style,
      className: classes,
      onClick,
      "aria-label": ariaLabel,
      "aria-current": ariaCurrent,
    } as const;

    if (href.startsWith("#") || href.startsWith("/#")) {
      return <a {...linkProps}>{chrome}</a>;
    }

    return <Link {...linkProps}>{chrome}</Link>;
  }

  return (
    <button
      ref={ref}
      type={type}
      data-variant={variant}
      style={style}
      className={classes}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      aria-current={ariaCurrent}
      aria-expanded={ariaExpanded}
      aria-haspopup={ariaHaspopup}
    >
      <ButtonChrome variant={variant}>{children}</ButtonChrome>
    </button>
  );
});
