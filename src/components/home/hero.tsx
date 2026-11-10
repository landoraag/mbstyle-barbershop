"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { useRef, useState } from "react";
import { introDelay } from "../loader";
import { ArrowDown, CalendarDays, MapPin } from "lucide-react";
import { site } from "@/config/site";
import { seedServices } from "@/lib/seed";
import { BarberPole, Monogram } from "../brand";
import { ServiceName, ease } from "../ui";

function RotatingBadge() {
  const text = "PRODUTOR DE AUTOESTIMA • ITAPEVA • MB STYLE • ";
  return (
    <motion.svg
      viewBox="0 0 200 200"
      className="absolute inset-0 h-full w-full"
      animate={{ rotate: 360 }}
      transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
      aria-hidden
    >
      <defs>
        <path id="circle-text" d="M100,100 m-86,0 a86,86 0 1,1 172,0 a86,86 0 1,1 -172,0" />
      </defs>
      <text fill="#c9a35c" fontSize="9.6" letterSpacing="4.2" fontFamily="Manrope, sans-serif" fontWeight="600">
        <textPath href="#circle-text">{text}</textPath>
      </text>
    </motion.svg>
  );
}

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const yBadge = useTransform(scrollYProgress, [0, 1], [0, 160]);
  const yText = useTransform(scrollYProgress, [0, 1], [0, 80]);
  const fade = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  const [D] = useState(introDelay);
  const headline = ["Você", "merece", "seu", "melhor"];

  return (
    <section ref={ref} id="inicio" className="relative flex min-h-[100svh] items-center overflow-hidden pt-28 pb-24">
      {/* fundo: cimento + brilho dourado + "espelhos de LED" */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_40%,rgba(201,163,92,0.16),transparent_55%),radial-gradient(ellipse_at_10%_90%,rgba(232,130,58,0.07),transparent_50%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_60%,var(--color-ink))]" />
        {[18, 46, 74].map((left, i) => (
          <motion.div
            key={left}
            className="absolute top-0 h-[70%] w-px bg-gradient-to-b from-transparent via-gold/15 to-transparent"
            style={{ left: `${left}%` }}
            initial={{ scaleY: 0, opacity: 0 }}
            animate={{ scaleY: 1, opacity: 1 }}
            transition={{ duration: 1.8, delay: D - 0.1 + i * 0.15, ease }}
          />
        ))}
      </div>

      <div className="relative mx-auto grid w-full max-w-6xl items-center gap-14 px-6 lg:grid-cols-[1.15fr_0.85fr]">
        <motion.div style={{ y: yText, opacity: fade }}>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: D + 0.0, duration: 0.8, ease }}
            className="mb-7 inline-flex items-center gap-2 rounded-full border border-gold/25 bg-gold/5 px-3.5 py-1.5 text-[0.7rem] uppercase tracking-[0.25em] text-gold-soft"
          >
            <MapPin className="h-3.5 w-3.5" /> {site.address.district} · Itapeva
          </motion.p>

          <h1 className="font-display text-[clamp(2.9rem,8vw,6.2rem)] font-medium leading-[0.95] tracking-[-0.02em]">
            {headline.map((w, i) => (
              <span key={w} className="inline-block overflow-hidden pb-[0.08em] align-bottom">
                <motion.span
                  className="inline-block"
                  initial={{ y: "110%" }}
                  animate={{ y: 0 }}
                  transition={{ delay: D + 0.05 + i * 0.08, duration: 1, ease }}
                >
                  {w}&nbsp;
                </motion.span>
              </span>
            ))}
            <span className="inline-block overflow-hidden pb-[0.12em] align-bottom">
              <motion.span
                className="text-gold-grad inline-block italic"
                initial={{ y: "110%" }}
                animate={{ y: 0 }}
                transition={{ delay: D + 0.4, duration: 1, ease }}
              >
                estilo.
              </motion.span>
            </span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: D + 0.6, duration: 0.9, ease }}
            className="mt-7 max-w-md text-base leading-relaxed text-bone/65 sm:text-lg"
          >
            Corte, barba e acabamento de quem leva estilo a sério. Escolha seu barbeiro, veja os horários livres e
            garanta sua cadeira em segundos.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: D + 0.75, duration: 0.9, ease }}
            className="mt-10 flex flex-wrap gap-3"
          >
            <Link
              href="/agendar"
              className="group relative flex h-14 items-center gap-2.5 overflow-hidden rounded-full bg-gold px-7 font-semibold text-ink transition hover:bg-gold-soft"
            >
              <CalendarDays className="h-5 w-5" /> Agendar horário
              <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
            </Link>
            <Link
              href="#barbeiros"
              className="flex h-14 items-center gap-2 rounded-full border border-bone/15 px-7 text-bone/85 transition hover:border-gold/60 hover:text-bone"
            >
              Conhecer barbeiros
            </Link>
          </motion.div>
        </motion.div>

        <motion.div
          style={{ y: yBadge }}
          initial={{ opacity: 0, scale: 0.85, rotate: -8 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ delay: D + 0.1, duration: 1.4, ease }}
          className="relative mx-auto hidden aspect-square w-full max-w-[26rem] sm:block"
        >
          <div className="absolute inset-[12%] rounded-full bg-gold/10 blur-3xl" />
          <RotatingBadge />
          <div className="gold-border absolute inset-[13%] flex items-center justify-center rounded-full shadow-[inset_0_0_60px_rgba(0,0,0,0.6)]">
            <Monogram className="h-[72%] w-[72%]" />
          </div>
          <motion.div
            className="absolute -right-2 bottom-6"
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          >
            <BarberPole className="h-36 w-auto drop-shadow-[0_15px_30px_rgba(0,0,0,0.6)]" />
          </motion.div>
        </motion.div>
      </div>

      <motion.a
        href="#servicos"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: D + 1.3 }}
        className="absolute bottom-20 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-[0.6rem] uppercase tracking-[0.35em] text-mute md:flex"
      >
        Role
        <motion.span animate={{ y: [0, 6, 0] }} transition={{ duration: 1.8, repeat: Infinity }}>
          <ArrowDown className="h-4 w-4 text-gold" />
        </motion.span>
      </motion.a>

      {/* faixa de serviços correndo */}
      <div className="absolute inset-x-0 bottom-0 overflow-hidden border-y border-line bg-coal/80 py-3.5">
        <motion.div
          className="flex w-max gap-10 whitespace-nowrap"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 38, repeat: Infinity, ease: "linear" }}
        >
          {[...seedServices, ...seedServices].map((s, i) => (
            <span key={i} className="flex items-center gap-10 font-display text-lg italic text-bone/50">
              <ServiceName name={s.name} />
              <span className="text-xs not-italic text-gold">✦</span>
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
