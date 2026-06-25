import { create } from "zustand";

export type ToastType = "info" | "success" | "warning" | "error";

export interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
}

interface ToastState {
  toasts: Toast[];
  pushToast: (toast: Omit<Toast, "id">) => string;
  dismissToast: (id: string) => void;
}

const createToastId = () =>
  `toast-${Date.now()}-${Math.random().toString(16).slice(2)}`;

export const useToastStore = create<ToastState>((set, get) => ({
  toasts: [],

  pushToast: (toast) => {
    const id = createToastId();
    set((state) => ({
      toasts: [...state.toasts, { ...toast, id }].slice(-4),
    }));

    window.setTimeout(() => {
      get().dismissToast(id);
    }, toast.type === "error" ? 7000 : 4500);

    return id;
  },

  dismissToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((toast) => toast.id !== id),
    })),
}));
