/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useMemo, useState } from "react";
import catalog from "../../config/catalog.json";
import { readJson, writeJson } from "../../core/lib/storage";

export type CatalogConfig = typeof catalog;

const KEY = "catalog-override-v1";

type CatalogContextValue = {
  catalog: CatalogConfig;
  hasOverride: boolean;
  setCatalogOverride: (next: CatalogConfig) => void;
  resetCatalogOverride: () => void;
};

const CatalogContext = createContext<CatalogContextValue | null>(null);

function loadCatalog(): { catalog: CatalogConfig; hasOverride: boolean } {
  const override = readJson<CatalogConfig | null>(KEY, null);
  if (override) return { catalog: override, hasOverride: true };
  return { catalog, hasOverride: false };
}

export function CatalogProvider({ children }: { children: React.ReactNode }) {
  const initial = loadCatalog();
  const [state, setState] = useState<CatalogConfig>(initial.catalog);
  const [hasOverride, setHasOverride] = useState<boolean>(initial.hasOverride);

  const value = useMemo<CatalogContextValue>(() => {
    return {
      catalog: state,
      hasOverride,
      setCatalogOverride: (next) => {
        writeJson(KEY, next);
        setState(next);
        setHasOverride(true);
      },
      resetCatalogOverride: () => {
        localStorage.removeItem(KEY);
        setState(catalog);
        setHasOverride(false);
      },
    };
  }, [state, hasOverride]);

  return <CatalogContext.Provider value={value}>{children}</CatalogContext.Provider>;
}

export function useCatalog() {
  const ctx = useContext(CatalogContext);
  if (!ctx) throw new Error("useCatalog must be used within <CatalogProvider>");
  return ctx.catalog;
}

export function useCatalogActions() {
  const ctx = useContext(CatalogContext);
  if (!ctx) throw new Error("useCatalogActions must be used within <CatalogProvider>");
  return {
    hasOverride: ctx.hasOverride,
    setCatalogOverride: ctx.setCatalogOverride,
    resetCatalogOverride: ctx.resetCatalogOverride,
  };
}