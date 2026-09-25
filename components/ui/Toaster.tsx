"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import { createPortal } from "react-dom";

import { Toast } from "@/components/ui/Toast";
import { useIsClient } from "@/hooks/useIsClient";
import { toastMotion, toastReducedMotion } from "@/lib/motion/variants";
import { useToastStore } from "@/store/toastStore";

export function Toaster(): ReactNode {
  const mounted = useIsClient();
  const reduceMotion = useReducedMotion();
  const toasts = useToastStore((state) => state.toasts);

  if (!mounted) {
    return null;
  }

  return createPortal(
    <div
      className="pointer-events-none fixed inset-x-0 top-[max(1rem,env(safe-area-inset-top))] z-90 mx-auto flex w-[min(calc(100%-2rem),30rem)] flex-col gap-2.5 sm:top-6"
      aria-live="polite"
      aria-relevant="additions"
    >
      <AnimatePresence initial={false} mode="popLayout">
        {toasts.map((item) => (
          <motion.div
            key={item.id}
            layout
            variants={reduceMotion ? toastReducedMotion : toastMotion}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ layout: { type: "spring", stiffness: 420, damping: 32 } }}
          >
            <Toast toast={item} />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>,
    document.body,
  );
}
