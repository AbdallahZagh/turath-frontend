"use client";

import {
  Bell,
  CircleAlert,
  CircleCheck,
  Info,
  TriangleAlert,
  X,
  type LucideIcon,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useRef, type ReactNode } from "react";

import { cn } from "@/lib/cn";
import {
  TOAST_DURATION_MS,
  type ToastItem,
  type ToastKind,
  useToastStore,
} from "@/store/toastStore";

const KIND_ICON: Record<ToastKind, LucideIcon> = {
  success: CircleCheck,
  info: Info,
  warn: TriangleAlert,
  error: CircleAlert,
  neutral: Bell,
};

const KIND_SURFACE: Record<ToastKind, string> = {
  success:
    "bg-toast-success text-toast-success-foreground border-toast-success-border",
  info: "bg-toast-info text-toast-info-foreground border-toast-info-border",
  warn: "bg-toast-warning text-toast-warning-foreground border-toast-warning-border",
  error: "bg-toast-error text-toast-error-foreground border-toast-error-border",
  neutral:
    "bg-toast-neutral text-toast-neutral-foreground border-toast-neutral-border",
};

type ToastProps = {
  toast: ToastItem;
};

export function Toast({ toast }: ToastProps): ReactNode {
  const t = useTranslations("ui");
  const dismiss = useToastStore((state) => state.dismiss);
  const remainingRef = useRef(TOAST_DURATION_MS);
  const startedAtRef = useRef(0);
  const timerRef = useRef<number>(0);
  const Icon = KIND_ICON[toast.kind];

  useEffect(() => {
    function arm(delay: number): void {
      startedAtRef.current = Date.now();
      timerRef.current = window.setTimeout(() => dismiss(toast.id), delay);
    }

    arm(remainingRef.current);
    return () => window.clearTimeout(timerRef.current);
  }, [dismiss, toast.id]);

  function pause(): void {
    window.clearTimeout(timerRef.current);
    remainingRef.current = Math.max(
      0,
      remainingRef.current - (Date.now() - startedAtRef.current),
    );
    if (remainingRef.current === 0) {
      dismiss(toast.id);
    }
  }

  function resume(): void {
    if (remainingRef.current === 0) {
      return;
    }
    startedAtRef.current = Date.now();
    timerRef.current = window.setTimeout(
      () => dismiss(toast.id),
      remainingRef.current,
    );
  }

  return (
    <div
      role="status"
      className={cn(
        "pointer-events-auto flex w-full gap-3 rounded-2xl border p-3.5 shadow-glass backdrop-blur-sm",
        KIND_SURFACE[toast.kind],
      )}
      onMouseEnter={pause}
      onMouseLeave={resume}
    >
      <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-current/12">
        <Icon className="size-4" aria-hidden />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold">{toast.title}</p>
        {toast.description ? (
          <p className="mt-0.5 text-sm leading-relaxed opacity-75">{toast.description}</p>
        ) : null}
      </div>
      <button
        type="button"
        className="hover:bg-current/12 -mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full opacity-70 hover:opacity-100"
        aria-label={t("close")}
        onClick={() => dismiss(toast.id)}
      >
        <X className="size-4" aria-hidden />
      </button>
    </div>
  );
}
