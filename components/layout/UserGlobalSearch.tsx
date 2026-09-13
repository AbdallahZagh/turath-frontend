"use client";

import {
  BedDouble,
  CalendarDays,
  CalendarHeart,
  LayoutDashboard,
  Languages,
  Landmark,
  MapPinned,
  Search,
  ShieldCheck,
  Utensils,
  type LucideIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useEffect, useMemo, useRef, useState, type KeyboardEvent, type ReactNode } from "react";

import { USER_PATHS } from "@/config/userRoutes";
import { cn } from "@/lib/cn";

type SearchItem = {
  href: string;
  label: string;
  icon: LucideIcon;
};

export function UserGlobalSearch(): ReactNode {
  const t = useTranslations("account");
  const router = useRouter();
  const rootRef = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const items = useMemo<SearchItem[]>(
    () => [
      { href: USER_PATHS.home, label: t("nav.dashboard"), icon: LayoutDashboard },
      { href: USER_PATHS.bookings, label: t("nav.bookings"), icon: CalendarDays },
      { href: USER_PATHS.reliability, label: t("nav.reliability"), icon: ShieldCheck },
      { href: USER_PATHS.hotels, label: t("nav.hotels"), icon: BedDouble },
      { href: USER_PATHS.restaurants, label: t("nav.restaurants"), icon: Utensils },
      { href: USER_PATHS.trips, label: t("nav.trips"), icon: MapPinned },
      { href: USER_PATHS.events, label: t("nav.events"), icon: CalendarHeart },
      { href: USER_PATHS.guides, label: t("nav.guides"), icon: Languages },
      { href: USER_PATHS.attractions, label: t("nav.attractions"), icon: Landmark },
    ],
    [t],
  );

  const results = useMemo(() => {
    const needle = query.trim().toLocaleLowerCase();
    return needle
      ? items.filter((item) => item.label.toLocaleLowerCase().includes(needle))
      : items;
  }, [items, query]);

  useEffect(() => {
    function onPointerDown(event: PointerEvent): void {
      if (event.target instanceof Node && !rootRef.current?.contains(event.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, []);

  function navigate(item: SearchItem): void {
    setOpen(false);
    setQuery("");
    router.push(item.href);
  }

  function onKeyDown(event: KeyboardEvent<HTMLInputElement>): void {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setOpen(true);
      setActiveIndex((index) => Math.min(index + 1, Math.max(results.length - 1, 0)));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((index) => Math.max(index - 1, 0));
    } else if (event.key === "Enter") {
      const selected = results[activeIndex];
      if (selected) {
        event.preventDefault();
        navigate(selected);
      }
    } else if (event.key === "Escape") {
      setOpen(false);
    }
  }

  return (
    <div ref={rootRef} className="relative min-w-0 flex-1 sm:max-w-md">
      <label className="bg-glass-control border-glass-border focus-within:border-primary flex h-10 items-center gap-2 rounded-xl border px-3 transition-colors">
        <Search className="text-prose-muted size-4 shrink-0" aria-hidden />
        <input
          type="search"
          value={query}
          placeholder={t("shell.searchPlaceholder")}
          aria-label={t("shell.searchLabel")}
          autoComplete="off"
          className="text-prose placeholder:text-prose-muted min-w-0 flex-1 bg-transparent text-sm outline-none"
          onFocus={() => setOpen(true)}
          onChange={(event) => {
            setQuery(event.target.value);
            setActiveIndex(0);
            setOpen(true);
          }}
          onKeyDown={onKeyDown}
        />
      </label>

      {open ? (
        <div className="glass-surface absolute inset-x-0 top-[calc(100%+0.5rem)] z-50 max-h-80 overflow-y-auto rounded-xl p-1.5 shadow-glass backdrop-blur-xl">
          {results.length > 0 ? (
            results.map((item, index) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.href}
                  type="button"
                  className={cn(
                    "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-start text-sm transition-colors",
                    index === activeIndex
                      ? "bg-primary text-primary-foreground"
                      : "text-prose hover:bg-option-hover",
                  )}
                  onPointerEnter={() => setActiveIndex(index)}
                  onClick={() => navigate(item)}
                >
                  <Icon className="size-4 shrink-0" aria-hidden />
                  <span className="min-w-0 flex-1 truncate">{item.label}</span>
                  <span className={cn("font-mono text-[0.65rem]", index === activeIndex ? "text-primary-foreground/70" : "text-prose-muted")}>{item.href}</span>
                </button>
              );
            })
          ) : (
            <p className="text-prose-muted px-3 py-8 text-center text-sm">{t("shell.searchEmpty")}</p>
          )}
        </div>
      ) : null}
    </div>
  );
}
