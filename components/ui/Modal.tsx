"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useId, useRef, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { useTranslations } from "next-intl";

import { useIsClient } from "@/hooks/useIsClient";
import { useOverlay } from "@/hooks/useOverlay";
import { cn } from "@/lib/cn";

type ModalProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  className?: string;
};

export function Modal({
  open,
  onClose,
  title,
  children,
  className,
}: ModalProps): ReactNode {
  const t = useTranslations("ui");
  const mounted = useIsClient();
  const titleId = useId();
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
            className="bg-overlay backdrop-blur-[2px] absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            aria-hidden
          />
          <motion.div
            ref={panelRef}  
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            className={cn(
              "glass-surface backdrop-blur-xl rounded-glass relative w-full max-w-md p-6 sm:p-8",
              className,
              "overflow-visible",
            )}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ type: "spring", stiffness: 320, damping: 28 }}
            onKeyDown={onPanelKeyDown}
          >
            <button
              type="button"
              onClick={onClose}
              aria-label={t("close")}
              className="text-prose-muted hover:text-prose absolute inset-e-4 top-4 transition-colors"
            >
              <X className="size-5" aria-hidden />
            </button>
            <h2 id={titleId} className="font-heading text-prose pe-8 text-xl">
              {title}
            </h2>
            <div className="mt-4">{children}</div>
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>,
    document.body,
  );
}
