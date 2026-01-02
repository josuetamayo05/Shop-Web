import { createContext, useContext } from "react";

export type ToastType = "success" | "error" | "info";

export type Toast={
    id:string;
    message: string;
    type:ToastType;
}

export type ToastApi={
    push:(message:string, type?: ToastType)=>void;
};

export const ToastContext=createContext<ToastApi | null>(null);

export function useToast(){
    const ctx = useContext(ToastContext);
    if(!ctx) throw new Error("useToast must be used within <ToastProvider>")
    return ctx;
}

