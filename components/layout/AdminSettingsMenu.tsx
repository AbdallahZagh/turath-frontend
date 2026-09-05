"use client";

import { LogOut, Settings } from "lucide-react";
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
import { RoleSwitcher } from "@/components/layout/RoleSwitcher";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { Button } from "@/components/ui/Button";
import { placeAnchoredMenu } from "@/components/ui/placeMenu";
import { useIsClient } from "@/hooks/useIsClient";
import { cn } from "@/lib/cn";

type AdminSettingsMenuProps = {
  className?: string;
};

export function AdminSettingsMenu({ className }: AdminSettingsMenuProps): ReactNode {
  const t = useTranslations("admin.shell");
  const tChrome = useTranslations("chrome");
  const mounted = useIsClient();
  const menuId = useId();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [box, setBox] = useState<ReturnType<typeof placeAnchoredMenu> | null>(null);

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
          estimatedHeight: 280,
          maxHeightCap: 380,
          minWidth: 220,
          width: 260,
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
  }, [open]);

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
      if (target instanceof Element && target.closest('[role="listbox"]')) {
        return;
      }
      setOpen(false);
    }

    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  const panel =
    mounted && open
      ? createPortal(
          <div
            ref={panelRef}
            id={menuId}
            role="dialog"
            aria-label={t("settings")}
            style={box ?? undefined}
            className="glass-surface backdrop-blur-sm text-prose fixed z-50 flex flex-col gap-4 rounded-glass p-4"
          >
            <div className="flex flex-col gap-2">
              <p className="text-prose-muted text-xs font-semibold tracking-wide uppercase">
                {tChrome("language")}
              </p>
              <LocaleSwitcher className="w-full" />
            </div>
            <div className="flex flex-col gap-2">
              <p className="text-prose-muted text-xs font-semibold tracking-wide uppercase">
                {tChrome("theme")}
              </p>
              <ThemeToggle className="w-full" />
            </div>
            {process.env.NODE_ENV === "development" ? <RoleSwitcher /> : null}
            <div className="border-t border-glass-border pt-3">
              <Button
                variant="destructive"
                size="sm"
                href="/login"
                className="w-full"
                onClick={() => setOpen(false)}
              >
                <LogOut className="size-3.5" aria-hidden />
                {t("logout")}
              </Button>
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
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={open ? menuId : undefined}
        aria-label={t("settings")}
        onClick={() => setOpen((current) => !current)}
        className="text-prose-muted hover:bg-option-hover hover:text-prose flex size-9 items-center justify-center rounded-full"
      >
        <Settings className="size-4" aria-hidden />
      </button>
      {panel}
    </div>
  );
}
