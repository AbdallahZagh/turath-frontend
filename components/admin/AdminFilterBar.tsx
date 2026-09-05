"use client";

import { ListFilter, X } from "lucide-react";
import { useTranslations } from "next-intl";
import {
  useEffect,
  useId,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";

import { Button } from "@/components/ui/Button";
import {
  SELECT_MENU_BASE,
  SELECT_MENU_VARIANT,
} from "@/components/ui/controlClasses";
import { Input } from "@/components/ui/Input";
import { placeAnchoredMenu } from "@/components/ui/placeMenu";
import { Select } from "@/components/ui/Select";
import { useIsClient } from "@/hooks/useIsClient";
import { cn } from "@/lib/cn";

export type AdminFilterField = {
  id: string;
  label: string;
  value: string;
  allValue?: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
};

type AdminFilterBarProps = {
  search: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder: string;
  filters: AdminFilterField[];
  trailing?: ReactNode;
};

export const ADMIN_TOOLBAR_HEIGHT = "2.625rem";
const ALL = "all";

function isActive(field: AdminFilterField): boolean {
  return field.value !== (field.allValue ?? ALL);
}

function optionLabel(field: AdminFilterField): string {
  return field.options.find((option) => option.value === field.value)?.label ?? field.value;
}

export function AdminFilterBar({
  search,
  onSearchChange,
  searchPlaceholder,
  filters,
  trailing,
}: AdminFilterBarProps): ReactNode {
  const t = useTranslations("ui.filter");
  const mounted = useIsClient();
  const labelId = useId();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [menuBox, setMenuBox] = useState<CSSProperties | null>(null);

  const active = filters.filter(isActive);
  const activeCount = active.length;

  function syncMenuBox(): void {
    const trigger = triggerRef.current;
    if (!trigger) {
      return;
    }
    setMenuBox(
      placeAnchoredMenu(trigger, {
        estimatedHeight: 88 + filters.length * 76,
        maxHeightCap: 420,
        width: 288,
        minWidth: 288,
      }),
    );
  }

  useEffect(() => {
    if (!open) {
      setMenuBox(null);
      return;
    }

    syncMenuBox();
    window.addEventListener("resize", syncMenuBox);
    window.addEventListener("scroll", syncMenuBox, true);
    return () => {
      window.removeEventListener("resize", syncMenuBox);
      window.removeEventListener("scroll", syncMenuBox, true);
    };
  }, [open, filters.length]);

  useEffect(() => {
    if (!open) {
      return;
    }

    function isInside(target: EventTarget | null): boolean {
      if (!(target instanceof Node)) {
        return false;
      }
      if (triggerRef.current?.contains(target) || menuRef.current?.contains(target)) {
        return true;
      }
      return target instanceof Element && target.closest("[data-anchored-menu]") !== null;
    }

    function onPointerDown(event: PointerEvent): void {
      if (isInside(event.target)) {
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

  function clearAll(): void {
    for (const field of filters) {
      field.onChange(field.allValue ?? ALL);
    }
  }

  const menu =
    mounted && open && menuBox
      ? createPortal(
          <div
            ref={menuRef}
            role="dialog"
            aria-labelledby={labelId}
            data-anchored-menu=""
            className={cn(
              SELECT_MENU_BASE,
              SELECT_MENU_VARIANT.glass,
              "flex max-h-[inherit] flex-col gap-3 overflow-y-auto p-3",
            )}
            style={menuBox}
          >
            <p id={labelId} className="text-prose text-sm font-semibold">
              {t("title")}
            </p>
            {filters.map((field) => (
              <Select
                key={field.id}
                variant="glass"
                size="sm"
                value={field.value}
                onChange={field.onChange}
                label={field.label}
                className="w-full"
                options={field.options}
              />
            ))}
            {activeCount > 0 ? (
              <Button type="button" variant="outline" size="sm" onClick={clearAll}>
                {t("clear")}
              </Button>
            ) : null}
          </div>,
          document.body,
        )
      : null;

  return (
    <div className="flex shrink-0 flex-col gap-2">
      <div className="flex flex-wrap items-stretch gap-2">
        <Input
          variant="glass"
          size="sm"
          type="search"
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder={searchPlaceholder}
          label={searchPlaceholder}
          minHeight={ADMIN_TOOLBAR_HEIGHT}
          className="w-full sm:max-w-sm"
        />
        <Button
          ref={triggerRef}
          type="button"
          variant="glass"
          size="sm"
          minHeight={ADMIN_TOOLBAR_HEIGHT}
          aria-expanded={open}
          aria-haspopup="dialog"
          aria-label={t("title")}
          className="shrink-0"
          onClick={() => setOpen((current) => !current)}
        >
          <ListFilter className="size-4 shrink-0" aria-hidden />
          {t("title")}
          {activeCount > 0 ? (
            <span className="bg-primary text-primary-foreground ms-0.5 inline-flex min-w-5 items-center justify-center rounded-full px-1.5 text-[0.7rem] font-semibold tabular-nums">
              {activeCount}
            </span>
          ) : null}
        </Button>
        {trailing ? (
          <div className="flex w-full min-w-0 items-stretch sm:w-auto">{trailing}</div>
        ) : null}
        {menu}
      </div>
      {activeCount > 0 ? (
        <ul className="flex flex-wrap gap-2" aria-label={t("applied")}>
          {active.map((field) => (
            <li key={field.id}>
              <FilterChip
                label={`${field.label}: ${optionLabel(field)}`}
                removeLabel={t("remove", { filter: optionLabel(field) })}
                onRemove={() => field.onChange(field.allValue ?? ALL)}
              />
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

type FilterChipProps = {
  label: string;
  removeLabel: string;
  onRemove: () => void;
};

function FilterChip({ label, removeLabel, onRemove }: FilterChipProps): ReactNode {
  function onKeyDown(event: KeyboardEvent<HTMLButtonElement>): void {
    if (event.key === "Backspace" || event.key === "Delete") {
      event.preventDefault();
      onRemove();
    }
  }

  return (
    <button
      type="button"
      className="glass-surface backdrop-blur-sm text-prose inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium"
      aria-label={removeLabel}
      onClick={onRemove}
      onKeyDown={onKeyDown}
    >
      <span>{label}</span>
      <X className="size-3.5 shrink-0" aria-hidden />
    </button>
  );
}
