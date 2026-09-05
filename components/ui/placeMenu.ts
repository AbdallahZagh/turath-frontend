import type { CSSProperties } from "react";

const MENU_OFFSET_PX = 8;
const VIEWPORT_MARGIN_PX = 8;

type PlaceAnchoredMenuOptions = {
  estimatedHeight: number;
  maxHeightCap?: number;
  width?: number | "max-content";
  minWidth?: number;
  align?: "start" | "end";
};

export function placeAnchoredMenu(
  trigger: HTMLElement,
  {
    estimatedHeight,
    maxHeightCap = 256,
    width = "max-content",
    minWidth,
    align = "start",
  }: PlaceAnchoredMenuOptions,
): CSSProperties {
  const rect = trigger.getBoundingClientRect();
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  const gap = MENU_OFFSET_PX;
  const margin = VIEWPORT_MARGIN_PX;

  const spaceBelow = viewportHeight - rect.bottom - gap - margin;
  const spaceAbove = rect.top - gap - margin;
  const openUp = spaceBelow < estimatedHeight && spaceAbove > spaceBelow;
  const available = Math.max(openUp ? spaceAbove : spaceBelow, 0);
  const maxHeight = Math.min(maxHeightCap, available);
  const maxWidth = Math.max(viewportWidth - margin * 2, 0);
  const floorWidth = Math.min(minWidth ?? rect.width, maxWidth);
  const sizedWidth = width === "max-content" ? floorWidth : Math.min(width, maxWidth);
  const box: CSSProperties = {
    minWidth: floorWidth,
    width,
    maxWidth,
    maxHeight,
  };

  if (width === "max-content" && align === "end") {
    box.left = "auto";
    box.right = Math.max(viewportWidth - rect.right, margin);
  } else {
    let left = align === "end" ? rect.right - sizedWidth : rect.left;
    if (left + sizedWidth > viewportWidth - margin) {
      left = viewportWidth - margin - sizedWidth;
    }
    if (left < margin) {
      left = margin;
    }
    box.left = left;
  }

  if (openUp) {
    return {
      ...box,
      top: "auto",
      bottom: viewportHeight - rect.top + gap,
    };
  }

  return {
    ...box,
    top: rect.bottom + gap,
    bottom: "auto",
  };
}
