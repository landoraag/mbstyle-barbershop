"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useRef } from "react";
import { ChevronLeft, ChevronRight, Lock } from "lucide-react";
import { clsx } from "clsx";
import { availability, dateKey, monthShort, periodOf, weekdayShort, workingSlots } from "@/lib/time";
import type { Barber } from "@/lib/types";
import { ease } from "../ui";

/** Faixa horizontal de datas com indicador de lotação de cada dia. */
export function DateStrip({
  barber,
  days,
  busyByDay,
  duration,
  value,
  onChange,
}: {
  barber: Barber;
  days: Date[];
  busyByDay: Map<string, Set<string>> | null;
  duration: number;
  value: string | null;
  onChange: (d: string) => void;
}) {
  const scroller = useRef<HTMLDivElement>(null);

  const meta = useMemo(
    () =>
      days.map((d) => {
        const key = dateKey(d);
        const total = workingSlots(barber, key).length;
        if (!total) return { key, d, state: "off" as const, ratio: 0, free: 0 };
        if (!busyByDay) return { key, d, state: "loading" as const, ratio: 0, free: 0 };
        const slots = availability(barber, key, busyByDay.get(key) ?? new Set(), duration);
        const free = slots.filter((s) => s.state === "free").length;
        return { key, d, state: free ? ("open" as const) : ("full" as const), ratio: free / total, free };
      }),
    [days, barber, busyByDay, duration],
  );

  useEffect(() => {
    if (!value || !scroller.current) return;
    const el = scroller.current.querySelector<HTMLElement>(`[data-key="${value}"]`);
    el?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  }, [value]);

  const scroll = (dir: number) => scroller.current?.scrollBy({ left: dir * 320, behavior: "smooth" });

  return (
    <div className="relative">
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-bone/70 first-letter:uppercase">
          {value ? `${monthShort(new Date(value + "T12:00"))} ${new Date(value + "T12:00").getFullYear()}` : "Escolha o dia"}
        </p>
        <div className="flex gap-1.5">
          <button onClick={() => scroll(-1)} aria-label="Dias anteriores" className="flex h-9 w-9 items-center justify-center rounded-full border border-line hover:border-gold/50">
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button onClick={() => scroll(1)} aria-label="Próximos dias" className="flex h-9 w-9 items-center justify-center rounded-full border border-line hover:border-gold/50">
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
      <div
        ref={scroller}
        className="no-scrollbar -mx-1 flex snap-x gap-2 overflow-x-auto px-1 pb-2 [mask-image:linear-gradient(90deg,transparent,#000_3%,#000_97%,transparent)]"
      >
        {meta.map((m, i) => {
          const active = value === m.key;
          const disabled = m.state === "off" || m.state === "full";
          return (
            <motion.button
              key={m.key}
              data-key={m.key}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(i, 10) * 0.03, duration: 0.5, ease }}
              disabled={disabled}
              onClick={() => onChange(m.key)}
              className={clsx(
                "relative flex w-[4.4rem] shrink-0 snap-start flex-col items-center rounded-[4px] border py-3 transition-colors",
                active
                  ? "border-gold text-ink"
                  : disabled
                    ? "cursor-not-allowed border-line/50 text-bone/25"
                    : "border-line text-bone hover:border-gold/50",
              )}
            >
              {active && (
                <motion.span
                  layoutId="date-active"
                  className="absolute inset-0 rounded-[4px] bg-bone"
                  transition={{ type: "spring", stiffness: 400, damping: 34 }}
                />
              )}
              <span className={clsx("relative text-[0.65rem] uppercase tracking-widest", active ? "text-ink/70" : "text-mute")}>
                {i === 0 ? "Hoje" : weekdayShort(m.d)}
              </span>
              <span className="relative mt-1 font-display text-2xl leading-none">{m.d.getDate()}</span>
              <span className={clsx("relative mt-1 text-[0.62rem] capitalize", active ? "text-ink/70" : "text-mute")}>
                {monthShort(m.d)}
              </span>
              {/* barra de lotação */}
              <span className="relative mt-2.5 h-1 w-8 overflow-hidden rounded-full bg-current/10">
                {m.state === "open" && (
                  <span
                    className={clsx("absolute inset-y-0 left-0 rounded-full", active ? "bg-ink" : m.ratio < 0.25 ? "bg-warn" : "bg-ok")}
                    style={{ width: `${Math.max(15, m.ratio * 100)}%` }}
                  />
                )}
                {m.state === "loading" && <span className="absolute inset-0 animate-pulse bg-white/10" />}
              </span>
              <span className={clsx("relative mt-1 text-[0.55rem]", active ? "text-ink/60" : "text-mute/70")}>
                {m.state === "off" ? "Folga" : m.state === "full" ? "Lotado" : m.state === "open" ? `${m.free} livres` : "···"}
              </span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

/** Grade de horários: só mostra livre / ocupado — nunca quem está agendado. */
export function SlotGrid({
  barber,
  date,
  busy,
  duration,
  value,
  onChange,
}: {
  barber: Barber;
  date: string;
  busy: Set<string> | null;
  duration: number;
  value: string | null;
  onChange: (t: string) => void;
}) {
  const slots = useMemo(() => (busy ? availability(barber, date, busy, duration) : null), [barber, date, busy, duration]);

  const groups = useMemo(() => {
    const g = new Map<string, NonNullable<typeof slots>>();
    slots?.forEach((s) => {
      const p = periodOf(s.time);
      g.set(p, [...(g.get(p) ?? []), s]);
    });
    return [...g.entries()];
  }, [slots]);

  if (!slots)
    return (
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
        {Array.from({ length: 15 }).map((_, i) => (
          <div key={i} className="h-12 animate-pulse rounded-[3px] bg-white/[0.04]" />
        ))}
      </div>
    );

  if (!slots.some((s) => s.state === "free"))
    return (
      <div className="rounded-[4px] border border-dashed border-line p-8 text-center text-sm text-mute">
        Nenhum horário livre neste dia. Tente outra data.
      </div>
    );

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={date}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.35, ease }}
        className="space-y-6"
      >
        {groups.map(([period, list]) => (
          <div key={period}>
            <div className="mb-3 flex items-center gap-3">
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.25em] text-mute">{period}</p>
              <span className="h-px flex-1 bg-line" />
              <p className="text-[0.68rem] text-mute">{list.filter((s) => s.state === "free").length} livres</p>
            </div>
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
              {list.map((s, i) => {
                const active = value === s.time;
                const free = s.state === "free";
                return (
                  <motion.button
                    key={s.time}
                    initial={{ opacity: 0, scale: 0.92 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.015, duration: 0.3 }}
                    whileTap={free ? { scale: 0.95 } : undefined}
                    disabled={!free}
                    onClick={() => onChange(s.time)}
                    aria-label={free ? `Horário ${s.time} livre` : `Horário ${s.time} indisponível`}
                    className={clsx(
                      "relative flex h-12 items-center justify-center gap-1.5 rounded-[3px] border text-sm tabular-nums transition-colors",
                      active
                        ? "border-gold font-semibold text-ink"
                        : free
                          ? "border-line bg-graphite/40 hover:border-gold/60 hover:bg-gold/5"
                          : "cursor-not-allowed border-transparent bg-white/[0.02] text-bone/20",
                    )}
                  >
                    {active && (
                      <motion.span
                        layoutId="slot-active"
                        className="absolute inset-0 rounded-[3px] bg-gold shadow-[0_8px_24px_-6px_rgba(201,163,92,0.6)]"
                        transition={{ type: "spring", stiffness: 420, damping: 32 }}
                      />
                    )}
                    <span className={clsx("relative", !free && "line-through decoration-bone/20")}>{s.time}</span>
                    {s.state === "busy" && <Lock className="relative h-3 w-3" />}
                  </motion.button>
                );
              })}
            </div>
          </div>
        ))}
        <div className="flex flex-wrap gap-4 pt-1 text-[0.7rem] text-mute">
          <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded border border-line bg-graphite" /> Livre</span>
          <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded bg-white/[0.06]" /> Ocupado</span>
          <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded bg-gold" /> Selecionado</span>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
