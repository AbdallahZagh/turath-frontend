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

/**
 * Shared height of fields, selects, pickers and in-row buttons: 44px below `sm` (touch target),
 * 40px from `sm` up. Defined as `--control-height` in globals.css so every control in a row
 * matches.
 */
export const CONTROL_HEIGHT = "var(--control-height)";

export const CONTROL_SIZE: Record<
  ControlSize,
  { font: string; px: string; py: string; gap: string; minHeight: string }
> = {
  sm: { font: "0.875rem", px: "0.875em", py: "0.35em", gap: "0.35rem", minHeight: CONTROL_HEIGHT },
  md: { font: "1.0625rem", px: "0.875em", py: "0.35em", gap: "0.5rem", minHeight: CONTROL_HEIGHT },
  lg: { font: "1.125rem", px: "3.1em", py: "1.15em", gap: "0.65rem", minHeight: "0px" },
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
    "--control-min-height": minHeight ?? scale.minHeight,
  } as CSSProperties;
}
