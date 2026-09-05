import type { CSSProperties } from "react";

export type ControlSize = "sm" | "md" | "lg";

export type ControlScaleProps = {
  size?: ControlSize;
  gap?: string;
  paddingX?: string;
  paddingY?: string;
  rounded?: string;
  minHeight?: string;
};

export const CONTROL_SIZE: Record<
  ControlSize,
  { font: string; px: string; py: string; gap: string }
> = {
  sm: { font: "0.875rem", px: "1.6em", py: "0.7em", gap: "0.35rem" },
  md: { font: "1.0625rem", px: "2.7em", py: "1em", gap: "0.5rem" },
  lg: { font: "1.125rem", px: "3.1em", py: "1.15em", gap: "0.65rem" },
};

type ControlStyleOptions = {
  size?: ControlSize;
  gap?: string;
  paddingX?: string;
  paddingY?: string;
  rounded?: string;
  minHeight?: string;
  defaultRadius: string;
};

export function controlStyle({
  size = "md",
  gap,
  paddingX,
  paddingY,
  rounded,
  minHeight,
  defaultRadius,
}: ControlStyleOptions): CSSProperties {
  const scale = CONTROL_SIZE[size];

  return {
    "--control-font-size": scale.font,
    "--control-px": paddingX ?? scale.px,
    "--control-py": paddingY ?? scale.py,
    "--control-radius": rounded ?? defaultRadius,
    "--control-gap": gap ?? scale.gap,
    "--control-min-height": minHeight ?? "0px",
  } as CSSProperties;
}
