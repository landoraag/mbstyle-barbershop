"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { CalendarDays, LogOut, Plus } from "lucide-react";
import { Nav } from "@/components/nav";
import { useApp } from "@/components/providers";
import { StatusChip } from "@/components/status";
import { ease } from "@/components/ui";
import { data } from "@/lib/data";
import { brl, dateKey, fmtLong } from "@/lib/time";
import type { Appointment } from "@/lib/types";

export default function ContaPage() {
  const router = useRouter();
  const { profile, authReady, barbers } = useApp();
  const [list, setList] = useState<Appointment[] | null>(null);

  useEffect(() => {
    if (!authReady) return;
    if (!profile) router.replace("/entrar?voltar=/conta");
    else if (profile.role !== "client") router.replace("/painel");
    else return data.watchMyAppointments(profile.uid, setList);
  }, [authReady, profile, router]);

  const today = dateKey(new Date());
  const sorted = (list ?? []).sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));
  const upcoming = sorted.filter((a) => a.date >= today && a.status !== "cancelled" && a.status !== "rejected");
  const past = sorted.filter((a) => !upcoming.includes(a)).reverse();

  return (
    <>
      <Nav />
      <main className="mx-auto min-h-dvh max-w-3xl px-6 pt-32 pb-24">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[0.7rem] uppercase tracking-[0.35em] text-gold">Minha conta</p>
            <h1 className="mt-3 font-display text-4xl sm:text-5xl">
              Olá, <span className="italic text-gold">{profile?.name.split(" ")[0] ?? "…"}</span>
            </h1>
          </div>
          <button
            onClick={() => data.signOut()}
            className="flex items-center gap-2 rounded-full border border-line px-4 py-2 text-sm text-mute hover:text-bone"
          >
            <LogOut className="h-4 w-4" /> Sair
          </button>
        </div>

        <div className="mt-12 flex items-center justify-between">
          <h2 className="font-display text-2xl">Próximos horários</h2>
          <Link href="/agendar" className="flex items-center gap-1.5 rounded-full bg-gold px-4 py-2 text-sm font-semibold text-ink">
            <Plus className="h-4 w-4" /> Novo
          </Link>
        </div>

        <div className="mt-5 space-y-3">
          {!list && [0, 1].map((i) => <div key={i} className="h-28 animate-pulse rounded-3xl bg-white/[0.03]" />)}
          {list && upcoming.length === 0 && (
            <div className="rounded-3xl border border-dashed border-line p-10 text-center">
              <CalendarDays className="mx-auto h-8 w-8 text-gold" />
              <p className="mt-3 text-mute">Nenhum horário marcado.</p>
            </div>
          )}
          <AnimatePresence>
            {upcoming.map((a, i) => {
              const b = barbers.find((x) => x.id === a.barberId);
              return (
                <motion.div
                  key={a.id}
                  layout
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={{ delay: i * 0.05, ease }}
                  className="gold-border flex flex-wrap items-center gap-5 rounded-3xl p-5"
                >
                  <div className="flex h-16 w-16 flex-col items-center justify-center rounded-2xl bg-gold/10 text-gold">
                    <span className="font-display text-2xl leading-none">{a.date.slice(8)}</span>
                    <span className="text-[0.6rem] uppercase">{a.time}</span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium">{a.serviceName}</p>
                    <p className="text-sm text-mute first-letter:uppercase">
                      {fmtLong(a.date)} · com {b?.name ?? "barbeiro"}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <StatusChip status={a.status} />
                    <span className="font-display text-lg text-gold">{brl(a.price)}</span>
                    <button
                      onClick={() => confirm("Cancelar este horário?") && data.cancelMyAppointment(a)}
                      className="text-xs text-mute underline-offset-4 hover:text-bad hover:underline"
                    >
                      Cancelar
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {past.length > 0 && (
          <>
            <h2 className="mt-14 font-display text-2xl">Histórico</h2>
            <ul className="mt-4 divide-y divide-line">
              {past.map((a) => (
                <li key={a.id} className="flex items-center justify-between gap-4 py-4 text-sm">
                  <span>
                    {a.serviceName} <span className="text-mute">· {fmtLong(a.date)}</span>
                  </span>
                  <StatusChip status={a.status} />
                </li>
              ))}
            </ul>
          </>
        )}
      </main>
    </>
  );
}
