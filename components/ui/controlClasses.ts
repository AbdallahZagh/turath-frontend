import type { FieldVariant } from "./field.types";

const CONTROL_TYPE =
  "font-sans text-[length:var(--control-font-size)] leading-[1.2] rounded-(--control-radius)";

const CONTROL_PAD = "px-(--control-px) py-(--control-py)";

export const FIELD_BASE = [
  CONTROL_TYPE,
  CONTROL_PAD,
  "box-border block w-full caret-primary min-h-(--control-min-height)",
  "disabled:pointer-events-none disabled:opacity-40",
  "placeholder:text-prose-muted",
].join(" ");

export const FIELD_VARIANT: Record<FieldVariant, string> = {
  glass: [
    "appearance-none text-prose caret-prose bg-glass-control backdrop-blur-sm",
    "border border-glass-border outline-none",
    "shadow-[inset_0_1px_0_var(--glass-highlight)]",
    "field-autofill-glass",
    "transition-[border-color,box-shadow] duration-150 motion-reduce:transition-none",
    "focus:border-primary focus:shadow-field",
    "aria-expanded:border-primary aria-expanded:shadow-field",
    "dark:bg-glass dark:shadow-none dark:border-glass-border",
    "dark:focus:border-foam dark:aria-expanded:border-foam",
  ].join(" "),
  main: [
    "z-[5] text-prose-muted bg-field-main border-2 border-field-main-border outline-none",
    "transition-[color,border-color,box-shadow] duration-300 motion-reduce:transition-none",
    "placeholder:transition-colors placeholder:duration-500",
    "focus:text-prose focus:border-primary focus:shadow-field",
    "focus:placeholder:text-prose-muted",
    "aria-expanded:text-prose aria-expanded:border-primary aria-expanded:shadow-field",
    "data-[empty=true]:text-prose-muted",
    "data-[empty=true]:focus:text-prose-muted",
    "data-[empty=true]:aria-expanded:text-prose-muted",
    "dark:text-dust dark:placeholder:text-dust",
    "dark:focus:text-foam dark:focus:border-foam dark:focus:shadow-field",
    "dark:aria-expanded:text-foam dark:aria-expanded:border-foam",
    "dark:data-[empty=true]:text-dust",
  ].join(" "),
  plain: [
    "text-prose bg-app-muted border border-border outline-none",
    "transition-[box-shadow,border-color] duration-150 motion-reduce:transition-none",
    "focus:border-border focus:shadow-plain-focus",
    "dark:bg-pine dark:border-plain-edge",
    "dark:focus:border-plain-edge dark:focus:shadow-plain-focus",
  ].join(" "),
};

export const FIELD_GROUP_MAIN = [
  "flex w-full flex-col-reverse items-stretch gap-(--control-gap)",
  "has-[:focus]:[&_label]:text-prose",
  "has-[:focus]:[&_label]:[text-shadow:var(--label-glow)]",
  "has-[[aria-expanded=true]]:[&_label]:text-prose",
  "has-[[aria-expanded=true]]:[&_label]:[text-shadow:var(--label-glow)]",
  "dark:has-[:focus]:[&_label]:text-foam",
  "dark:has-[[aria-expanded=true]]:[&_label]:text-foam",
].join(" ");

export const FIELD_STACK_LABEL =
  "m-0 self-start text-start text-[0.9375rem] font-extrabold text-prose-muted transition-[color,text-shadow] duration-300 motion-reduce:transition-none";

export const SELECT_TRIGGER = [
  "flex cursor-pointer appearance-none items-center justify-between gap-(--control-gap)",
  "text-start select-none",
  "transition-[color,background-color,border-color,box-shadow] duration-200",
  "motion-reduce:transition-none",
].join(" ");

export const SELECT_TRIGGER_HOVER: Record<FieldVariant, string> = {
  glass: [
    "hover:bg-glass-control-hover hover:shadow-glass-control-hover",
    "aria-expanded:bg-glass-control-hover aria-expanded:shadow-glass-control-hover",
  ].join(" "),
  main: [
    "hover:text-prose hover:border-primary hover:shadow-field-hover",
    "dark:hover:text-foam dark:hover:border-foam",
  ].join(" "),
  plain: [
    "hover:bg-plain-hover hover:border-plain-hover-border",
    "aria-expanded:bg-plain-hover aria-expanded:border-plain-hover-border",
  ].join(" "),
};

