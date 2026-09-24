"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Search, X, type LucideIcon } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";

import { useIsClient } from "@/hooks/useIsClient";
import { useOverlay } from "@/hooks/useOverlay";
import { cn } from "@/lib/cn";

export type GlobalSearchItem = {
  href: string;
  label: string;
  icon: LucideIcon;
};

type GlobalSearchLabels = {
  dialog: string;
  placeholder: string;
  noResults: string;
  navigate: string;
  select: string;
  close: string;
  shortcut: string;
};

type SearchAllAction = {
  icon: LucideIcon;
  getHref: (query: string) => string;
  getLabel: (query: string) => string;
};

type GlobalSearchPaletteProps = {
  items: GlobalSearchItem[];
  labels: GlobalSearchLabels;
  searchAll?: SearchAllAction;
};

export function GlobalSearchPalette({
  items,
  labels,
  searchAll,
}: GlobalSearchPaletteProps): ReactNode {
  const router = useRouter();
  const pathname = usePathname();
  const isClient = useIsClient();
  const panelRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);

  const close = useCallback((): void => {
    setOpen(false);
    setQuery("");
    setSelectedIndex(0);
  }, []);

  const { onPanelKeyDown } = useOverlay({ open, onClose: close, panelRef });

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent): void {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen((current) => !current);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const filteredItems = useMemo(() => {
    const trimmed = query.trim();
    const needle = trimmed.toLocaleLowerCase();
    const matches = needle
      ? items.filter(
          (item) =>
            item.label.toLocaleLowerCase().includes(needle) ||
            item.href.toLocaleLowerCase().includes(needle),
        )
      : items;

    if (!trimmed || !searchAll) return matches;
    return [
      {
        href: searchAll.getHref(trimmed),
        label: searchAll.getLabel(trimmed),
        icon: searchAll.icon,
      },
      ...matches,
    ];
  }, [items, query, searchAll]);

  const activeIndex =
    filteredItems.length === 0 ? 0 : Math.min(selectedIndex, filteredItems.length - 1);

  function select(item: GlobalSearchItem): void {
    close();
    if (pathname !== item.href) router.push(item.href);
  }

  if (!isClient) return null;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="glass-surface border-glass-border text-prose-muted hover:text-prose hover:border-primary/40 hidden max-w-xs cursor-pointer items-center justify-between gap-3 rounded-xl border px-3.5 py-1.5 text-xs shadow-xs transition-colors duration-150 sm:flex"
        aria-label={labels.dialog}
      >
        <span className="flex items-center gap-2">
          <Search className="size-3.5" aria-hidden />
          <span>{labels.placeholder}</span>
        </span>
        <kbd className="bg-glass-control border-glass-border text-prose-muted rounded border px-1.5 py-0.5 font-mono text-[10px]">
          {labels.shortcut}
        </kbd>
      </button>

      {createPortal(
        <AnimatePresence>
          {open ? (
            <div className="fixed inset-0 z-70 flex items-start justify-center overflow-y-auto p-4 sm:p-6 md:p-20">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={close}
                className="bg-overlay absolute inset-0 backdrop-blur-[2px]"
                aria-hidden
              />
              <motion.div
                ref={panelRef}
                initial={{ opacity: 0, scale: 0.96, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96, y: -10 }}
                transition={{ duration: 0.15 }}
                className="glass-surface rounded-glass relative w-full max-w-lg overflow-hidden shadow-2xl backdrop-blur-xl"
                role="dialog"
                aria-modal="true"
                aria-label={labels.dialog}
                onKeyDown={onPanelKeyDown}
              >
                <div className="border-glass-border flex items-center gap-3 border-b px-4 py-3.5">
                  <Search className="text-accent size-4 shrink-0" aria-hidden />
                  <input
                    type="search"
                    autoFocus
                    autoComplete="off"
                    placeholder={labels.placeholder}
                    value={query}
                    onChange={(event) => {
                      setQuery(event.target.value);
                      setSelectedIndex(0);
                    }}
                    onKeyDown={(event) => {
                      if (event.key === "ArrowDown") {
                        event.preventDefault();
                        setSelectedIndex((index) =>
                          Math.min(index + 1, Math.max(filteredItems.length - 1, 0)),
                        );
                      } else if (event.key === "ArrowUp") {
                        event.preventDefault();
                        setSelectedIndex((index) => Math.max(index - 1, 0));
                      } else if (event.key === "Enter") {
                        const item = filteredItems[activeIndex];
                        if (item) {
                          event.preventDefault();
                          select(item);
                        }
                      }
                    }}
                    className="text-prose flex-1 bg-transparent text-sm outline-hidden"
                  />
                  {query ? (
                    <button
                      type="button"
                      onClick={() => setQuery("")}
                      className="text-prose-muted hover:text-prose rounded p-0.5"
                      aria-label={labels.close}
                    >
                      <X className="size-4" aria-hidden />
                    </button>
                  ) : null}
                </div>

                <div className="max-h-80 overflow-y-auto p-2">
                  {filteredItems.length === 0 ? (
                    <div className="text-prose-muted py-8 text-center text-xs">
                      {labels.noResults}
                    </div>
                  ) : (
                    <ul className="flex flex-col gap-0.5">
                      {filteredItems.map((item, index) => {
                        const Icon = item.icon;
                        const selected = index === activeIndex;
                        return (
                          <li key={item.href}>
                            <button
                              type="button"
                              onClick={() => select(item)}
                              onMouseEnter={() => setSelectedIndex(index)}
                              className={cn(
                                "flex w-full cursor-pointer items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-start text-xs transition-colors duration-150",
                                selected
                                  ? "bg-primary text-primary-foreground font-medium"
                                  : "text-prose hover:bg-glass-control",
                              )}
                            >
                              <span className="flex min-w-0 items-center gap-2.5">
                                <Icon className="size-4 shrink-0" aria-hidden />
                                <span className="truncate">{item.label}</span>
                              </span>
                              <span
                                className={cn(
                                  "shrink-0 font-mono text-[11px]",
                                  selected ? "text-primary-foreground/75" : "text-prose-muted",
                                )}
                              >
                                {item.href}
                              </span>
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>

                <div className="border-glass-border bg-glass-control/40 text-prose-muted flex items-center justify-between border-t px-4 py-2 text-[11px]">
                  <span>{labels.navigate}</span>
                  <span>{labels.select}</span>
                  <span>{labels.close}</span>
                </div>
              </motion.div>
            </div>
          ) : null}
        </AnimatePresence>,
        document.body,
      )}
    </>
  );
}
