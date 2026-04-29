"use client";

import { create } from "zustand";

type ToastType = "success" | "error" | "info";

export type ToastMessage = {
  id: string;
  message: string;
  type: ToastType;
};

type UIStore = {
  toasts: ToastMessage[];
  pushToast: (payload: Omit<ToastMessage, "id">) => void;
  removeToast: (id: string) => void;
};

export const useUIStore = create<UIStore>((set) => ({
  toasts: [],
  pushToast: ({ message, type }) =>
    set((state) => ({
      toasts: [...state.toasts, { id: crypto.randomUUID(), message, type }],
    })),
  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((toast) => toast.id !== id),
    })),
}));