export const SELECT_MENU_BASE = [
  "fixed z-80 m-0 max-h-64 list-none overflow-y-auto box-border p-[0.35rem]",
  "rounded-(--control-radius)",
].join(" ");

export const SELECT_MENU_VARIANT: Record<FieldVariant, string> = {
  glass: [
    "text-prose bg-glass-menu bg-[image:var(--glass-sheen)] border border-glass-border backdrop-blur-sm",
    "shadow-[var(--glass-inset),var(--shadow-glass-value)]",
    "dark:border-glass-border",
  ].join(" "),
  main: [
    "text-prose bg-white border-2 border-primary shadow-field",
    "dark:text-foam dark:bg-pine dark:border-foam",
  ].join(" "),
  plain: [
    "text-prose bg-app-muted border border-border shadow-glass",
    "dark:bg-pine dark:border-plain-edge",
  ].join(" "),
};

export const SELECT_OPTION = [
  "flex w-full cursor-pointer items-center justify-between gap-(--control-gap)",
  "box-border px-(--control-px) py-[0.55em]",
  "rounded-[calc(var(--control-radius)-0.15rem)]",
  "font-sans text-[length:var(--control-font-size)] leading-[1.2] text-start text-inherit",
  "transition-colors duration-150 motion-reduce:transition-none",
  "hover:bg-option-hover data-[active=true]:bg-option-hover",
  "aria-selected:font-semibold",
  "aria-disabled:cursor-not-allowed aria-disabled:opacity-40 aria-disabled:hover:bg-transparent",
].join(" ");

export const SEGMENT_BASE = [
  CONTROL_TYPE,
  "relative inline-grid w-max max-w-full grid-flow-col auto-cols-[minmax(max-content,1fr)] box-border p-[0.22em]",
].join(" ");

export const SEGMENT_VARIANT: Record<FieldVariant, string> = {
  main: [
    "text-prose bg-field-main border-2 border-field-main-border",
    "dark:bg-canopy dark:border-dust/40",
  ].join(" "),
  glass: [
    "text-prose bg-glass-control border border-glass-border backdrop-blur-sm",
    "shadow-[inset_0_1px_0_var(--glass-highlight)]",
    "dark:bg-glass dark:border-glass-border dark:shadow-none",
  ].join(" "),
  plain: [
    "text-prose bg-app-muted border border-border",
    "dark:bg-pine dark:border-dust/30",
  ].join(" "),
};

export const SEGMENT_THUMB: Record<FieldVariant, string> = {
  main: [
    "bg-white border-2 border-primary shadow-field",
    "dark:bg-foam dark:border-foam dark:shadow-none",
  ].join(" "),
  glass: [
    "bg-glass-menu border-2 border-primary shadow-[var(--glass-inset)] backdrop-blur-sm",
    "dark:bg-dust/25 dark:border-dust dark:shadow-none",
  ].join(" "),
  plain: [
    "bg-white border border-border",
    "dark:bg-dust dark:border-dust",
  ].join(" "),
};

export const SEGMENT_CHECKED: Record<FieldVariant, string> = {
  main: "aria-checked:font-semibold aria-checked:text-prose dark:aria-checked:text-ink",
  glass: "aria-checked:font-semibold aria-checked:text-prose dark:aria-checked:text-foam",
  plain: "aria-checked:font-semibold aria-checked:text-prose dark:aria-checked:text-ink",
};

export const SEGMENT_OPTION = [
  CONTROL_PAD,
  "relative z-[1] m-0 cursor-pointer border-0 bg-transparent",
  "font-[inherit] text-[length:inherit] leading-[inherit] font-medium text-center",
  "whitespace-nowrap text-prose-muted dark:text-dust",
  "transition-colors duration-150 hover:text-prose",
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
  "disabled:pointer-events-none disabled:opacity-40",
].join(" ");
