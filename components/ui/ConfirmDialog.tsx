"use client";

import { AnimatePresence, motion } from "framer-motion";
import { TriangleAlert, type LucideIcon } from "lucide-react";
import { useId, useRef, type ReactNode } from "react";
import { createPortal } from "react-dom";

import { Button } from "@/components/ui/Button";
import { useIsClient } from "@/hooks/useIsClient";
import { useOverlay } from "@/hooks/useOverlay";
import { cn } from "@/lib/cn";

type ConfirmDialogTone = "destructive" | "neutral";

type ConfirmDialogProps = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmLabel: string;
  cancelLabel: string;
  pending?: boolean;
  tone?: ConfirmDialogTone;
  icon?: LucideIcon;
  children?: ReactNode;
};

const TONE_ICON: Record<ConfirmDialogTone, string> = {
  destructive: "bg-destructive/15 text-destructive",
  neutral: "bg-primary/15 text-primary",
};

export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel,
  cancelLabel,
  pending = false,
  tone = "destructive",
  icon: Icon = TriangleAlert,
  children,
}: ConfirmDialogProps): ReactNode {
  const mounted = useIsClient();
  const titleId = useId();
  const descriptionId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const { onPanelKeyDown } = useOverlay({ open, onClose, panelRef });

  if (!mounted) {
    return null;
  }

  return createPortal(
    <AnimatePresence>
      {open ? (
        <div className="fixed inset-0 z-70 flex items-center justify-center p-4">
          <motion.div
            className="bg-overlay absolute inset-0 backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            aria-hidden
          />
          <motion.div
            ref={panelRef}
            role="alertdialog"
            aria-modal="true"
            aria-labelledby={titleId}
            aria-describedby={descriptionId}
            className="glass-surface rounded-glass relative w-full max-w-xl overflow-hidden p-6 backdrop-blur-3xl sm:p-7"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 340, damping: 28 }}
            onKeyDown={onPanelKeyDown}
          >
            <div className="flex items-center gap-2">

            <div
              className={cn(
                "mb-4 flex size-12 items-center justify-center rounded-2xl",
                TONE_ICON[tone],
              )}
              >
              <Icon className="size-6" aria-hidden />
            </div>

            <h2 id={titleId} className="font-heading text-prose text-xl font-semibold tracking-tight -mt-5">
              {title}
            </h2>

              </div>
            <p id={descriptionId} className="text-prose-muted mt- text-sm leading-relaxed">
              {description}
            </p>

            {children ? <div className="mt-4">{children}</div> : null}

            <div className="mt-6 grid grid-cols-2 gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={onClose}
                disabled={pending}
              >
                {cancelLabel}
              </Button>
              <Button
                type="button"
                variant={tone === "destructive" ? "destructive" : "solid"}
                size="sm"
                onClick={onConfirm}
                disabled={pending}
              >
                {confirmLabel}
              </Button>
            </div>
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>,
    document.body,
  );
}
