"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, Check, Clock, ShieldCheck, Sparkles } from "lucide-react";
import { clsx } from "clsx";
import { data, SlotTakenError } from "@/lib/data";
import { brl, dateKey, fmtLong, maskPhone, nextDays, validPhone } from "@/lib/time";
import type { Appointment } from "@/lib/types";
import { useApp } from "../providers";
import { Avatar, Field, Spinner, ease, inputCls } from "../ui";
import { DateStrip, SlotGrid } from "./calendar";
import { BookingDone } from "./done";

const STEPS = ["Barbeiro", "Serviço", "Horário", "Seus dados"] as const;

const slide = {
  enter: (dir: number) => ({ x: dir * 60, opacity: 0, filter: "blur(4px)" }),
  center: { x: 0, opacity: 1, filter: "blur(0px)" },
  exit: (dir: number) => ({ x: dir * -60, opacity: 0, filter: "blur(4px)" }),
};

export function BookingFlow() {
  const params = useSearchParams();
  const { barbers, services, profile, catalogReady } = useApp();

  const [step, setStep] = useState(0);
  const [dir, setDir] = useState(1);
  const [barberId, setBarberId] = useState<string | null>(params.get("barbeiro"));
  const [serviceId, setServiceId] = useState<string | null>(params.get("servico"));
  const [date, setDate] = useState<string | null>(null);
  const [time, setTime] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [touched, setTouched] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState<Appointment | null>(null);

  const barber = barbers.find((b) => b.id === barberId) ?? null;
  const service = services.find((s) => s.id === serviceId) ?? null;
  const days = useMemo(() => nextDays(), []);

  // pula etapas já resolvidas pelo link (ex.: /agendar?barbeiro=marcos)
  useEffect(() => {
    if (!catalogReady) return;
    if (barber && service && barber.serviceIds.includes(service.id)) setStep(2);
    else if (barber) setStep(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [catalogReady]);

  useEffect(() => {
    if (profile?.role === "client") {
      setName((n) => n || profile.name);
      setPhone((p) => p || maskPhone(profile.phone ?? ""));
    }
  }, [profile]);

  // ocupação pública do barbeiro na janela de agendamento (tempo real)
  const [busyByDay, setBusyByDay] = useState<Map<string, Set<string>> | null>(null);
  useEffect(() => {
    if (!barber) return;
    setBusyByDay(null);
    return data.watchBarberBusy(barber.id, dateKey(days[0]), dateKey(days[days.length - 1]), (slots) => {
      const m = new Map<string, Set<string>>();
      slots.forEach((s) => m.set(s.date, (m.get(s.date) ?? new Set()).add(s.time)));
      setBusyByDay(m);
    });
  }, [barber, days]);

  // se o horário escolhido foi ocupado por outra pessoa enquanto você decidia
  useEffect(() => {
    if (date && time && busyByDay?.get(date)?.has(time)) {
      setTime(null);
      setError("Esse horário acabou de ser reservado por outra pessoa. Escolha outro.");
    }
  }, [busyByDay, date, time]);

  const go = (to: number) => {
    setDir(to > step ? 1 : -1);
    setStep(to);
    setError(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const canNext = [!!barber, !!service, !!date && !!time, name.trim().length >= 2 && validPhone(phone)][step];
  const isClient = profile?.role === "client";

  async function submit() {
    setTouched(true);
    if (!barber || !service || !date || !time || !canNext) return;
    setSubmitting(true);
    setError(null);
    try {
      const appt = await data.createBooking(
        { barberId: barber.id, serviceId: service.id, date, time, clientName: name.trim(), clientPhone: phone, notes: notes.trim() },
        isClient ? profile : null,
      );
      setDone(appt);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (e) {
      setError(e instanceof SlotTakenError ? e.message : "Não foi possível agendar agora. Tente de novo em instantes.");
      if (e instanceof SlotTakenError) {
        setTime(null);
        go(2);
      }
    } finally {
      setSubmitting(false);
    }
  }

  if (done && barber) return <BookingDone appt={done} barber={barber} />;

  return (
    <div className="mx-auto max-w-6xl px-5 sm:px-6">
      {/* cabeçalho + progresso */}
      <div className="mb-10">
        <Link href="/" className="mb-6 inline-flex items-center gap-2 text-sm text-mute hover:text-bone">
          <ArrowLeft className="h-4 w-4" /> Voltar ao site
        </Link>
        <h1 className="font-display text-4xl sm:text-5xl">
          Agende seu <span className="italic text-gold">horário</span>
        </h1>
        <ol className="mt-8 grid grid-cols-4 gap-2">
          {STEPS.map((label, i) => (
            <li key={label}>
              <button
                disabled={i > step}
                onClick={() => go(i)}
                className="group w-full text-left disabled:cursor-default"
              >
                <span className="relative block h-1 overflow-hidden rounded-full bg-white/[0.06]">
                  <motion.span
                    className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-gold-deep to-gold-soft"
                    initial={false}
                    animate={{ width: i < step ? "100%" : i === step ? "50%" : "0%" }}
                    transition={{ duration: 0.6, ease }}
                  />
                </span>
                <span
                  className={clsx(
                    "mt-2.5 flex items-center gap-1.5 text-[0.7rem] uppercase tracking-[0.15em] sm:text-xs",
                    i <= step ? "text-bone" : "text-mute/60",
                  )}
                >
                  {i < step ? <Check className="h-3.5 w-3.5 text-gold" /> : <span className="text-gold">0{i + 1}</span>}
                  <span className="hidden sm:inline">{label}</span>
                </span>
              </button>
            </li>
          ))}
        </ol>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_22rem]">
        <section className="relative min-h-[26rem] min-w-0">
          <AnimatePresence mode="wait" custom={dir}>
            <motion.div
              key={step}
              custom={dir}
              variants={slide}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.45, ease }}
            >
              {step === 0 && (
                <StepWrap title="Com quem você quer cortar?" subtitle="Cada barbeiro tem sua própria agenda.">
                  <div className="grid gap-3 sm:grid-cols-2">
                    {barbers.map((b, i) => (
                      <motion.button
                        key={b.id}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.06, ease }}
                        onClick={() => {
                          setBarberId(b.id);
                          if (service && !b.serviceIds.includes(service.id)) setServiceId(null);
                          setDate(null);
                          setTime(null);
                          go(service && b.serviceIds.includes(service.id) ? 2 : 1);
                        }}
                        className={clsx(
                          "group flex items-center gap-4 rounded-3xl border p-3 pr-5 text-left transition",
                          barberId === b.id ? "border-gold bg-gold/[0.07]" : "border-line hover:border-gold/50 hover:bg-white/[0.02]",
                        )}
                      >
                        <Avatar name={b.name} photo={b.photoURL} className="h-20 w-20 shrink-0 rounded-2xl text-2xl" />
                        <div className="min-w-0 flex-1">
                          <p className="font-display text-xl leading-tight">
                            {b.name}
                            {b.nickname && <span className="italic text-gold"> “{b.nickname}”</span>}
                          </p>
                          <p className="mt-1 truncate text-xs text-mute">{b.specialties.join(" · ")}</p>
                        </div>
                        <ArrowRight className="h-4 w-4 text-gold opacity-0 transition group-hover:translate-x-1 group-hover:opacity-100" />
                      </motion.button>
                    ))}
                    {!catalogReady && [0, 1, 2, 3].map((i) => <div key={i} className="h-26 animate-pulse rounded-3xl bg-white/[0.03]" />)}
                  </div>
                </StepWrap>
              )}

              {step === 1 && barber && (
                <StepWrap title="Qual serviço?" subtitle={`Serviços feitos por ${barber.nickname ?? barber.name.split(" ")[0]}.`}>
                  <div className="grid gap-2.5 sm:grid-cols-2">
                    {services
                      .filter((s) => barber.serviceIds.includes(s.id))
                      .map((s, i) => (
                        <motion.button
                          key={s.id}
                          initial={{ opacity: 0, y: 12 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.03, ease }}
                          onClick={() => {
                            setServiceId(s.id);
                            setTime(null);
                            go(2);
                          }}
                          className={clsx(
                            "group flex items-center justify-between gap-4 rounded-2xl border px-5 py-4 text-left transition",
                            serviceId === s.id ? "border-gold bg-gold/[0.07]" : "border-line hover:border-gold/50",
                          )}
                        >
                          <span>
                            <span className="flex items-center gap-2 font-medium">
                              {s.name}
                              {s.featured && <Sparkles className="h-3.5 w-3.5 text-gold" />}
                            </span>
                            <span className="mt-1 flex items-center gap-1 text-xs text-mute">
                              <Clock className="h-3 w-3" /> {s.duration} min
                            </span>
                          </span>
                          <span className="font-display text-xl text-gold">{brl(s.price)}</span>
                        </motion.button>
                      ))}
                  </div>
                </StepWrap>
              )}

              {step === 2 && barber && service && (
                <StepWrap title="Escolha o dia e o horário" subtitle="Atualiza em tempo real. Você só vê se o horário está livre ou ocupado.">
                  <DateStrip
                    barber={barber}
                    days={days}
                    busyByDay={busyByDay}
                    duration={service.duration}
                    value={date}
                    onChange={(d) => {
                      setDate(d);
                      setTime(null);
                      setError(null);
                    }}
                  />
                  <div className="mt-8">
                    {date ? (
                      <SlotGrid
                        barber={barber}
                        date={date}
                        busy={busyByDay ? (busyByDay.get(date) ?? new Set()) : null}
                        duration={service.duration}
                        value={time}
                        onChange={(t) => {
                          setTime(t);
                          setError(null);
                        }}
                      />
                    ) : (
                      <div className="rounded-2xl border border-dashed border-line p-10 text-center text-sm text-mute">
                        Selecione um dia acima para ver os horários.
                      </div>
                    )}
                  </div>
                </StepWrap>
              )}

              {step === 3 && (
                <StepWrap
                  title="Seus dados"
                  subtitle={isClient ? "Conferimos seus dados da conta." : "Só precisamos do seu nome e celular."}
                >
                  <div className="grid gap-5 sm:grid-cols-2">
                    <Field label="Nome" error={touched && name.trim().length < 2 ? "Informe seu nome." : null}>
                      <input
                        className={inputCls}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Como podemos te chamar?"
                        autoComplete="name"
                      />
                    </Field>
                    <Field label="Celular (WhatsApp)" error={touched && !validPhone(phone) ? "Celular com DDD, ex.: (15) 99999-9999." : null}>
                      <input
                        className={inputCls}
                        value={phone}
                        onChange={(e) => setPhone(maskPhone(e.target.value))}
                        placeholder="(15) 99999-9999"
                        inputMode="tel"
                        autoComplete="tel"
                      />
                    </Field>
                    <div className="sm:col-span-2">
                      <Field label="Observação (opcional)">
                        <textarea
                          className={clsx(inputCls, "h-24 resize-none py-3")}
                          value={notes}
                          onChange={(e) => setNotes(e.target.value.slice(0, 280))}
                          placeholder="Ex.: quero manter o tamanho em cima"
                        />
                      </Field>
                    </div>
                  </div>

                  <div
                    className={clsx(
                      "mt-6 flex gap-3 rounded-2xl border p-4 text-sm",
                      isClient ? "border-ok/30 bg-ok/5" : "border-gold/25 bg-gold/5",
                    )}
                  >
                    <ShieldCheck className={clsx("mt-0.5 h-5 w-5 shrink-0", isClient ? "text-ok" : "text-gold")} />
                    {isClient ? (
                      <p className="text-bone/80">Você está logado: seu horário é <strong>confirmado na hora</strong>.</p>
                    ) : (
                      <p className="text-bone/80">
                        Seu pedido fica <strong>aguardando confirmação</strong> do barbeiro.{" "}
                        <Link href="/entrar?voltar=/agendar" className="text-gold-soft underline-offset-4 hover:underline">
                          Crie uma conta
                        </Link>{" "}
                        para ter confirmação automática nas próximas vezes.
                      </p>
                    )}
                  </div>
                </StepWrap>
              )}
            </motion.div>
          </AnimatePresence>

          <AnimatePresence>
            {error && (
              <motion.p
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mt-6 rounded-2xl border border-bad/30 bg-bad/10 px-4 py-3 text-sm text-bad"
              >
                {error}
              </motion.p>
            )}
          </AnimatePresence>
        </section>

        <Summary
          step={step}
          barberName={barber ? (barber.nickname ? `${barber.name} “${barber.nickname}”` : barber.name) : null}
          barberPhoto={barber?.photoURL}
          service={service}
          date={date}
          time={time}
          canNext={canNext}
          submitting={submitting}
          onBack={() => go(step - 1)}
          onNext={() => (step < 3 ? go(step + 1) : submit())}
          confirmLabel={isClient ? "Confirmar agendamento" : "Solicitar horário"}
        />
      </div>
    </div>
  );
}

