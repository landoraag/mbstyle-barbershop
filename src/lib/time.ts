import { addDays, format, startOfDay } from "date-fns";
import { ptBR } from "date-fns/locale";
import { site } from "@/config/site";
import type { Barber, Weekday } from "./types";

export const toMin = (hhmm: string) => {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
};
export const toHHmm = (min: number) =>
  `${String(Math.floor(min / 60)).padStart(2, "0")}:${String(min % 60).padStart(2, "0")}`;

export const dateKey = (d: Date) => format(d, "yyyy-MM-dd");
export const parseKey = (key: string) => {
  const [y, m, d] = key.split("-").map(Number);
  return new Date(y, m - 1, d);
};

export const fmtLong = (key: string) => format(parseKey(key), "EEEE, d 'de' MMMM", { locale: ptBR });
export const fmtShort = (key: string) => format(parseKey(key), "dd/MM", { locale: ptBR });
export const weekdayShort = (d: Date) => format(d, "EEE", { locale: ptBR }).replace(".", "");
export const monthShort = (d: Date) => format(d, "MMM", { locale: ptBR }).replace(".", "");

export const brl = (v: number) =>
  v.toLocaleString("pt-BR", { style: "currency", currency: "BRL", minimumFractionDigits: 0 });

export const slotsNeeded = (durationMin: number) => Math.max(1, Math.ceil(durationMin / site.slotMinutes));

/** Todos os blocos de trabalho do barbeiro em um dia (sem considerar ocupação). */
export function workingSlots(barber: Barber, key: string): string[] {
  if (barber.daysOff.includes(key)) return [];
  const day = barber.weekly[parseKey(key).getDay() as Weekday];
  if (!day?.open) return [];
  const out: string[] = [];
  const end = toMin(day.end);
  const bs = day.breakStart ? toMin(day.breakStart) : null;
  const be = day.breakEnd ? toMin(day.breakEnd) : null;
  for (let t = toMin(day.start); t + site.slotMinutes <= end; t += site.slotMinutes) {
    if (bs !== null && be !== null && be > bs && t < be && t + site.slotMinutes > bs) continue;
    out.push(toHHmm(t));
  }
  return out;
}

export type SlotState = "free" | "busy" | "past";

/**
 * Horários de início para um serviço: o bloco inicial e os seguintes
 * (conforme a duração) precisam estar livres e ser consecutivos.
 */
export function availability(
  barber: Barber,
  key: string,
  busy: Set<string>,
  durationMin: number,
  now = new Date(),
): { time: string; state: SlotState }[] {
  const all = workingSlots(barber, key);
  const set = new Set(all);
  const need = slotsNeeded(durationMin);
  const isToday = key === dateKey(now);
  const nowMin = now.getHours() * 60 + now.getMinutes();
  return all.map((time) => {
    if (isToday && toMin(time) <= nowMin + 15) return { time, state: "past" as const };
    for (let i = 0; i < need; i++) {
      const t = toHHmm(toMin(time) + i * site.slotMinutes);
      if (!set.has(t) || busy.has(t)) return { time, state: "busy" as const };
    }
    return { time, state: "free" as const };
  });
}

export const slotRange = (time: string, durationMin: number) =>
  Array.from({ length: slotsNeeded(durationMin) }, (_, i) => toHHmm(toMin(time) + i * site.slotMinutes));

export const busyId = (barberId: string, date: string, time: string) =>
  `${barberId}_${date}_${time.replace(":", "")}`;

export function nextDays(n = site.bookingWindowDays, from = new Date()) {
  const s = startOfDay(from);
  return Array.from({ length: n }, (_, i) => addDays(s, i));
}

export const periodOf = (time: string) => {
  const m = toMin(time);
  if (m < 12 * 60) return "Manhã";
  if (m < 18 * 60) return "Tarde";
  return "Noite";
};

export const onlyDigits = (s: string) => s.replace(/\D/g, "");
export function maskPhone(v: string) {
  const d = onlyDigits(v).slice(0, 11);
  if (d.length <= 2) return d ? `(${d}` : "";
  if (d.length <= 7) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}
export const validPhone = (v: string) => /^\d{10,11}$/.test(onlyDigits(v));
