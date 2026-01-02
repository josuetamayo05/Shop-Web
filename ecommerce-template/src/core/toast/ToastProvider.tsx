import type { ReactNode } from "react";
import { useCallback, useMemo, useState } from "react";
import { ToastContext, type Toast, type ToastType } from "./toast.context";

function toastStyles(type:ToastType){
    switch(type){
        case "success":
            return "border-emerald-200 bg-emerald-50 text-emerald-900";
        case "error":
            return "order-red-200 bg-red-50 text-red-900";
        default:
            return "border-slate-200 bg-white text-slate-900";
    }
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const push = useCallback((message: string, type: ToastType = "success") => {
    const id = `t_${Date.now()}_${Math.random().toString(16).slice(2)}`;

    setToasts((prev) => [...prev, { id, message, type }]);

    // auto-cerrar
    window.setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 2200);
  }, []);

  const api = useMemo(() => ({ push }), [push]);

  return (
    <ToastContext.Provider value={api}>
      {children}

      {/* Toaster */}
      <div className="fixed right-4 top-4 z-50 flex w-[320px] max-w-[calc(100vw-2rem)] flex-col gap-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`rounded-2xl border px-4 py-3 text-sm shadow-sm ${toastStyles(t.type)}`}
          >
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

