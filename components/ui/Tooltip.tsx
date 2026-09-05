"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";

import { useIsClient } from "@/hooks/useIsClient";
import { cn } from "@/lib/cn";

export type TooltipPlacement = "top" | "right" | "bottom" | "left" | "start" | "end";

type TooltipProps = {
  content: string;
  placement?: TooltipPlacement;
  children: ReactNode;
  className?: string;
};

const OFFSET_PX = 8;
const MARGIN_PX = 8;

type PhysicalPlacement = "top" | "right" | "bottom" | "left";

const NEXT_SIDES: Record<PhysicalPlacement, PhysicalPlacement[]> = {
  top: ["bottom", "right", "left"],
  bottom: ["top", "right", "left"],
  left: ["right", "top", "bottom"],
  right: ["left", "top", "bottom"],
};

function resolvePlacement(placement: TooltipPlacement): PhysicalPlacement {
  if (placement === "start" || placement === "end") {
    const rtl =
      typeof document !== "undefined" && document.documentElement.dir === "rtl";
    if (placement === "start") {
      return rtl ? "right" : "left";
    }
    return rtl ? "left" : "right";
  }
  return placement;
}

function spaceOnSide(rect: DOMRect, side: PhysicalPlacement): number {
  if (side === "top") {
    return rect.top;
  }
  if (side === "bottom") {
    return window.innerHeight - rect.bottom;
  }
  if (side === "left") {
    return rect.left;
  }
  return window.innerWidth - rect.right;
}

function coordsForSide(
  trigger: DOMRect,
  tipWidth: number,
  tipHeight: number,
  side: PhysicalPlacement,
): { top: number; left: number } {
  if (side === "top") {
    return {
      top: trigger.top - tipHeight - OFFSET_PX,
      left: trigger.left + trigger.width / 2 - tipWidth / 2,
    };
  }
  if (side === "bottom") {
    return {
      top: trigger.bottom + OFFSET_PX,
      left: trigger.left + trigger.width / 2 - tipWidth / 2,
    };
  }
  if (side === "left") {
    return {
      top: trigger.top + trigger.height / 2 - tipHeight / 2,
      left: trigger.left - tipWidth - OFFSET_PX,
    };
  }
  return {
    top: trigger.top + trigger.height / 2 - tipHeight / 2,
    left: trigger.right + OFFSET_PX,
  };
}

function fitsViewport(
  top: number,
  left: number,
  tipWidth: number,
  tipHeight: number,
): boolean {
  return (
    top >= MARGIN_PX &&
    left >= MARGIN_PX &&
    top + tipHeight <= window.innerHeight - MARGIN_PX &&
    left + tipWidth <= window.innerWidth - MARGIN_PX
  );
}

function clampToViewport(
  top: number,
  left: number,
  tipWidth: number,
  tipHeight: number,
): { top: number; left: number } {
  const maxTop = Math.max(MARGIN_PX, window.innerHeight - MARGIN_PX - tipHeight);
  const maxLeft = Math.max(MARGIN_PX, window.innerWidth - MARGIN_PX - tipWidth);

  return {
    top: Math.min(Math.max(top, MARGIN_PX), maxTop),
    left: Math.min(Math.max(left, MARGIN_PX), maxLeft),
  };
}

function placeTooltip(
  trigger: DOMRect,
  tipWidth: number,
  tipHeight: number,
  preferred?: TooltipPlacement,
): { top: number; left: number } {
  const resolved = preferred ? resolvePlacement(preferred) : undefined;
  const sides: PhysicalPlacement[] = resolved
    ? [resolved, ...NEXT_SIDES[resolved]]
    : (["top", "bottom", "right", "left"] as PhysicalPlacement[]).slice().sort(
        (a, b) => spaceOnSide(trigger, b) - spaceOnSide(trigger, a),
      );

  for (const side of sides) {
    const pos = coordsForSide(trigger, tipWidth, tipHeight, side);
    if (fitsViewport(pos.top, pos.left, tipWidth, tipHeight)) {
      return pos;
    }
  }

  const fallback = coordsForSide(trigger, tipWidth, tipHeight, resolved ?? "top");
  return clampToViewport(fallback.top, fallback.left, tipWidth, tipHeight);
}

export function Tooltip({
  content,
  placement,
  children,
  className,
}: TooltipProps): ReactNode {
  const tipId = useId();
  const mounted = useIsClient();
  const triggerRef = useRef<HTMLSpanElement>(null);
  const tipRef = useRef<HTMLSpanElement>(null);
  const [open, setOpen] = useState(false);
  const [box, setBox] = useState<CSSProperties | null>(null);

  useLayoutEffect(() => {
    if (!open) {
      return;
    }

    function sync(): void {
      const trigger = triggerRef.current;
      const tip = tipRef.current;
      if (!trigger || !tip) {
        return;
      }

      const pos = placeTooltip(
        trigger.getBoundingClientRect(),
        tip.offsetWidth,
        tip.offsetHeight,
        placement,
      );
      setBox({ top: pos.top, left: pos.left });
    }

    sync();
    window.addEventListener("resize", sync);
    window.addEventListener("scroll", sync, true);
    return () => {
      window.removeEventListener("resize", sync);
      window.removeEventListener("scroll", sync, true);
    };
  }, [open, placement, content]);

  const bubble = mounted
    ? createPortal(
        <AnimatePresence>
          {open ? (
            <motion.span
              ref={tipRef}
              id={tipId}
              role="tooltip"
              className="text-app bg-prose shadow-tooltip pointer-events-none fixed z-[60] max-w-64 rounded-lg px-[0.75em] py-[0.4em] font-sans text-[0.8125rem] leading-[1.4] font-medium"
              style={box ?? { top: 0, left: 0 }}
              initial={{ opacity: 0, scale: 0.92, y: 4 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 4 }}
              transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
            >
              {content}
            </motion.span>
          ) : null}
        </AnimatePresence>,
        document.body,
      )
    : null;

  return (
    <span
      ref={triggerRef}
      className={cn("inline-flex", className)}
      aria-describedby={open ? tipId : undefined}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
    >
      {children}
      {bubble}
    </span>
  );
}
