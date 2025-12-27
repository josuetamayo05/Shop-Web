import React, { createContext, useContext } from "react";
import catalog from "../../config/catalog.json";

export type CatalogConfig = typeof catalog;

const CatalogContext = createContext<CatalogConfig | null>(null);

export function CatalogProvider({ children }: { children: React.ReactNode }) {
  return (
    <CatalogContext.Provider value={catalog}>
      {children}
    </CatalogContext.Provider>
  );
}

export function useCatalog() {
  const ctx = useContext(CatalogContext);
  if (!ctx) throw new Error("useCatalog must be used within <CatalogProvider>");
  return ctx;
}