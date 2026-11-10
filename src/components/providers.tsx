"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { data, type Profile } from "@/lib/data";
import type { Barber, Service } from "@/lib/types";

interface Ctx {
  profile: Profile | null;
  authReady: boolean;
  barbers: Barber[];
  services: Service[];
  catalogReady: boolean;
  refreshCatalog: () => Promise<void>;
}

const AppCtx = createContext<Ctx | null>(null);

export function Providers({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [catalogReady, setCatalogReady] = useState(false);

  const refreshCatalog = async () => {
    const [b, s] = await Promise.all([data.listBarbers(), data.listServices()]);
    setBarbers(b);
    setServices(s);
    setCatalogReady(true);
  };

  useEffect(() => {
    refreshCatalog().catch(() => setCatalogReady(true));
    return data.onAuth((p) => {
      setProfile(p);
      setAuthReady(true);
    });
  }, []);

  return (
    <AppCtx.Provider value={{ profile, authReady, barbers, services, catalogReady, refreshCatalog }}>
      {children}
    </AppCtx.Provider>
  );
}

export function useApp() {
  const c = useContext(AppCtx);
  if (!c) throw new Error("useApp fora do Providers");
  return c;
}
