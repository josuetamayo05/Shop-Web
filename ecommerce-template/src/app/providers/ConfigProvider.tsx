/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useMemo, useState } from "react";
import site from "../../config/site.json";
import { readJson, writeJson } from "../../core/lib/storage";

export type SiteConfig = typeof site;

const KEY = "site-override-v1";


type ConfigContextValue = {
  config: SiteConfig;
  hasOverride: boolean;
  setConfigOverride: (next: SiteConfig) => void;
  resetConfigOverride:() => void;
};

const ConfigContext = createContext<ConfigContextValue | null>(null)

function loadSiteConfig(): { config: SiteConfig; hasOverride: boolean}{
  const override = readJson<SiteConfig | null>(KEY, null);
  if(override) return { config: override, hasOverride: true };
  return { config: site, hasOverride: false };
}

export function ConfigProvider({ children }: { children: React.ReactNode }) {
  const initial = loadSiteConfig();
  const [config, setConfig]=useState<SiteConfig>(initial.config);
  const [hasOverride, setHasOverride] = useState<boolean>(initial.hasOverride);

  const value = useMemo<ConfigContextValue>(()=>{
    return {
      config,
      hasOverride,
      setConfigOverride:(next)=>{
        writeJson(KEY,next);
        setConfig(next);
        setHasOverride(true);
      },
      resetConfigOverride:()=>{
        localStorage.removeItem(KEY);
        setConfig(site);
        setHasOverride(false);
      },
    };
  },[config, hasOverride]);
  return <ConfigContext.Provider value = {value}>{children}</ConfigContext.Provider>;
}

export function useConfig(): SiteConfig {
  const ctx = useContext(ConfigContext);
  if (!ctx) throw new Error("useConfig must be used within <ConfigProvider>");
  return ctx.config;
}

export function useConfigActions() {
  const ctx = useContext(ConfigContext);
  if(!ctx) throw new Error("useConfigActions must be used within ConfigProvider");
  return {
    hasOverride: ctx.hasOverride,
    setConfigOverride: ctx.setConfigOverride,
    resetConfigOverride: ctx.resetConfigOverride,
  };
}
