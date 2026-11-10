"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useNextFree } from "@/lib/hooks";
import type { Barber } from "@/lib/types";
import { useApp } from "../providers";
import { CharReveal, MaskReveal } from "../fx";
import { Avatar, Eyebrow, Reveal, ease } from "../ui";

function NextFree({ barber }: { barber: Barber }) {
  const next = useNextFree(barber);
  if (next === undefined) return <span className="inline-block h-3 w-28 animate-pulse bg-white/5" />;
  if (next === null) return <span className="text-mute">Agenda cheia nos próximos dias</span>;
  const when = next.dayIndex === 0 ? "Hoje" : next.dayIndex === 1 ? "Amanhã" : "Em breve";
  return (
    <span className="inline-flex items-center gap-2">
      <span className="h-1.5 w-1.5 rounded-full bg-ok" />
      {when}, {next.time}
    </span>
  );
}

function BarberCard({ barber, index }: { barber: Barber; index: number }) {
  const first = barber.nickname ?? barber.name.split(" ")[0];
  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 1, delay: index * 0.08, ease }}
      className="group flex flex-col"
    >
      <Link
        href={`/agendar?barbeiro=${barber.id}`}
        data-cursor="Agendar"
        className="relative block aspect-[3/4] overflow-hidden bg-graphite"
      >
        <MaskReveal className="h-full w-full" delay={index * 0.12}>
          <Avatar
            name={barber.name}
            photo={barber.photoURL}
            className="h-full w-full text-[5.5rem] grayscale transition duration-[1.4s] ease-out group-hover:scale-[1.06] group-hover:grayscale-0"
          />
        </MaskReveal>
        <span className="absolute left-4 top-4 font-display text-sm italic text-bone/40">{String(index + 1).padStart(2, "0")}</span>
        <span className="pointer-events-none absolute inset-3 border border-gold/0 transition-colors duration-700 group-hover:border-gold/40" />
        <span className="absolute inset-x-0 bottom-0 translate-y-[102%] bg-bone py-3.5 text-center text-[0.72rem] font-medium uppercase tracking-[0.22em] text-ink transition-transform duration-500 group-hover:translate-y-0">
          Agendar com {first}
        </span>
      </Link>
      <h3 className="mt-5 font-display text-[1.7rem] leading-tight">
        {barber.name.split(" ")[0]}
        {barber.nickname && <span className="italic text-gold-soft"> {barber.nickname}</span>}
        <span className="text-bone/40"> {barber.name.split(" ").slice(1).join(" ")}</span>
      </h3>
      <p className="mt-1 text-[0.8rem] font-light text-mute">{barber.specialties.join(" · ")}</p>
      <div className="mt-4 flex items-center justify-between border-t border-line pt-4 text-[0.8rem]">
        <span className="label !tracking-[0.2em] text-mute">Próximo horário</span>
        <span className="font-light text-bone/85">
          <NextFree barber={barber} />
        </span>
      </div>
      <Link
        href={`/agendar?barbeiro=${barber.id}`}
        className="mt-4 border border-line py-3 text-center text-[0.72rem] uppercase tracking-[0.22em] text-bone/80 transition hover:border-bone/60 hover:text-bone sm:hidden"
      >
        Agendar com {first}
      </Link>
    </motion.article>
  );
}

export function Barbers() {
  const { barbers, catalogReady } = useApp();
  return (
    <section id="barbeiros" className="relative bg-coal py-28 sm:py-36">
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <Reveal>
              <Eyebrow>A equipe</Eyebrow>
            </Reveal>
            <h2 className="mt-6 font-display text-5xl leading-[1] sm:text-7xl">
              <CharReveal text="Escolha quem" inView /> <br />
              <CharReveal text="cuida do seu" inView delay={0.3} />{" "}
              <span className="italic text-gold-soft">
                <CharReveal text="corte." inView delay={0.6} />
              </span>
            </h2>
          </div>
          <Reveal delay={0.2}>
            <p className="max-w-xs text-[0.95rem] font-light leading-relaxed text-bone/60">
              Cada barbeiro tem a própria agenda. Escolha o seu e veja os horários livres.
            </p>
          </Reveal>
        </div>

        <div className="mt-16 grid gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-4">
          {!catalogReady &&
            Array.from({ length: 4 }).map((_, i) => <div key={i} className="aspect-[3/4] animate-pulse bg-white/[0.03]" />)}
          {barbers.map((b, i) => (
            <BarberCard key={b.id} barber={b} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
