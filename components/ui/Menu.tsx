"use client";

import { MoreHorizontal } from "lucide-react";
import {
  useEffect,
  useId,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type MouseEvent,
  type ReactNode,
  type SyntheticEvent,
} from "react";
import { createPortal } from "react-dom";

import {
  SELECT_MENU_BASE,
  SELECT_MENU_VARIANT,
  SELECT_OPTION,
} from "@/components/ui/controlClasses";
import { controlStyle } from "@/components/ui/controlScale";
import { placeAnchoredMenu } from "@/components/ui/placeMenu";
import { useIsClient } from "@/hooks/useIsClient";
import { cn } from "@/lib/cn";

export type MenuItem = {
  id: string;
  label: string;
  icon?: ReactNode;
  tone?: "default" | "destructive";
  onSelect: () => void;
};

type MenuProps = {
  label: string;
  items: MenuItem[];
  className?: string;
  triggerClassName?: string;
  disabled?: boolean;
};

export function stopMenuEvent(event: SyntheticEvent): void {
  event.stopPropagation();
}

const MENU_MIN_WIDTH_PX = 192;

export function Menu({
  label,
  items,
  className,
  triggerClassName,
  disabled = false,
}: MenuProps): ReactNode {
  const mounted = useIsClient();
  const menuId = useId();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [box, setBox] = useState<CSSProperties | null>(null);

  useEffect(() => {
    if (!open) {
      return;
    }

    function sync(): void {
      const trigger = triggerRef.current;
      if (!trigger) {
        return;
      }
      setBox(
        placeAnchoredMenu(trigger, {
          estimatedHeight: 12 + items.length * 40,
          maxHeightCap: 240,
          width: "max-content",
          minWidth: Math.max(trigger.getBoundingClientRect().width, MENU_MIN_WIDTH_PX),
          align: "end",
        }),
      );
    }

    sync();
    window.addEventListener("resize", sync);
    window.addEventListener("scroll", sync, true);
    return () => {
      window.removeEventListener("resize", sync);
      window.removeEventListener("scroll", sync, true);
    };
  }, [open, items.length]);

  useEffect(() => {
    if (!open) {
      return;
    }

    function onPointerDown(event: PointerEvent): void {
      const target = event.target;
      if (!(target instanceof Node)) {
        return;
      }
      if (triggerRef.current?.contains(target) || panelRef.current?.contains(target)) {
        return;
      }
      setOpen(false);
    }

    function onKeyDown(event: globalThis.KeyboardEvent): void {
      if (event.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    }

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  function onTriggerClick(event: MouseEvent<HTMLButtonElement>): void {
    event.preventDefault();
    event.stopPropagation();
    if (disabled) {
      return;
    }
    setOpen((current) => !current);
  }

  function onTriggerKeyDown(event: KeyboardEvent<HTMLButtonElement>): void {
    event.stopPropagation();
    if (event.key === "ArrowDown" && !open) {
      event.preventDefault();
      setOpen(true);
    }
  }

  const panel =
    mounted && open && box
      ? createPortal(
          <div
            ref={panelRef}
            id={menuId}
            role="menu"
            aria-label={label}
            style={{ ...controlStyle({ size: "sm", defaultRadius: "0.5rem" }), ...box }}
            className={cn(SELECT_MENU_BASE, SELECT_MENU_VARIANT.glass, "w-max")}
          >
            {items.map((item) => (
              <button
                key={item.id}
                type="button"
                role="menuitem"
                className={cn(
                  SELECT_OPTION,
                  "w-full",
                  item.tone === "destructive" && "text-destructive hover:bg-destructive/10",
                )}
                onClick={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  setOpen(false);
                  item.onSelect();
                }}
              >
                <span className="flex items-center gap-2 whitespace-nowrap">
                  {item.icon ? (
                    <span className="inline-flex shrink-0 items-center" aria-hidden>
                      {item.icon}
                    </span>
                  ) : null}
                  <span>{item.label}</span>
                </span>
              </button>
            ))}
          </div>,
          document.body,
        )
      : null;

  return (
    <div className={cn("relative shrink-0", className)}>
      <button
        ref={triggerRef}
        type="button"
        aria-label={label}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? menuId : undefined}
        disabled={disabled}
        className={cn(
          "text-prose-muted hover:bg-option-hover hover:text-prose flex size-8 items-center justify-center rounded-full transition-colors",
          "disabled:pointer-events-none disabled:opacity-40",
          triggerClassName,
        )}
        onClick={onTriggerClick}
        onPointerDown={(event) => event.stopPropagation()}
        onKeyDown={onTriggerKeyDown}
      >
        <MoreHorizontal className="size-4" aria-hidden />
      </button>
      {panel}
    </div>
  );
}
