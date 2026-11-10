"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { addDays, addMonths, endOfMonth, format, startOfMonth, startOfWeek } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Check, ChevronLeft, ChevronRight, Coffee } from "lucide-react";
import { clsx } from "clsx";
import { useApp } from "../providers";
import { Spinner } from "../ui";
import { data } from "@/lib/data";
import { dateKey } from "@/lib/time";
import type { Barber, DaySchedule, Weekday } from "@/lib/types";

const WEEK: { d: Weekday; label: string }[] = [
  { d: 1, label: "Segunda" },
  { d: 2, label: "Terça" },
  { d: 3, label: "Quarta" },
  { d: 4, label: "Quinta" },
  { d: 5, label: "Sexta" },
  { d: 6, label: "Sábado" },
  { d: 0, label: "Domingo" },
];

const timeOptions = Array.from({ length: 36 }, (_, i) => {
  const m = 6 * 60 + i * 30;
  return `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
}).concat(["00:00"]);

function Toggle({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      role="switch"
      aria-checked={on}
      onClick={() => onChange(!on)}
      className={clsx("relative h-7 w-12 shrink-0 rounded-full transition-colors", on ? "bg-gold" : "bg-white/10")}
    >
      <motion.span
        layout
        transition={{ type: "spring", stiffness: 500, damping: 32 }}
        className={clsx("absolute top-1 h-5 w-5 rounded-full shadow", on ? "right-1 bg-ink" : "left-1 bg-bone/70")}
      />
    </button>
  );
}

const sel =
  "h-10 rounded-xl border border-line bg-graphite px-2.5 text-sm tabular-nums outline-none focus:border-gold/60";

export function AvailabilityView({ barber }: { barber: Barber }) {
  const { refreshCatalog } = useApp();
  const [weekly, setWeekly] = useState(barber.weekly);
  const [daysOff, setDaysOff] = useState<string[]>(barber.daysOff);
  const [month, setMonth] = useState(startOfMonth(new Date()));
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const dirty = JSON.stringify(weekly) !== JSON.stringify(barber.weekly) || JSON.stringify([...daysOff].sort()) !== JSON.stringify([...barber.daysOff].sort());

  const set = (d: Weekday, patch: Partial<DaySchedule>) => setWeekly((w) => ({ ...w, [d]: { ...w[d], ...patch } }));

  async function save() {
    setSaving(true);
    const today = dateKey(new Date());
    await data.updateBarber(barber.id, { weekly, daysOff: daysOff.filter((d) => d >= today).sort() });
    await refreshCatalog();
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2200);
  }

  const gridStart = startOfWeek(month, { weekStartsOn: 1 });
  const cells = Array.from({ length: 42 }, (_, i) => addDays(gridStart, i)).filter(
    (d, i) => i < 35 || d <= endOfMonth(month),
  );
  const todayKey = dateKey(new Date());

  return (
    <div>
      <p className="text-[0.7rem] uppercase tracking-[0.35em] text-gold">Horários</p>
      <h1 className="mt-2 font-display text-4xl">Sua disponibilidade</h1>
      <p className="mt-2 max-w-lg text-sm text-mute">
        Defina seus dias e horários de trabalho, intervalo e folgas. Os clientes só veem os horários livres.
      </p>

      <div className="mt-8 grid gap-6 xl:grid-cols-[1.3fr_1fr]">
        <section className="rounded-3xl border border-line bg-coal p-5 sm:p-6">
          <h2 className="font-display text-xl">Semana padrão</h2>
          <ul className="mt-5 divide-y divide-line">
            {WEEK.map(({ d, label }) => {
              const day = weekly[d];
              const hasBreak = Boolean(day.breakStart && day.breakEnd);
              return (
                <li key={d} className="py-4">
                  <div className="flex flex-wrap items-center gap-3">
                    <Toggle on={day.open} onChange={(v) => set(d, { open: v })} />
                    <span className={clsx("w-24 text-sm", !day.open && "text-mute")}>{label}</span>
                    <AnimatePresence initial={false}>
                      {day.open ? (
                        <motion.div
                          key="on"
                          initial={{ opacity: 0, x: -8 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0 }}
                          className="flex flex-1 flex-wrap items-center gap-2"
                        >
                          <select className={sel} value={day.start} onChange={(e) => set(d, { start: e.target.value })}>
                            {timeOptions.map((t) => <option key={t}>{t}</option>)}
                          </select>
                          <span className="text-mute">até</span>
                          <select className={sel} value={day.end} onChange={(e) => set(d, { end: e.target.value })}>
                            {timeOptions.map((t) => <option key={t}>{t}</option>)}
                          </select>
                          <button
                            onClick={() => set(d, hasBreak ? { breakStart: null, breakEnd: null } : { breakStart: "12:00", breakEnd: "13:00" })}
                            className={clsx(
                              "ml-auto flex h-10 items-center gap-1.5 rounded-xl border px-3 text-xs transition",
                              hasBreak ? "border-gold/50 text-gold" : "border-line text-mute hover:text-bone",
                            )}
                          >
                            <Coffee className="h-3.5 w-3.5" /> Intervalo
                          </button>
                        </motion.div>
                      ) : (
                        <motion.span key="off" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm text-mute">
                          Folga
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </div>
                  <AnimatePresence initial={false}>
                    {day.open && hasBreak && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="flex flex-wrap items-center gap-2 pt-3 pl-[8.25rem] text-sm text-mute">
                          Intervalo de
                          <select className={sel} value={day.breakStart ?? ""} onChange={(e) => set(d, { breakStart: e.target.value })}>
                            {timeOptions.map((t) => <option key={t}>{t}</option>)}
                          </select>
                          às
                          <select className={sel} value={day.breakEnd ?? ""} onChange={(e) => set(d, { breakEnd: e.target.value })}>
                            {timeOptions.map((t) => <option key={t}>{t}</option>)}
                          </select>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </li>
              );
            })}
          </ul>
        </section>

        <section className="rounded-3xl border border-line bg-coal p-5 sm:p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-xl">Folgas e dias livres</h2>
            <div className="flex items-center gap-1">
              <button onClick={() => setMonth((m) => addMonths(m, -1))} disabled={month <= startOfMonth(new Date())} className="rounded-full p-2 hover:bg-white/5 disabled:opacity-30" aria-label="Mês anterior">
                <ChevronLeft className="h-4 w-4" />
              </button>
              <span className="w-28 text-center text-sm capitalize">{format(month, "MMMM yyyy", { locale: ptBR })}</span>
              <button onClick={() => setMonth((m) => addMonths(m, 1))} className="rounded-full p-2 hover:bg-white/5" aria-label="Próximo mês">
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
          <p className="mt-1 text-xs text-mute">Toque num dia para marcar como folga.</p>
          <div className="mt-5 grid grid-cols-7 gap-1.5 text-center">
            {["S", "T", "Q", "Q", "S", "S", "D"].map((l, i) => (
              <span key={i} className="pb-1 text-[0.65rem] text-mute">{l}</span>
            ))}
            {cells.map((d) => {
              const k = dateKey(d);
              const inMonth = d.getMonth() === month.getMonth();
              const past = k < todayKey;
              const off = daysOff.includes(k);
              const weeklyOff = !weekly[d.getDay() as Weekday].open;
              return (
                <button
                  key={k}
                  disabled={past || !inMonth}
                  onClick={() => setDaysOff((s) => (off ? s.filter((x) => x !== k) : [...s, k]))}
                  className={clsx(
                    "relative aspect-square rounded-xl text-sm tabular-nums transition",
                    !inMonth && "invisible",
                    past && "text-bone/15",
                    off ? "bg-bad/15 text-bad ring-1 ring-bad/40" : weeklyOff ? "text-bone/30" : "hover:bg-white/5",
                    k === todayKey && !off && "ring-1 ring-gold/60",
                  )}
                >
                  {d.getDate()}
                  {off && <span className="absolute inset-x-0 bottom-1 text-[0.5rem] uppercase">folga</span>}
                </button>
              );
            })}
          </div>
        </section>
      </div>

      <AnimatePresence>
        {(dirty || saved) && (
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            className="glass fixed bottom-24 left-1/2 z-50 flex -translate-x-1/2 items-center gap-4 rounded-full py-2 pl-5 pr-2 shadow-2xl lg:bottom-8"
          >
            <span className="text-sm">{saved ? "Horários salvos!" : "Alterações não salvas"}</span>
            {!saved && (
              <button
                onClick={save}
                disabled={saving}
                className="flex h-10 items-center gap-2 rounded-full bg-gold px-5 text-sm font-semibold text-ink"
              >
                {saving ? <Spinner /> : <Check className="h-4 w-4" />} Salvar
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
