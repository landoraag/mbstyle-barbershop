"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { addDays } from "date-fns";
import { CalendarRange, Clock4, ExternalLink, Inbox, LogOut, UserRound } from "lucide-react";
import { clsx } from "clsx";
import { Wordmark } from "@/components/brand";
import { useApp } from "@/components/providers";
import { Avatar, ease } from "@/components/ui";
import { AgendaView } from "@/components/panel/agenda";
import { RequestsView } from "@/components/panel/requests";
import { AvailabilityView } from "@/components/panel/availability";
import { ProfileView } from "@/components/panel/profile";
import { data } from "@/lib/data";
import { dateKey } from "@/lib/time";
import type { Appointment, BusySlot } from "@/lib/types";

const TABS = [
  { id: "agenda", label: "Agenda", icon: CalendarRange },
  { id: "pedidos", label: "Pedidos", icon: Inbox },
  { id: "horarios", label: "Horários", icon: Clock4 },
  { id: "perfil", label: "Perfil", icon: UserRound },
] as const;
type Tab = (typeof TABS)[number]["id"];

export default function PainelPage() {
  const router = useRouter();
  const { profile, authReady, barbers } = useApp();
  const [tab, setTab] = useState<Tab>("agenda");
  const [appts, setAppts] = useState<Appointment[]>([]);
  const [busy, setBusy] = useState<BusySlot[]>([]);

  const barber = barbers.find((b) => b.id === profile?.barberId) ?? null;
  const range = useMemo(() => {
    const t = new Date();
    return { from: dateKey(addDays(t, -14)), to: dateKey(addDays(t, 60)) };
  }, []);

  useEffect(() => {
    if (!authReady) return;
    if (!profile) router.replace("/entrar");
    else if (profile.role === "client") router.replace("/conta");
  }, [authReady, profile, router]);

  useEffect(() => {
    if (!barber) return;
    const u1 = data.watchBarberAppointments(barber.id, range.from, range.to, setAppts);
    const u2 = data.watchBarberBusy(barber.id, range.from, range.to, setBusy);
    return () => {
      u1();
      u2();
    };
  }, [barber, range]);

  const pending = appts.filter((a) => a.status === "pending" && a.date >= dateKey(new Date()));

  if (!barber)
    return (
      <main className="flex min-h-dvh items-center justify-center">
        <span className="h-8 w-8 animate-spin rounded-full border-2 border-gold border-t-transparent" />
      </main>
    );

  return (
    <div className="min-h-dvh lg:grid lg:grid-cols-[16rem_1fr]">
      {/* barra lateral (desktop) */}
      <aside className="sticky top-0 hidden h-dvh flex-col border-r border-line bg-coal p-6 lg:flex">
        <Link href="/">
          <Wordmark />
        </Link>
        <nav className="mt-12 space-y-1">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={clsx(
                "relative flex w-full items-center gap-3 rounded-[4px] px-4 py-3 text-sm transition",
                tab === t.id ? "text-bone" : "text-bone/50 hover:text-bone",
              )}
            >
              {tab === t.id && (
                <motion.span layoutId="side-tab" className="absolute inset-0 rounded-[4px] border border-gold/25 bg-gold/10" transition={{ type: "spring", stiffness: 400, damping: 34 }} />
              )}
              <t.icon className={clsx("relative h-4 w-4", tab === t.id && "text-gold")} />
              <span className="relative flex-1 text-left">{t.label}</span>
              {t.id === "pedidos" && pending.length > 0 && (
                <span className="relative flex h-5 min-w-5 items-center justify-center rounded-full bg-gold px-1.5 text-[0.65rem] font-bold text-ink">
                  {pending.length}
                </span>
              )}
            </button>
          ))}
        </nav>
        <div className="mt-auto space-y-4">
          <Link href={`/agendar?barbeiro=${barber.id}`} target="_blank" className="flex items-center gap-2 text-xs text-mute hover:text-gold">
            <ExternalLink className="h-3.5 w-3.5" /> Ver minha página de agendamento
          </Link>
          <div className="flex items-center gap-3 rounded-[4px] border border-line p-3">
            <Avatar name={barber.name} photo={barber.photoURL} className="h-10 w-10 rounded-full text-sm" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm">{barber.name}</p>
              <p className="text-[0.65rem] text-mute">{profile?.role === "admin" ? "Administrador" : "Barbeiro"}</p>
            </div>
            <button onClick={() => data.signOut()} aria-label="Sair" className="rounded-full p-2 text-mute hover:bg-white/5 hover:text-bone">
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* topo (mobile) */}
      <header className="sticky top-0 z-40 flex items-center justify-between border-b border-line bg-ink/90 px-5 py-3 backdrop-blur-xl lg:hidden">
        <Wordmark />
        <button onClick={() => data.signOut()} aria-label="Sair" className="rounded-full p-2 text-mute">
          <LogOut className="h-5 w-5" />
        </button>
      </header>

      <main className="min-w-0 px-5 pt-8 pb-32 sm:px-8 lg:px-12 lg:pt-12">
        {data.mode === "demo" && (
          <p className="mb-6 rounded-[4px] border border-dashed border-gold/30 px-4 py-2.5 text-xs text-mute">
            Modo demonstração — os dados ficam só neste navegador.
          </p>
        )}
        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35, ease }}
          >
            {tab === "agenda" && <AgendaView barber={barber} appts={appts} busy={busy} />}
            {tab === "pedidos" && <RequestsView appts={pending} />}
            {tab === "horarios" && <AvailabilityView barber={barber} />}
            {tab === "perfil" && <ProfileView barber={barber} />}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* menu flutuante inferior (mobile) */}
      <nav className="glass fixed inset-x-4 bottom-4 z-50 grid grid-cols-4 rounded-full p-1.5 lg:hidden">
        {TABS.map((t) => (
          <button key={t.id} onClick={() => setTab(t.id)} className="relative flex flex-col items-center gap-0.5 rounded-full py-2 text-[0.62rem]">
            {tab === t.id && <motion.span layoutId="bottom-tab" className="absolute inset-0 rounded-full bg-gold" transition={{ type: "spring", stiffness: 400, damping: 34 }} />}
            <t.icon className={clsx("relative h-5 w-5", tab === t.id ? "text-ink" : "text-bone/60")} />
            <span className={clsx("relative", tab === t.id ? "font-semibold text-ink" : "text-bone/60")}>{t.label}</span>
            {t.id === "pedidos" && pending.length > 0 && (
              <span className="absolute right-3 top-1 h-2 w-2 rounded-full bg-ember" />
            )}
          </button>
        ))}
      </nav>
    </div>
  );
}
