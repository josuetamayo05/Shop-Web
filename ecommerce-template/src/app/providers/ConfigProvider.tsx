import React, { createContext, useContext } from "react";
import site from "../../config/site.json";

export type SiteConfig = typeof site;

const ConfigContext = createContext<SiteConfig | null>(null);

export function ConfigProvider({ children }: { children: React.ReactNode }) {
  return <ConfigContext.Provider value={site}>{children}</ConfigContext.Provider>;
}

export function useConfig() {
  const ctx = useContext(ConfigContext);
  if (!ctx) throw new Error("useConfig must be used within <ConfigProvider>");
  return ctx;
}