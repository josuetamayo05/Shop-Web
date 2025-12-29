/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext } from "react";
import checkout from "../../config/checkout.json";

export type CheckoutConfig = typeof checkout;

const CheckoutContext = createContext<CheckoutConfig | null>(null);

export function CheckoutProvider({ children }: { children: React.ReactNode }) {
  return (
    <CheckoutContext.Provider value={checkout}>
      {children}
    </CheckoutContext.Provider>
  );
}

export function useCheckoutConfig() {
  const ctx = useContext(CheckoutContext);
  if (!ctx) throw new Error("useCheckoutConfig must be used within <CheckoutProvider>");
  return ctx;
}