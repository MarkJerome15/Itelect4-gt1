// src/store/toastStore.ts
// Lightweight toast notification system using Zustand.
import { create } from 'zustand';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number; // ms; default 4000
}

interface ToastState {
  toasts: Toast[];
  push: (toast: Omit<Toast, 'id'>) => void;
  dismiss: (id: string) => void;
}

export const useToastStore = create<ToastState>((set) => ({
  toasts: [],
  push: (toast) => {
    const id = crypto.randomUUID();
    set((s) => ({ toasts: [...s.toasts, { ...toast, id }] }));
    const duration = toast.duration ?? 4000;
    setTimeout(() => {
      set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) }));
    }, duration);
  },
  dismiss: (id) =>
    set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}));

// Convenient helpers so callers don't need to import the whole store
export const toast = {
  success: (title: string, message?: string) =>
    useToastStore.getState().push({ type: 'success', title, message }),
  error: (title: string, message?: string) =>
    useToastStore.getState().push({ type: 'error', title, message }),
  info: (title: string, message?: string) =>
    useToastStore.getState().push({ type: 'info', title, message }),
  warning: (title: string, message?: string) =>
    useToastStore.getState().push({ type: 'warning', title, message }),
};
