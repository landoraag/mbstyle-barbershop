"use client";

import { motion, useMotionTemplate, useMotionValue, useSpring, useTransform } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useNextFree } from "@/lib/hooks";
import type { Barber } from "@/lib/types";
import { useApp } from "../providers";
import { Avatar, Eyebrow, Reveal, SplitHeading, ease } from "../ui";

function NextFree({ barber }: { barber: Barber }) {
  const next = useNextFree(barber);
  if (next === undefined)
    return <span className="h-4 w-36 animate-pulse rounded bg-white/5" aria-label="Carregando disponibilidade" />;
  if (next === null) return <span className="text-mute">Agenda cheia nos próximos dias</span>;
  const when = next.dayIndex === 0 ? "hoje" : next.dayIndex === 1 ? "amanhã" : "em breve";
  return (
    <span className="inline-flex items-center gap-2">
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-ok opacity-60" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-ok" />
      </span>
      Livre {when} às <strong className="font-semibold text-bone">{next.time}</strong>
    </span>
  );
}

function BarberCard({ barber, index }: { barber: Barber; index: number }) {
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const rx = useSpring(useTransform(my, [0, 1], [6, -6]), { stiffness: 200, damping: 20 });
  const ry = useSpring(useTransform(mx, [0, 1], [-6, 6]), { stiffness: 200, damping: 20 });
  const glowX = useTransform(mx, (v) => `${v * 100}%`);
  const glowY = useTransform(my, (v) => `${v * 100}%`);
  const glow = useMotionTemplate`radial-gradient(320px circle at ${glowX} ${glowY}, rgba(201,163,92,0.16), transparent 60%)`;

  return (
    <motion.article
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.9, delay: index * 0.1, ease }}
      style={{ perspective: 900 }}
    >
      <motion.div
        onPointerMove={(e) => {
          const r = e.currentTarget.getBoundingClientRect();
          mx.set((e.clientX - r.left) / r.width);
          my.set((e.clientY - r.top) / r.height);
        }}
        onPointerLeave={() => {
          mx.set(0.5);
          my.set(0.5);
        }}
        style={{ rotateX: rx, rotateY: ry, transformStyle: "preserve-3d" }}
        className="gold-border group relative flex h-full flex-col overflow-hidden rounded-[1.75rem]"
      >
        <motion.span
          className="pointer-events-none absolute -inset-px z-10 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{ background: glow }}
        />
        <div className="relative aspect-[4/5] overflow-hidden">
          <Avatar
            name={barber.name}
            photo={barber.photoURL}
            className="h-full w-full text-7xl transition-transform duration-[1.2s] ease-out group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-coal via-coal/20 to-transparent" />
          <span className="absolute left-4 top-4 rounded-full border border-gold/30 bg-ink/60 px-3 py-1 text-[0.62rem] uppercase tracking-[0.25em] text-gold-soft backdrop-blur">
            {barber.role}
          </span>
          <span className="absolute right-5 top-4 font-display text-4xl italic text-bone/15">0{index + 1}</span>
        </div>
        <div className="relative -mt-16 flex flex-1 flex-col p-6" style={{ transform: "translateZ(30px)" }}>
          <h3 className="font-display text-3xl leading-tight">
            {barber.nickname ? (
              <>
                {barber.name} <span className="italic text-gold">“{barber.nickname}”</span>
              </>
            ) : (
              barber.name
            )}
          </h3>
          <p className="mt-3 text-sm leading-relaxed text-bone/55">{barber.bio}</p>
          <div className="mt-4 flex flex-wrap gap-1.5">
            {barber.specialties.map((s) => (
              <span key={s} className="rounded-full bg-white/[0.04] px-2.5 py-1 text-[0.7rem] text-bone/70">
                {s}
              </span>
            ))}
          </div>
          <div className="mt-auto pt-6">
            <div className="hairline mb-4" />
            <p className="mb-4 text-xs text-bone/60">
              <NextFree barber={barber} />
            </p>
            <Link
              href={`/agendar?barbeiro=${barber.id}`}
              className="group/btn flex h-12 items-center justify-between rounded-full border border-gold/40 pl-5 pr-1.5 text-sm font-medium text-gold-soft transition hover:bg-gold hover:text-ink"
            >
              Agendar com {barber.nickname ?? barber.name.split(" ")[0]}
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gold/15 transition group-hover/btn:bg-ink/15">
                <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-0.5" />
              </span>
            </Link>
          </div>
        </div>
      </motion.div>
    </motion.article>
  );
}

export function Barbers() {
  const { barbers, catalogReady } = useApp();
  return (
    <section id="barbeiros" className="relative overflow-hidden bg-coal py-28 sm:py-36">
      <div className="pointer-events-none absolute -top-40 right-0 h-96 w-96 rounded-full bg-gold/10 blur-[120px]" />
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <Reveal>
              <Eyebrow>Nossa equipe</Eyebrow>
            </Reveal>
            <h2 className="mt-6 font-display text-5xl leading-[1.02] sm:text-6xl">
              <SplitHeading text="Escolha o seu" /> <br />
              <span className="italic text-gold">
                <SplitHeading text="barbeiro." delay={0.12} />
              </span>
            </h2>
          </div>
          <Reveal delay={0.2}>
            <p className="max-w-sm leading-relaxed text-bone/60">
              Cada um com sua agenda e seu estilo. Veja quem está livre agora e reserve direto com ele.
            </p>
          </Reveal>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {!catalogReady &&
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="aspect-[4/7] animate-pulse rounded-[1.75rem] bg-white/[0.03]" />
            ))}
          {barbers.map((b, i) => (
            <BarberCard key={b.id} barber={b} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
