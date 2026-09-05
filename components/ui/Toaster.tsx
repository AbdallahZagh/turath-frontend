"use client";

import { AnimatePresence, motion } from "framer-motion";
import type { ReactNode } from "react";
import { createPortal } from "react-dom";

import { Toast } from "@/components/ui/Toast";
import { useIsClient } from "@/hooks/useIsClient";
import { toastMotion } from "@/lib/motion/variants";
import { useToastStore } from "@/store/toastStore";

export function Toaster(): ReactNode {
  const mounted = useIsClient();
  const toasts = useToastStore((state) => state.toasts);

  if (!mounted) {
    return null;
  }

  return createPortal(
    <div
      className="pointer-events-none fixed inset-e-4 top-4 z-90 flex w-[min(100%-2rem,24rem)] flex-col gap-2"
      aria-live="polite"
      aria-relevant="additions"
    >
      <AnimatePresence initial={false} mode="popLayout">
        {toasts.map((item) => (
          <motion.div
            key={item.id}
            layout
            variants={toastMotion}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <Toast toast={item} />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>,
    document.body,
  );
}
