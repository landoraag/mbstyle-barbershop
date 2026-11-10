"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useState } from "react";
import { addDays } from "date-fns";
import { Ban, Check, CheckCheck, Lock, LockOpen, MessageCircle, StickyNote, X } from "lucide-react";
import { clsx } from "clsx";
import { data } from "@/lib/data";
import { brl, dateKey, fmtLong, monthShort, onlyDigits, toMin, weekdayShort, workingSlots } from "@/lib/time";
import type { Appointment, Barber, BusySlot } from "@/lib/types";
import { StatusChip } from "../status";
import { ease } from "../ui";

const ROW = 68;

export function AgendaView({ barber, appts, busy }: { barber: Barber; appts: Appointment[]; busy: BusySlot[] }) {
  const [date, setDate] = useState(dateKey(new Date()));
  const days = useMemo(() => Array.from({ length: 21 }, (_, i) => addDays(new Date(), i - 3)), []);

  const live = appts.filter((a) => a.status !== "cancelled" && a.status !== "rejected");
  const dayAppts = live.filter((a) => a.date === date);
  const blocked = new Set(busy.filter((b) => b.date === date && b.appointmentId === null).map((b) => b.time));
  const working = workingSlots(barber, date);
  const slots = Array.from(new Set([...working, ...dayAppts.flatMap((a) => a.slots), ...blocked])).sort();

  const startOf = new Map(dayAppts.map((a) => [a.time, a]));
  const covered = new Set(dayAppts.flatMap((a) => a.slots.slice(1)));

  const stats = [
    { label: "Agendados", value: dayAppts.filter((a) => a.status !== "pending").length },
    { label: "Aguardando", value: dayAppts.filter((a) => a.status === "pending").length },
    { label: "Horários livres", value: working.filter((t) => !blocked.has(t) && !dayAppts.some((a) => a.slots.includes(t))).length },
    { label: "Previsto no dia", value: brl(dayAppts.reduce((s, a) => s + a.price, 0)) },
  ];

  const nowMin = new Date().getHours() * 60 + new Date().getMinutes();
  const isToday = date === dateKey(new Date());

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[0.7rem] uppercase tracking-[0.35em] text-gold">Agenda</p>
          <h1 className="mt-2 font-display text-4xl first-letter:uppercase">{fmtLong(date)}</h1>
        </div>
        <button
          onClick={() => setDate(dateKey(new Date()))}
          className="rounded-full border border-line px-4 py-2 text-sm hover:border-gold/50"
        >
          Hoje
        </button>
      </div>

      <div className="no-scrollbar mt-6 flex gap-2 overflow-x-auto pb-2">
        {days.map((d) => {
          const k = dateKey(d);
          const n = live.filter((a) => a.date === k).length;
          const pend = live.some((a) => a.date === k && a.status === "pending");
          const off = workingSlots(barber, k).length === 0;
          const active = k === date;
          return (
            <button
              key={k}
              onClick={() => setDate(k)}
              className={clsx(
                "relative flex w-16 shrink-0 flex-col items-center rounded-2xl border py-2.5 transition",
                active ? "border-gold text-ink" : "border-line hover:border-gold/40",
                off && !active && "opacity-40",
              )}
            >
              {active && <motion.span layoutId="agenda-day" className="absolute inset-0 rounded-2xl bg-gold" transition={{ type: "spring", stiffness: 400, damping: 34 }} />}
              <span className={clsx("relative text-[0.6rem] uppercase tracking-widest", active ? "text-ink/70" : "text-mute")}>{weekdayShort(d)}</span>
              <span className="relative font-display text-xl">{d.getDate()}</span>
              <span className={clsx("relative text-[0.58rem] capitalize", active ? "text-ink/70" : "text-mute")}>{monthShort(d)}</span>
              <span className="relative mt-1 flex h-1.5 gap-0.5">
                {n > 0 && <span className={clsx("h-1.5 w-1.5 rounded-full", active ? "bg-ink" : "bg-gold")} />}
                {pend && <span className="h-1.5 w-1.5 rounded-full bg-ember" />}
              </span>
            </button>
          );
        })}
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05, ease }}
            className="rounded-2xl border border-line bg-coal p-4"
          >
            <p className="text-xs text-mute">{s.label}</p>
            <p className="mt-1 font-display text-3xl">{s.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="mt-8 rounded-3xl border border-line bg-coal p-3 sm:p-5">
        {slots.length === 0 ? (
          <p className="p-10 text-center text-mute">Folga neste dia. Ajuste na aba Horários se precisar.</p>
        ) : (
          <div className="relative">
            {isToday && toMin(slots[0]) <= nowMin && nowMin <= toMin(slots[slots.length - 1]) + 30 && (
              <div
                className="pointer-events-none absolute inset-x-0 z-20 flex items-center"
                style={{ top: ((nowMin - toMin(slots[0])) / 30) * ROW }}
              >
                <span className="h-2.5 w-2.5 -translate-x-1 rounded-full bg-ember shadow-[0_0_12px_#e8823a]" />
                <span className="h-px flex-1 bg-ember/70" />
              </div>
            )}
            {slots.map((t) => {
              if (covered.has(t)) return null;
              const a = startOf.get(t);
              return (
                <div key={t} className="flex gap-3" style={{ minHeight: a ? a.slots.length * ROW : ROW }}>
                  <span className="w-12 shrink-0 pt-2 text-right text-xs tabular-nums text-mute">{t}</span>
                  <div className="flex-1 border-t border-line/70 py-1.5">
                    <AnimatePresence mode="popLayout">
                      {a ? (
                        <ApptCard key={a.id} a={a} />
                      ) : blocked.has(t) ? (
                        <motion.button
                          key="blocked"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          onClick={() => data.toggleBlock(barber.id, date, t, false)}
                          className="group flex h-full min-h-13 w-full items-center gap-2 rounded-xl px-4 text-sm text-mute [background:repeating-linear-gradient(-45deg,rgba(255,255,255,0.03)_0_8px,transparent_8px_16px)]"
                        >
                          <Lock className="h-4 w-4" /> Bloqueado
                          <span className="ml-auto flex items-center gap-1 text-xs opacity-0 transition group-hover:opacity-100">
                            <LockOpen className="h-3.5 w-3.5" /> Liberar
                          </span>
                        </motion.button>
                      ) : (
                        <motion.button
                          key="free"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          onClick={() => data.toggleBlock(barber.id, date, t, true)}
                          className="group flex h-full min-h-13 w-full items-center rounded-xl border border-dashed border-transparent px-4 text-sm text-bone/25 transition hover:border-line hover:text-bone/60"
                        >
                          Livre
                          <span className="ml-auto flex items-center gap-1 text-xs opacity-0 transition group-hover:opacity-100">
                            <Lock className="h-3.5 w-3.5" /> Bloquear
                          </span>
                        </motion.button>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function ApptCard({ a }: { a: Appointment }) {
  const pending = a.status === "pending";
  const wa = `https://wa.me/55${onlyDigits(a.clientPhone)}`;
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.97 }}
      className={clsx(
        "relative flex h-full flex-wrap items-start gap-3 overflow-hidden rounded-xl border p-3 pl-4",
        pending ? "border-warn/40 bg-warn/[0.06]" : "border-gold/30 bg-gradient-to-r from-gold/[0.12] to-gold/[0.03]",
      )}
    >
      <span className={clsx("absolute inset-y-0 left-0 w-1", pending ? "bg-warn" : "bg-gold")} />
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <p className="font-semibold">{a.clientName}</p>
          <StatusChip status={a.status} />
          {a.clientUid && <span className="text-[0.65rem] text-mute">· cliente com conta</span>}
        </div>
        <p className="mt-0.5 text-sm text-bone/70">
          {a.serviceName} · {a.time}–{(() => {
            const e = toMin(a.time) + a.duration;
            return `${String(Math.floor(e / 60)).padStart(2, "0")}:${String(e % 60).padStart(2, "0")}`;
          })()} · <span className="text-gold">{brl(a.price)}</span>
        </p>
        {a.notes && (
          <p className="mt-1.5 flex items-start gap-1.5 text-xs text-mute">
            <StickyNote className="mt-0.5 h-3 w-3 shrink-0" /> {a.notes}
          </p>
        )}
      </div>
      <div className="flex items-center gap-1.5">
        <a href={wa} target="_blank" rel="noopener noreferrer" title={a.clientPhone} className="flex h-9 w-9 items-center justify-center rounded-full border border-line hover:border-ok/60 hover:text-ok">
          <MessageCircle className="h-4 w-4" />
        </a>
        {pending ? (
          <>
            <button onClick={() => data.setAppointmentStatus(a, "confirmed")} className="flex h-9 items-center gap-1 rounded-full bg-gold px-3 text-xs font-semibold text-ink hover:bg-gold-soft">
              <Check className="h-3.5 w-3.5" /> Aceitar
            </button>
            <button onClick={() => data.setAppointmentStatus(a, "rejected")} title="Recusar" className="flex h-9 w-9 items-center justify-center rounded-full border border-line hover:border-bad/60 hover:text-bad">
              <X className="h-4 w-4" />
            </button>
          </>
        ) : a.status === "confirmed" ? (
          <>
            <button onClick={() => data.setAppointmentStatus(a, "done")} title="Marcar como concluído" className="flex h-9 w-9 items-center justify-center rounded-full border border-line hover:border-gold/60 hover:text-gold">
              <CheckCheck className="h-4 w-4" />
            </button>
            <button
              onClick={() => confirm(`Cancelar o horário de ${a.clientName}?`) && data.setAppointmentStatus(a, "cancelled")}
              title="Cancelar"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-line hover:border-bad/60 hover:text-bad"
            >
              <Ban className="h-4 w-4" />
            </button>
          </>
        ) : null}
      </div>
    </motion.div>
  );
}
