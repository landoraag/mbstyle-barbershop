"use client";

import { useEffect, useMemo, useState } from "react";
import { addDays } from "date-fns";
import { data } from "./data";
import { availability, dateKey } from "./time";
import type { Barber, BusySlot } from "./types";

/** Ocupação pública de um barbeiro num dia (atualiza em tempo real). */
export function useBusy(barberId: string | null, date: string | null) {
  const [slots, setSlots] = useState<BusySlot[] | null>(null);
  useEffect(() => {
    if (!barberId || !date) return;
    setSlots(null);
    return data.watchBusy(barberId, date, setSlots);
  }, [barberId, date]);
  return slots;
}

/** Próximo horário livre do barbeiro (hoje ou nos próximos dias). */
export function useNextFree(barber: Barber | null, lookahead = 4) {
  const [byDay, setByDay] = useState<Record<string, BusySlot[]>>({});
  const days = useMemo(
    () => Array.from({ length: lookahead }, (_, i) => dateKey(addDays(new Date(), i))),
    [lookahead],
  );
  useEffect(() => {
    if (!barber) return;
    const unsubs = days.map((d) => data.watchBusy(barber.id, d, (s) => setByDay((p) => ({ ...p, [d]: s }))));
    return () => unsubs.forEach((u) => u());
  }, [barber, days]);

  return useMemo(() => {
    if (!barber) return null;
    for (const d of days) {
      const busy = byDay[d];
      if (!busy) return undefined; // carregando
      const free = availability(barber, d, new Set(busy.map((b) => b.time)), 30).find((s) => s.state === "free");
      if (free) return { date: d, time: free.time, dayIndex: days.indexOf(d) };
    }
    return null;
  }, [barber, byDay, days]);
}
