"use client";

import { ChevronDown } from "lucide-react";
import {
  useEffect,
  useId,
  useRef,
  useState,
  type CSSProperties,
  type FocusEvent,
  type KeyboardEvent,
  type ReactNode,
  type RefObject,
} from "react";
import { createPortal } from "react-dom";

import { cn } from "@/lib/cn";

import {
  FIELD_BASE,
  FIELD_GROUP_MAIN,
  FIELD_STACK_LABEL,
  FIELD_VARIANT,
  SELECT_MENU_VARIANT,
  SELECT_TRIGGER,
  SELECT_TRIGGER_HOVER,
} from "./controlClasses";
import { controlStyle, type ControlSize } from "./controlScale";
import type { FieldVariant } from "./field.types";
import { placeAnchoredMenu } from "./placeMenu";

const PICKER_RADIUS: Record<FieldVariant, string> = {
  main: "0.625rem",
  glass: "0.5rem",
  plain: "0.5rem",
};

const PICKER_MENU_BASE =
  "wheel-scroll fixed z-80 m-0 box-border overflow-hidden p-1.5 rounded-(--control-radius)";

type PickerFieldProps = {
  variant?: FieldVariant;
  size?: ControlSize;
  gap?: string;
  paddingX?: string;
  paddingY?: string;
  rounded?: string;
  minHeight?: string;
  label?: string;
  placeholder?: string;
  icon?: ReactNode;
  disabled?: boolean;
  required?: boolean;
  id?: string;
  name?: string;
  className?: string;
  display: string;
  hiddenValue: string;
  isEmpty: boolean;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  menu: ReactNode;
  estimatedHeight: number;
  maxHeightCap: number;
  menuWidth: number;
  triggerRef: RefObject<HTMLButtonElement | null>;
  menuRef: RefObject<HTMLDivElement | null>;
};

export function PickerField({
  variant = "plain",
  size = "md",
  gap,
  paddingX,
  paddingY,
  rounded,
  minHeight,
  label,
  placeholder,
  icon,
  disabled,
  required,
  id,
  name,
  className,
  display,
  hiddenValue,
  isEmpty,
  open,
  onOpenChange,
  menu,
  estimatedHeight,
  maxHeightCap,
  menuWidth,
  triggerRef,
  menuRef,
}: PickerFieldProps): ReactNode {
  const generatedId = useId();
  const pickerId = id ?? generatedId;
  const listId = `${pickerId}-panel`;
  const rootRef = useRef<HTMLDivElement>(null);
  const [menuBox, setMenuBox] = useState<CSSProperties | null>(null);

  const style = controlStyle({
    size,
    paddingX,
    paddingY,
    rounded,
    minHeight,
    defaultRadius: PICKER_RADIUS[variant],
    gap: variant === "main" ? (gap ?? "0.625rem") : gap,
  });

  function syncMenuBox(): void {
    const trigger = triggerRef.current;
    if (!trigger) {
      return;
    }
    setMenuBox(
      placeAnchoredMenu(trigger, {
        estimatedHeight,
        maxHeightCap,
        width: menuWidth,
        minWidth: menuWidth,
        shrinkToFit: false,
      }),
    );
  }

  function openMenu(): void {
    if (disabled) {
      return;
    }
    syncMenuBox();
    onOpenChange(true);
  }

  useEffect(() => {
    if (!open) {
      setMenuBox(null);
      return;
    }

    function onScroll(event: Event): void {
      const target = event.target;
      if (target instanceof Node && menuRef.current?.contains(target)) {
        return;
      }
      syncMenuBox();
    }

    syncMenuBox();
    window.addEventListener("resize", syncMenuBox);
    window.addEventListener("scroll", onScroll, true);
    return () => {
      window.removeEventListener("resize", syncMenuBox);
      window.removeEventListener("scroll", onScroll, true);
    };
  }, [open, estimatedHeight, maxHeightCap, menuWidth, menuRef]);

  useEffect(() => {
    if (!open) {
      return;
    }

    function isInside(target: Node): boolean {
      return Boolean(
        rootRef.current?.contains(target) || menuRef.current?.contains(target),
      );
    }

    function onPointerDown(event: PointerEvent): void {
      const target = event.target;
      if (!(target instanceof Node) || isInside(target)) {
        return;
      }
      onOpenChange(false);
    }

    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open, menuRef, onOpenChange]);

  function onRootBlur(event: FocusEvent<HTMLDivElement>): void {
    const next = event.relatedTarget;
    if (
      next instanceof Node &&
      (rootRef.current?.contains(next) || menuRef.current?.contains(next))
    ) {
      return;
    }
    onOpenChange(false);
  }

  function onTriggerKeyDown(event: KeyboardEvent<HTMLButtonElement>): void {
    if (disabled) {
      return;
    }
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      if (!open) {
        openMenu();
      }
      return;
    }
    if (event.key === "Escape" && open) {
      event.preventDefault();
      onOpenChange(false);
      return;
    }
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      if (open) {
        onOpenChange(false);
      } else {
        openMenu();
      }
    }
  }

  const trigger = (
    <button
      type="button"
      id={pickerId}
      data-empty={isEmpty ? "true" : "false"}
      className={cn(
        "group",
        FIELD_BASE,
        FIELD_VARIANT[variant],
        SELECT_TRIGGER,
        SELECT_TRIGGER_HOVER[variant],
      )}
      ref={triggerRef}
      disabled={disabled}
      aria-haspopup="dialog"
      aria-expanded={open}
      aria-controls={listId}
      aria-label={label ?? placeholder}
      aria-required={required}
      onClick={() => (open ? onOpenChange(false) : openMenu())}
      onKeyDown={onTriggerKeyDown}
    >
      {icon ? (
        <span className="text-prose-muted flex shrink-0 items-center" aria-hidden>
          {icon}
        </span>
      ) : null}
      <span className="min-w-0 flex-1 truncate">{display || placeholder}</span>
      <ChevronDown
        className="size-[1.1em] shrink-0 transition-transform duration-150 group-aria-expanded:rotate-180 motion-reduce:transition-none"
        aria-hidden
      />
    </button>
  );

  const panel =
    open && menuBox
      ? createPortal(
          <div
            ref={menuRef}
            id={listId}
            role="dialog"
            data-anchored-menu=""
            className={cn(PICKER_MENU_BASE, SELECT_MENU_VARIANT[variant])}
            aria-label={label ?? placeholder}
            style={{ ...style, ...menuBox }}
          >
            {menu}
          </div>,
          document.body,
        )
      : null;

  const hidden =
    name !== undefined ? (
      <input type="hidden" name={name} value={hiddenValue} required={required} />
    ) : null;

  const shellClass = "relative w-full has-[[aria-expanded=true]]:z-20";

  const control = (
    <div className={shellClass} ref={rootRef} onBlur={onRootBlur}>
      {trigger}
      {hidden}
      {panel}
    </div>
  );

  if (variant === "main") {
    return (
      <div className={cn(FIELD_GROUP_MAIN, className)} style={style}>
        {control}
        {label ? (
          <label className={FIELD_STACK_LABEL} htmlFor={pickerId}>
            {label}
          </label>
        ) : null}
      </div>
    );
  }

  return (
    <div className={cn(shellClass, className)} style={style} ref={rootRef} onBlur={onRootBlur}>
      {trigger}
      {hidden}
      {panel}
    </div>
  );
}
