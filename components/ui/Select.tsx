"use client";

import { Check, ChevronDown, Search } from "lucide-react";
import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type FocusEvent,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";

import { cn } from "@/lib/cn";

import {
  FIELD_BASE,
  FIELD_GROUP_MAIN,
  FIELD_STACK_LABEL,
  FIELD_VARIANT,
  SELECT_MENU_BASE,
  SELECT_MENU_VARIANT,
  SELECT_OPTION,
  SELECT_TRIGGER,
  SELECT_TRIGGER_HOVER,
} from "./controlClasses";
import { controlStyle, type ControlSize } from "./controlScale";
import type { InputVariant } from "./Input";
import { placeAnchoredMenu } from "./placeMenu";

export type SelectVariant = InputVariant;
export type SelectSize = ControlSize;
export type SelectChrome = "field" | "inline";

export type SelectOption = {
  value: string;
  label: string;
  disabled?: boolean;
  leading?: ReactNode;
  hint?: string;
  keywords?: string;
};

type SelectProps = {
  variant?: SelectVariant;
  size?: SelectSize;
  chrome?: SelectChrome;
  gap?: string;
  paddingX?: string;
  paddingY?: string;
  rounded?: string;
  minHeight?: string;
  options: SelectOption[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  name?: string;
  label?: string;
  placeholder?: string;
  icon?: ReactNode;
  disabled?: boolean;
  required?: boolean;
  id?: string;
  className?: string;
  triggerClassName?: string;
  compact?: boolean;
  searchable?: boolean;
  searchPlaceholder?: string;
  emptyMessage?: string;
  menuMinWidth?: number;
  formatTrigger?: (option: SelectOption) => ReactNode;
};

const VARIANT_RADIUS: Record<SelectVariant, string> = {
  main: "0.625rem",
  glass: "0.5rem",
  plain: "0.5rem",
};

const SEARCHABLE_MENU_CAP = 380;

function estimateMenuHeight(optionCount: number, searchable: boolean): number {
  const list = Math.min(256, 12 + optionCount * 44);
  return searchable ? Math.min(SEARCHABLE_MENU_CAP, 56 + list) : list;
}

function enabledIndexes(options: SelectOption[]): number[] {
  return options.flatMap((option, index) => (option.disabled ? [] : [index]));
}

function optionMatches(option: SelectOption, query: string): boolean {
  const needle = query.trim().toLowerCase();
  if (!needle) {
    return true;
  }
  const haystack = `${option.label} ${option.value} ${option.hint ?? ""} ${option.keywords ?? ""}`;
  return haystack.toLowerCase().includes(needle);
}

export function Select({
  variant = "plain",
  size = "md",
  chrome = "field",
  gap,
  paddingX,
  paddingY,
  rounded,
  minHeight,
  options,
  value,
  defaultValue = "",
  onChange,
  name,
  label,
  placeholder,
  icon,
  disabled,
  required,
  id,
  className,
  triggerClassName,
  compact = false,
  searchable = false,
  searchPlaceholder,
  emptyMessage,
  menuMinWidth,
  formatTrigger,
}: SelectProps): ReactNode {
  const generatedId = useId();
  const selectId = id ?? generatedId;
  const listId = `${selectId}-list`;
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const typeaheadRef = useRef("");
  const typeaheadTimerRef = useRef(0);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [menuBox, setMenuBox] = useState<CSSProperties | null>(null);
  const [uncontrolled, setUncontrolled] = useState(defaultValue);
  const [activeIndex, setActiveIndex] = useState(0);

  const selectedValue = value ?? uncontrolled;
  const selectedOption = options.find((option) => option.value === selectedValue);
  const isEmpty = selectedOption === undefined;

  const visibleOptions = useMemo(
    () => (searchable ? options.filter((option) => optionMatches(option, query)) : options),
    [options, query, searchable],
  );
  const selectable = enabledIndexes(visibleOptions);

  const style = controlStyle({
    size,
    paddingX,
    paddingY,
    rounded,
    minHeight,
    defaultRadius: VARIANT_RADIUS[variant],
    gap: variant === "main" ? (gap ?? "0.625rem") : gap,
  });

  function closeMenu(): void {
    setQuery("");
    setMenuBox(null);
    setOpen(false);
  }

  function commit(next: string): void {
    if (value === undefined) {
      setUncontrolled(next);
    }
    onChange?.(next);
    closeMenu();
  }

  function placeMenu(optionCount = visibleOptions.length): CSSProperties | null {
    const trigger = triggerRef.current;
    if (!trigger) {
      return null;
    }
    const triggerWidth = trigger.getBoundingClientRect().width;
    const minWidth = Math.max(triggerWidth, menuMinWidth ?? 0);
    return placeAnchoredMenu(trigger, {
      estimatedHeight: estimateMenuHeight(optionCount, searchable),
      maxHeightCap: searchable ? SEARCHABLE_MENU_CAP : undefined,
      minWidth,
      width: menuMinWidth ? minWidth : "max-content",
    });
  }

  function openMenu(): void {
    if (disabled || options.length === 0) {
      return;
    }

    setQuery("");
    const selectedIndex = options.findIndex((option) => option.value === selectedValue);
    const initial =
      selectedIndex >= 0 && !options[selectedIndex]?.disabled
        ? selectedIndex
        : (enabledIndexes(options)[0] ?? 0);

    setActiveIndex(initial);
    const box = placeMenu(options.length);
    if (box) {
      setMenuBox(box);
    }
    setOpen(true);
  }

  function moveActive(direction: 1 | -1): void {
    if (selectable.length === 0) {
      return;
    }

    const currentPos = selectable.indexOf(activeIndex);
    const start = currentPos === -1 ? (direction === 1 ? -1 : 0) : currentPos;
    const nextPos = (start + direction + selectable.length) % selectable.length;
    const next = selectable[nextPos];

    if (next !== undefined) {
      setActiveIndex(next);
    }
  }

  function matchOption(typeahead: string): number {
    return options.findIndex(
      (option) =>
        !option.disabled && option.label.toLowerCase().startsWith(typeahead),
    );
  }

  function commitActive(): void {
    const active = visibleOptions[activeIndex];
    if (active && !active.disabled) {
      commit(active.value);
    }
  }

  function onTriggerKeyDown(event: KeyboardEvent<HTMLButtonElement>): void {
    if (disabled) {
      return;
    }

    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      if (!open) {
        openMenu();
        return;
      }
      moveActive(event.key === "ArrowDown" ? 1 : -1);
      return;
    }

    if (event.key === "Home" && open) {
      event.preventDefault();
      const first = selectable[0];
      if (first !== undefined) {
        setActiveIndex(first);
      }
      return;
    }

    if (event.key === "End" && open) {
      event.preventDefault();
      const last = selectable[selectable.length - 1];
      if (last !== undefined) {
        setActiveIndex(last);
      }
      return;
    }

    if (event.key === "Escape") {
      if (open) {
        event.preventDefault();
        closeMenu();
      }
      return;
    }

    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      if (!open) {
        openMenu();
        return;
      }
      commitActive();
      return;
    }

    if (searchable || event.key.length !== 1 || event.ctrlKey || event.metaKey || event.altKey) {
      return;
    }

    const nextQuery = `${typeaheadRef.current}${event.key.toLowerCase()}`;
    typeaheadRef.current = nextQuery;
    window.clearTimeout(typeaheadTimerRef.current);
    typeaheadTimerRef.current = window.setTimeout(() => {
      typeaheadRef.current = "";
    }, 500);

    const match = matchOption(nextQuery);
    if (match < 0) {
      return;
    }

    if (open) {
      setActiveIndex(match);
      return;
    }

    const matched = options[match];
    if (matched) {
      commit(matched.value);
    }
  }

  function onSearchKeyDown(event: KeyboardEvent<HTMLInputElement>): void {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      moveActive(event.key === "ArrowDown" ? 1 : -1);
      return;
    }
    if (event.key === "Enter") {
      event.preventDefault();
      commitActive();
      return;
    }
    if (event.key === "Escape") {
      event.preventDefault();
      closeMenu();
      triggerRef.current?.focus();
    }
  }

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
      closeMenu();
    }

    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  useEffect(() => {
    if (!open) {
      return;
    }

    function syncMenuBox(): void {
      const trigger = triggerRef.current;
      if (!trigger) {
        return;
      }
      const triggerWidth = trigger.getBoundingClientRect().width;
      const minWidth = Math.max(triggerWidth, menuMinWidth ?? 0);
      setMenuBox(
        placeAnchoredMenu(trigger, {
          estimatedHeight: estimateMenuHeight(visibleOptions.length, searchable),
          maxHeightCap: searchable ? SEARCHABLE_MENU_CAP : undefined,
          minWidth,
          width: menuMinWidth ? minWidth : "max-content",
        }),
      );
    }

    window.addEventListener("resize", syncMenuBox);
    window.addEventListener("scroll", syncMenuBox, true);
    return () => {
      window.removeEventListener("resize", syncMenuBox);
      window.removeEventListener("scroll", syncMenuBox, true);
    };
  }, [open, visibleOptions.length, searchable, menuMinWidth]);

  useEffect(() => {
    if (!open) {
      return;
    }

    const active = menuRef.current?.querySelector<HTMLElement>(
      '[data-active="true"]',
    );
    active?.scrollIntoView({ block: "nearest" });
  }, [open, activeIndex]);

  useEffect(() => {
    if (!open || !searchable) {
      return;
    }
    searchInputRef.current?.focus();
  }, [open, searchable]);

  useEffect(() => {
    return () => window.clearTimeout(typeaheadTimerRef.current);
  }, []);

  function onRootBlur(event: FocusEvent<HTMLDivElement>): void {
    const next = event.relatedTarget;
    if (
      next instanceof Node &&
      (rootRef.current?.contains(next) || menuRef.current?.contains(next))
    ) {
      return;
    }
    closeMenu();
  }

  const triggerContent = selectedOption ? (
    formatTrigger ? (
      formatTrigger(selectedOption)
    ) : (
      <>
        {selectedOption.leading ? (
          <span className="inline-flex shrink-0 items-center" aria-hidden>
            {selectedOption.leading}
          </span>
        ) : icon ? (
          <span className="text-prose-muted inline-flex shrink-0 items-center" aria-hidden>
            {icon}
          </span>
        ) : null}
        <span className={cn("truncate", compact ? "flex-none" : "min-w-0 flex-1")}>
          {selectedOption.label}
        </span>
      </>
    )
  ) : (
    <>
      {icon ? (
        <span className="text-prose-muted inline-flex shrink-0 items-center" aria-hidden>
            {icon}
          </span>
      ) : null}
      <span className={cn("truncate", compact ? "flex-none" : "min-w-0 flex-1")}>
        {placeholder}
      </span>
    </>
  );

  const trigger = (
    <button
      type="button"
      id={selectId}
      data-empty={isEmpty ? "true" : "false"}
      className={cn(
        "group",
        chrome === "field" && FIELD_BASE,
        chrome === "field" && FIELD_VARIANT[variant],
        SELECT_TRIGGER,
        chrome === "field" && SELECT_TRIGGER_HOVER[variant],
        chrome === "field" && (compact ? "w-auto" : "w-full"),
        chrome === "inline" && "h-auto self-stretch",
        triggerClassName,
      )}
      ref={triggerRef}
      disabled={disabled}
      aria-haspopup="listbox"
      aria-expanded={open}
      aria-controls={listId}
      aria-activedescendant={open ? `${listId}-option-${activeIndex}` : undefined}
      aria-label={label ?? placeholder}
      aria-required={required}
      onClick={() => (open ? closeMenu() : openMenu())}
      onKeyDown={onTriggerKeyDown}
    >
      {triggerContent}
      <ChevronDown
        className="size-[1.1em] shrink-0 transition-transform duration-150 group-aria-expanded:rotate-180 motion-reduce:transition-none"
        aria-hidden
      />
    </button>
  );

  const optionList = (
    <ul
      id={listId}
      role="listbox"
      aria-label={label ?? placeholder}
      className={searchable ? "m-0 min-h-0 flex-1 list-none overflow-y-auto p-[0.35rem]" : "m-0 list-none"}
    >
      {visibleOptions.length === 0 ? (
        <li className="text-prose-muted px-(--control-px) py-3 text-sm">{emptyMessage}</li>
      ) : (
        visibleOptions.map((option, index) => {
          const isSelected = option.value === selectedValue;
          const isActive = index === activeIndex;

          return (
            <li
              key={option.value}
              id={`${listId}-option-${index}`}
              role="option"
              aria-selected={isSelected}
              aria-disabled={option.disabled}
              data-active={isActive ? "true" : "false"}
              className={SELECT_OPTION}
              onPointerEnter={() => {
                if (!option.disabled) {
                  setActiveIndex(index);
                }
              }}
              onPointerDown={(event) => {
                event.preventDefault();
                if (!option.disabled) {
                  commit(option.value);
                }
              }}
            >
              <span className="flex min-w-0 flex-1 items-center gap-(--control-gap)">
                {option.leading ? (
                  <span className="inline-flex shrink-0 items-center" aria-hidden>
                    {option.leading}
                  </span>
                ) : null}
                <span className="min-w-0 truncate">{option.label}</span>
                {option.hint ? (
                  <span className="text-prose-muted shrink-0 text-sm">{option.hint}</span>
                ) : null}
              </span>
              {isSelected ? (
                <Check className="size-[1.1em] shrink-0" aria-hidden />
              ) : null}
            </li>
          );
        })
      )}
    </ul>
  );

  const menu =
    open && menuBox
      ? createPortal(
          <div
            ref={menuRef}
            data-variant={variant}
            data-anchored-menu=""
            className={cn(
              SELECT_MENU_BASE,
              SELECT_MENU_VARIANT[variant],
              searchable && "flex max-h-[inherit] flex-col overflow-hidden p-0",
            )}
            style={{ ...style, ...menuBox }}
          >
            {searchable ? (
              <div className="border-border shrink-0 border-b p-2">
                <label className="bg-app-muted flex items-center gap-2 rounded-md px-2 py-1.5">
                  <Search className="text-prose-muted size-4 shrink-0" aria-hidden />
                  <input
                    ref={searchInputRef}
                    type="search"
                    value={query}
                    placeholder={searchPlaceholder}
                    aria-label={searchPlaceholder}
                    autoComplete="off"
                    className="text-prose placeholder:text-prose-muted min-w-0 flex-1 bg-transparent text-(length:--control-font-size) outline-none"
                    onChange={(event) => {
                      const next = event.target.value;
                      setQuery(next);
                      const nextVisible = options.filter((option) =>
                        optionMatches(option, next),
                      );
                      setActiveIndex(enabledIndexes(nextVisible)[0] ?? 0);
                    }}
                    onKeyDown={onSearchKeyDown}
                  />
                </label>
              </div>
            ) : null}
            {optionList}
          </div>,
          document.body,
        )
      : null;

  const hidden =
    name !== undefined ? (
      <input type="hidden" name={name} value={selectedValue} required={required} />
    ) : null;

  const shellClass = cn(
    "relative has-[[aria-expanded=true]]:z-20",
    compact || chrome === "inline" ? "w-fit shrink-0" : "w-full",
    chrome === "inline" && "flex self-stretch items-stretch",
  );

  const control = (
    <div className={shellClass} ref={rootRef} onBlur={onRootBlur}>
      {trigger}
      {hidden}
      {menu}
    </div>
  );

  if (variant === "main" && chrome === "field") {
    return (
      <div className={cn(FIELD_GROUP_MAIN, className)} style={style}>
        {control}
        {label ? (
          <label className={FIELD_STACK_LABEL} htmlFor={selectId}>
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
      {menu}
    </div>
  );
}
