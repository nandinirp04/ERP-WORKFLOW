"use client";

import { useEffect } from "react";

import { useUIStore } from "@/store/ui-store";

const toneStyles = {
  success: "border-[#BBF7D0] bg-[#F0FDF4] text-[#166534]",
  error: "border-[#FECACA] bg-[#FEF2F2] text-[#B91C1C]",
  info: "border-[#BFDBFE] bg-[#EFF6FF] text-[#1D4ED8]",
};

export function ToastViewport() {
  const toasts = useUIStore((state) => state.toasts);
  const removeToast = useUIStore((state) => state.removeToast);

  useEffect(() => {
    if (!toasts.length) {
      return;
    }

    const timers = toasts.map((toast) =>
      setTimeout(() => removeToast(toast.id), 2500)
    );

    return () => timers.forEach((timer) => clearTimeout(timer));
  }, [removeToast, toasts]);

  return (
    <div className="pointer-events-none fixed bottom-4 right-4 z-[60] space-y-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto rounded-xl border px-4 py-3 text-sm font-medium shadow-lg ${toneStyles[toast.type]}`}
        >
          {toast.message}
        </div>
      ))}
    </div>
  );
}
