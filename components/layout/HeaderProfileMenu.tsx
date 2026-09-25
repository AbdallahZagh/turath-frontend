"use client";

import { ChevronDown, LogOut, type LucideIcon } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import {
  useEffect,
  useId,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";

import { LocaleSwitcher } from "@/components/layout/LocaleSwitcher";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { placeAnchoredMenu } from "@/components/ui/placeMenu";
import { useIsClient } from "@/hooks/useIsClient";
import { cn } from "@/lib/cn";
import { initialsFromName } from "@/lib/format/initials";

export type HeaderProfileMenuItem = {
  href: string;
  label: string;
  icon: LucideIcon;
};

type HeaderProfileMenuProps = {
  name: string;
  email: string;
  openLabel: string;
  signOutLabel: string;
  signOutHref: string;
  items: HeaderProfileMenuItem[];
  onSignOut: () => void;
  showThemeToggle?: boolean;
  additionalControls?: ReactNode;
  className?: string;
};

export function HeaderProfileMenu({
  name,
  email,
  openLabel,
  signOutLabel,
  signOutHref,
  items,
  onSignOut,
  showThemeToggle = false,
  additionalControls,
  className,
}: HeaderProfileMenuProps): ReactNode {
  const tChrome = useTranslations("chrome");
  const mounted = useIsClient();
  const menuId = useId();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [box, setBox] = useState<ReturnType<typeof placeAnchoredMenu> | null>(null);

  useEffect(() => {
    if (!open) return;

    function sync(): void {
      const trigger = triggerRef.current;
      if (!trigger) return;
      setBox(
        placeAnchoredMenu(trigger, {
          estimatedHeight:
            208 +
            items.length * 44 +
            (showThemeToggle ? 70 : 0) +
            (additionalControls ? 70 : 0),
          maxHeightCap: 440,
          minWidth: 240,
          width: 280,
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
  }, [additionalControls, items.length, open, showThemeToggle]);

  useEffect(() => {
    if (!open) return;

    function onPointerDown(event: PointerEvent): void {
      const target = event.target;
      if (!(target instanceof Node)) return;
      if (target instanceof Element && target.closest("[data-anchored-menu]")) return;
      if (triggerRef.current?.contains(target) || panelRef.current?.contains(target)) return;
      setOpen(false);
    }

    function onKeyDown(event: KeyboardEvent): void {
      if (event.key !== "Escape") return;
      setOpen(false);
      triggerRef.current?.focus();
    }

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const panel = mounted && open && box
    ? createPortal(
        <div
          ref={panelRef}
          id={menuId}
          role="menu"
          aria-label={openLabel}
          style={box}
          className="glass-surface backdrop-blur-sm text-prose fixed z-50 overflow-hidden rounded-glass p-2"
        >
          <div className="border-glass-border flex items-center gap-3 border-b px-3 py-3">
            <span className="bg-primary text-primary-foreground grid size-10 shrink-0 place-items-center rounded-full text-xs font-bold">
              {initialsFromName(name)}
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">{name}</p>
              <p className="text-prose-muted mt-0.5 truncate text-xs" dir="ltr">{email}</p>
            </div>
          </div>

          {items.length > 0 ? (
            <div className="py-2">
              {items.map(({ href, label, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  role="menuitem"
                  onClick={() => setOpen(false)}
                  className="text-prose-muted hover:bg-option-hover hover:text-prose flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors"
                >
                  <Icon className="size-4 shrink-0" aria-hidden />
                  {label}
                </Link>
              ))}
            </div>
          ) : null}

          <div className="border-glass-border border-t px-2 py-2">
            <LocaleSwitcher className="w-full" onLocaleChange={() => setOpen(false)} />
          </div>

          {additionalControls ? (
            <div className="border-glass-border border-t px-2 py-2">
              {additionalControls}
            </div>
          ) : null}

          {showThemeToggle ? (
            <div className="border-glass-border border-t px-2 py-2">
              <p className="text-prose-muted mb-2 px-1 text-[0.65rem] font-bold uppercase tracking-[0.12em]">
                {tChrome("theme")}
              </p>
              <ThemeToggle className="w-full" />
            </div>
          ) : null}

          <div className="border-glass-border border-t pt-2">
            <Link
              href={signOutHref}
              role="menuitem"
              onClick={() => {
                setOpen(false);
                onSignOut();
              }}
              className="text-destructive hover:bg-destructive/10 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors"
            >
              <LogOut className="size-4 shrink-0" aria-hidden />
              {signOutLabel}
            </Link>
          </div>
        </div>,
        document.body,
      )
    : null;

  return (
    <div className={cn("shrink-0", className)}>
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? menuId : undefined}
        aria-label={openLabel}
        onClick={() => setOpen((current) => !current)}
        className="group relative flex items-center rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
      >
        <span className="bg-primary text-primary-foreground grid size-9 place-items-center rounded-full text-xs font-bold">
          {initialsFromName(name)}
        </span>
        <span className="bg-glass-control text-prose absolute -end-1 -bottom-0.5 grid size-4 place-items-center rounded-full shadow-sm">
          <ChevronDown className="size-2.5 transition-transform group-aria-expanded:rotate-180" aria-hidden />
        </span>
      </button>
      {panel}
    </div>
  );
}
