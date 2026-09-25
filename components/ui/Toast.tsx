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
import { useEffect, useRef, type FocusEvent, type ReactNode } from "react";

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

const KIND_ACCENT: Record<ToastKind, string> = {
  success: "bg-toast-success-border",
  info: "bg-toast-info-border",
  warn: "bg-toast-warning-border",
  error: "bg-toast-error-border",
  neutral: "bg-toast-neutral-border",
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

  function handleBlur(event: FocusEvent<HTMLDivElement>): void {
    if (!event.currentTarget.contains(event.relatedTarget)) {
      resume();
    }
  }

  return (
    <div
      role={toast.kind === "error" ? "alert" : "status"}
      className={cn(
        "group pointer-events-auto relative isolate flex w-full gap-3.5 overflow-hidden rounded-[1.35rem] border p-4 pe-3.5 shadow-[0_20px_70px_-30px_currentColor] backdrop-blur-xl",
        KIND_SURFACE[toast.kind],
      )}
      onMouseEnter={pause}
      onMouseLeave={resume}
      onFocusCapture={pause}
      onBlurCapture={handleBlur}
    >
      <span aria-hidden className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-current/50 to-transparent" />
      <span aria-hidden className="absolute -start-10 -top-12 -z-10 size-32 rounded-full bg-current/10 blur-3xl" />

      <span className="relative mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-2xl bg-surface/45 shadow-sm ring-1 ring-current/20 backdrop-blur-md">
        <Icon className="size-[1.125rem]" aria-hidden />
        <span aria-hidden className="absolute inset-1 rounded-xl border border-current/10" />
      </span>
      <div className="relative min-w-0 flex-1 py-0.5">
        <p className="text-sm font-bold tracking-[-0.01em]">{toast.title}</p>
        {toast.description ? (
          <p className="mt-1 text-sm leading-5 opacity-80">{toast.description}</p>
        ) : null}
      </div>
      <button
        type="button"
        className="relative -mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full opacity-65 transition hover:bg-current/10 hover:opacity-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current"
        aria-label={t("close")}
        onClick={() => dismiss(toast.id)}
      >
        <X className="size-4" aria-hidden />
      </button>

      <span aria-hidden className="absolute inset-x-0 bottom-0 h-1 bg-current/8">
        <span
          className={cn("toast-progress block h-full w-full", KIND_ACCENT[toast.kind])}
          style={{ animationDuration: `${TOAST_DURATION_MS}ms` }}
        />
      </span>
    </div>
  );
}