function StepWrap({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="font-display text-2xl sm:text-3xl">{title}</h2>
      {subtitle && <p className="mt-1.5 text-sm text-mute">{subtitle}</p>}
      <div className="mt-7">{children}</div>
    </div>
  );
}

function Summary({
  step,
  barberName,
  barberPhoto,
  service,
  date,
  time,
  canNext,
  submitting,
  onBack,
  onNext,
  confirmLabel,
}: {
  step: number;
  barberName: string | null;
  barberPhoto?: string | null;
  service: { name: string; price: number; duration: number } | null;
  date: string | null;
  time: string | null;
  canNext: boolean;
  submitting: boolean;
  onBack: () => void;
  onNext: () => void;
  confirmLabel: string;
}) {
  const rows = [
    { label: "Barbeiro", value: barberName },
    { label: "Serviço", value: service?.name },
    { label: "Data", value: date ? fmtLong(date) : null },
    { label: "Horário", value: time ? `${time} · ${service?.duration ?? ""} min` : null },
  ];
  return (
    <aside className="lg:sticky lg:top-28 lg:self-start">
      {/* "ticket" do agendamento */}
      <div className="gold-border relative overflow-hidden rounded-[1.75rem]">
        <div className="flex items-center gap-3 border-b border-dashed border-gold/25 p-5">
          {barberName ? (
            <Avatar name={barberName} photo={barberPhoto} className="h-11 w-11 rounded-full text-sm" />
          ) : (
            <span className="h-11 w-11 rounded-full border border-dashed border-line" />
          )}
          <div>
            <p className="text-[0.62rem] uppercase tracking-[0.3em] text-mute">Seu agendamento</p>
            <p className="font-display text-lg">MB Style</p>
          </div>
        </div>
        {/* recortes laterais de ticket */}
        <span className="absolute -left-3 top-[4.6rem] h-6 w-6 rounded-full bg-ink" />
        <span className="absolute -right-3 top-[4.6rem] h-6 w-6 rounded-full bg-ink" />
        <dl className="space-y-3.5 p-5">
          {rows.map((r) => (
            <div key={r.label} className="flex items-start justify-between gap-4 text-sm">
              <dt className="text-mute">{r.label}</dt>
              <dd className="text-right">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={r.value ?? "empty"}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.25 }}
                    className={clsx("block first-letter:uppercase", r.value ? "text-bone" : "text-bone/25")}
                  >
                    {r.value ?? "—"}
                  </motion.span>
                </AnimatePresence>
              </dd>
            </div>
          ))}
          <div className="hairline !my-5" />
          <div className="flex items-baseline justify-between">
            <dt className="text-sm text-mute">Total</dt>
            <dd className="font-display text-3xl text-gold">{service ? brl(service.price) : "—"}</dd>
          </div>
          <p className="text-[0.7rem] text-mute">Pagamento na barbearia.</p>
        </dl>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-40 flex gap-2 border-t border-line bg-ink/90 p-3 backdrop-blur-xl lg:static lg:mt-4 lg:border-0 lg:bg-transparent lg:p-0">
        {step > 0 && (
          <button
            onClick={onBack}
            aria-label="Voltar"
            className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-line hover:border-gold/50"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
        )}
        <motion.button
          whileTap={{ scale: 0.98 }}
          disabled={!canNext || submitting}
          onClick={onNext}
          className="group relative flex h-14 flex-1 items-center justify-center gap-2 overflow-hidden rounded-full bg-gold font-semibold text-ink transition enabled:hover:bg-gold-soft disabled:cursor-not-allowed disabled:bg-white/[0.06] disabled:text-bone/30"
        >
          {submitting ? (
            <>
              <Spinner /> Reservando…
            </>
          ) : step < 3 ? (
            <>
              Continuar <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </>
          ) : (
            <>
              {confirmLabel} <Check className="h-4 w-4" />
            </>
          )}
        </motion.button>
      </div>
    </aside>
  );
}
