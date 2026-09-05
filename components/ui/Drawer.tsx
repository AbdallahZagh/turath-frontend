"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { X } from "lucide-react";
import { useId, useRef, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { useLocale, useTranslations } from "next-intl";

import { useIsClient } from "@/hooks/useIsClient";
import { useOverlay } from "@/hooks/useOverlay";
import { dirForLocale } from "@/i18n/config";
import { cn } from "@/lib/cn";

export type DrawerSide = "start" | "end";

type DrawerProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  /** Label above the title (e.g. “Booking”). */
  eyebrow?: string;
  /** Logical edge. `end` is the trailing side (right in LTR, left in RTL). */
  side?: DrawerSide;
  footer?: ReactNode;
  className?: string;
};

function slideFrom(side: DrawerSide, rtl: boolean): string {
  const fromEnd = side === "end";
  const fromPhysicalRight = rtl ? !fromEnd : fromEnd;
  return fromPhysicalRight ? "100%" : "-100%";
}

export function Drawer({
  open,
  onClose,
  title,
  children,
  eyebrow,
  side = "end",
  footer,
  className,
}: DrawerProps): ReactNode {
  const t = useTranslations("ui");
  const locale = useLocale();
  const rtl = dirForLocale(locale) === "rtl";
  const reduceMotion = useReducedMotion();
  const mounted = useIsClient();
  const titleId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const { onPanelKeyDown } = useOverlay({ open, onClose, panelRef });
  const xFrom = slideFrom(side, rtl);

  if (!mounted) {
    return null;
  }

  return createPortal(
    <AnimatePresence>
      {open ? (
        <div className="fixed inset-0 z-70">
          <motion.div
            key="drawer-overlay"
            className="bg-overlay absolute inset-0 backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.2 }}
            onClick={onClose}
            aria-hidden
          />
          <motion.div
            key="drawer-panel"
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            className={cn(
              "glass-surface backdrop-blur-xl rounded-glass absolute inset-y-3 flex w-[min(100%-1.5rem,30rem)] flex-col overflow-hidden",
              side === "end" ? "inset-e-3" : "inset-s-3",
              className,
            )}
            initial={{ x: xFrom }}
            animate={{ x: 0 }}
            exit={{ x: xFrom }}
            transition={
              reduceMotion
                ? { duration: 0 }
                : { type: "spring", stiffness: 380, damping: 36 }
            }
            onKeyDown={onPanelKeyDown}
          >
            <header className="border-glass-border flex shrink-0 items-center justify-between gap-3 border-b px-5 py-4 sm:px-6">
              <div className="min-w-0 pe-2">
                {eyebrow ? (
                  <p className="text-prose-muted mb-0.5 text-xs font-semibold tracking-wider uppercase">
                    {eyebrow}
                  </p>
                ) : null}
                <h2
                  id={titleId}
                  className="font-heading text-prose text-lg font-semibold tracking-tight sm:text-xl"
                >
                  {title}
                </h2>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label={t("close")}
                className="glass-surface backdrop-blur-sm text-prose-muted hover:text-prose flex size-8 shrink-0 items-center justify-center rounded-full transition-colors"
              >
                <X className="size-4" aria-hidden />
              </button>
            </header>
            <div className="min-h-0 flex-1 overflow-y-auto p-5 sm:p-6">
              {children}
            </div>
            {footer ? (
              <footer className="border-glass-border shrink-0 border-t px-5 py-4 sm:px-6">
                {footer}
              </footer>
            ) : null}
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>,
    document.body,
  );
}
