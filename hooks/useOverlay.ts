"use client";

import {
  useEffect,
  useRef,
  type KeyboardEvent as ReactKeyboardEvent,
  type RefObject,
} from "react";

import { focusableElements, trapTab } from "@/lib/dom/focusable";

type UseOverlayOptions = {
  open: boolean;
  onClose: () => void;
  panelRef: RefObject<HTMLElement | null>;
};

export function useOverlay({
  open,
  onClose,
  panelRef,
}: UseOverlayOptions): {
  onPanelKeyDown: (event: ReactKeyboardEvent<HTMLElement>) => void;
} {
  const triggerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) {
      return;
    }

    triggerRef.current =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const frame = requestAnimationFrame(() => {
      focusableElements(panelRef?.current ?? document.body)[0]?.focus();
    });

    function onKeyDown(event: KeyboardEvent): void {
      if (event.key === "Escape") {
        onClose();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => {
      cancelAnimationFrame(frame);
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
      triggerRef.current?.focus();
    };
  }, [open, onClose, panelRef]);

  function onPanelKeyDown(event: ReactKeyboardEvent<HTMLElement>): void {
    if (event.key !== "Tab" || !panelRef.current) {
      return;
    }
    trapTab(event, panelRef.current);
  }

  return { onPanelKeyDown };
}
