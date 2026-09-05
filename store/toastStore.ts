import { create } from "zustand";

/** success: request/action worked. info: admin/system note. warn: limits and cautions. error: failure. neutral: anything else. */
export type ToastKind = "success" | "info" | "warn" | "error" | "neutral";

export type ToastItem = {
  id: string;
  kind: ToastKind;
  title: string;
  description?: string;
};

export const TOAST_DURATION_MS = 4500;
const TOAST_MAX = 5;

type PushToastInput = {
  kind: ToastKind;
  title: string;
  description?: string;
};

type ToastStore = {
  toasts: ToastItem[];
  push: (input: PushToastInput) => string;
  dismiss: (id: string) => void;
};

function toastId(): string {
  return `toast-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

export const useToastStore = create<ToastStore>((set) => ({
  toasts: [],
  push: (input) => {
    const id = toastId();
    set((state) => ({
      toasts: [{ id, ...input }, ...state.toasts].slice(0, TOAST_MAX),
    }));
    return id;
  },
  dismiss: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((item) => item.id !== id),
    })),
}));

function show(kind: ToastKind, title: string, description?: string): string {
  return useToastStore.getState().push({ kind, title, description });
}

export const toast = {
  success: (title: string, description?: string) => show("success", title, description),
  info: (title: string, description?: string) => show("info", title, description),
  warn: (title: string, description?: string) => show("warn", title, description),
  error: (title: string, description?: string) => show("error", title, description),
  neutral: (title: string, description?: string) => show("neutral", title, description),
  dismiss: (id: string) => useToastStore.getState().dismiss(id),
};
