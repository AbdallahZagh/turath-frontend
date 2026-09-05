"use client";

import {
  useEffect,
  useLayoutEffect,
  useRef,
  type KeyboardEvent,
  type ReactNode,
  type UIEvent,
} from "react";

import { cn } from "@/lib/cn";

const WHEEL_ITEM_PX = 40;

export type WheelItem = {
  value: string;
  label: string;
};

type WheelColumnProps = {
  items: WheelItem[];
  value: string;
  onChange: (value: string) => void;
  "aria-label": string;
  className?: string;
};

export function WheelColumn({
  items,
  value,
  onChange,
  "aria-label": ariaLabel,
  className,
}: WheelColumnProps): ReactNode {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const skipSync = useRef(false);
  const selectedIndex = Math.max(
    0,
    items.findIndex((item) => item.value === value),
  );

  useLayoutEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller || skipSync.current) {
      skipSync.current = false;
      return;
    }
    scroller.scrollTop = selectedIndex * WHEEL_ITEM_PX;
  }, [selectedIndex, items.length]);

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) {
      return;
    }

    function settle(): void {
      const node = scrollerRef.current;
      if (!node) {
        return;
      }
      const index = Math.max(
        0,
        Math.min(items.length - 1, Math.round(node.scrollTop / WHEEL_ITEM_PX)),
      );
      const item = items[index];
      if (!item || item.value === value) {
        return;
      }
      skipSync.current = true;
      onChange(item.value);
    }

    function onScrollEnd(): void {
      settle();
    }

    scroller.addEventListener("scrollend", onScrollEnd);
    return () => scroller.removeEventListener("scrollend", onScrollEnd);
  }, [items, onChange, value]);

  function onScroll(event: UIEvent<HTMLDivElement>): void {
    const index = Math.max(
      0,
      Math.min(
        items.length - 1,
        Math.round(event.currentTarget.scrollTop / WHEEL_ITEM_PX),
      ),
    );
    const item = items[index];
    if (item && item.value !== value) {
      skipSync.current = true;
      onChange(item.value);
    }
  }

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>): void {
    if (event.key !== "ArrowDown" && event.key !== "ArrowUp") {
      return;
    }
    event.preventDefault();
    const next =
      event.key === "ArrowDown"
        ? Math.min(items.length - 1, selectedIndex + 1)
        : Math.max(0, selectedIndex - 1);
    const item = items[next];
    if (item) {
      onChange(item.value);
    }
  }

  const pad = WHEEL_ITEM_PX * 2;

  return (
    <div
      ref={scrollerRef}
      role="listbox"
      tabIndex={0}
      aria-label={ariaLabel}
      aria-activedescendant={`${ariaLabel}-${value}`}
      className={cn(
        "wheel-scroll relative z-[1] h-[200px] w-16 shrink-0 snap-y snap-mandatory overflow-y-auto overscroll-contain outline-none",
        className,
      )}
      style={{
        paddingBlock: pad,
        maskImage:
          "linear-gradient(to bottom, transparent, black 22%, black 78%, transparent)",
        WebkitMaskImage:
          "linear-gradient(to bottom, transparent, black 22%, black 78%, transparent)",
      }}
      onScroll={onScroll}
      onKeyDown={onKeyDown}
    >
      {items.map((item, index) => {
        const selected = item.value === value;
        const distance = Math.abs(index - selectedIndex);
        const scale = distance === 0 ? 1 : distance === 1 ? 0.88 : 0.76;
        const opacity = distance === 0 ? 1 : distance === 1 ? 0.45 : 0.22;
        return (
          <div
            key={item.value}
            id={`${ariaLabel}-${item.value}`}
            role="option"
            aria-selected={selected}
            data-active={selected ? "true" : "false"}
            className={cn(
              "flex h-10 snap-start items-center justify-center text-[1.05rem] tabular-nums",
              selected ? "text-prose font-semibold" : "text-prose-muted font-medium",
            )}
            style={{
              opacity,
              transform: `scale(${scale})`,
            }}
            onPointerDown={() => onChange(item.value)}
          >
            {item.label}
          </div>
        );
      })}
    </div>
  );
}
