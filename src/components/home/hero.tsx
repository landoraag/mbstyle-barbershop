"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { useRef, useState } from "react";
import { site } from "@/config/site";
import { introDelay } from "../loader";
import { ease } from "../ui";

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const [D] = useState(introDelay);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const imgY = useTransform(scrollYProgress, [0, 1], ["0%", "12%"]);
  const imgScale = useTransform(scrollYProgress, [0, 1], [1.04, 1.12]);
  const textY = useTransform(scrollYProgress, [0, 1], [0, 60]);
  const fade = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  const lines = ["Você merece", "seu melhor"];

  return (
    <section ref={ref} id="inicio" className="relative flex min-h-[100svh] flex-col overflow-hidden">
      {/* foto de corte ao fundo — translúcida, em P&B */}
      <motion.div
        className="absolute inset-0"
        style={{ y: imgY, scale: imgScale }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: D, duration: 1.8, ease }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={site.heroImage}
          alt=""
          aria-hidden
          className="h-full w-full object-cover object-[70%_30%] opacity-[0.38] grayscale contrast-[1.1]"
        />
      </motion.div>
      <div className="pointer-events-none absolute inset-0 bg-ink/40 sm:hidden" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,var(--color-ink)_8%,rgb(9_9_10/0.85)_40%,rgb(9_9_10/0.35)_100%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgb(9_9_10/0.6)_0%,transparent_30%,transparent_65%,var(--color-ink)_100%)]" />

      <div className="relative mx-auto flex w-full max-w-6xl flex-1 flex-col justify-center px-6 pt-32 pb-16">
        <motion.div style={{ y: textY, opacity: fade }} className="max-w-3xl">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: D + 0.1, duration: 1 }}
            className="label text-gold"
          >
            Barbearia · Itapeva — SP
          </motion.p>

          <h1 className="mt-8 font-display text-[clamp(3.4rem,9.5vw,8rem)] leading-[0.92]">
            {lines.map((l, i) => (
              <span key={l} className="block overflow-hidden pb-[0.06em]">
                <motion.span
                  className="block"
                  initial={{ y: "105%" }}
                  animate={{ y: 0 }}
                  transition={{ delay: D + 0.15 + i * 0.12, duration: 1.2, ease }}
                >
                  {l}
                </motion.span>
              </span>
            ))}
            <span className="block overflow-hidden pb-[0.1em]">
              <motion.span
                className="block italic text-gold-soft"
                initial={{ y: "105%" }}
                animate={{ y: 0 }}
                transition={{ delay: D + 0.39, duration: 1.2, ease }}
              >
                estilo.
              </motion.span>
            </span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: D + 0.7, duration: 1, ease }}
            className="mt-10 max-w-sm text-[0.98rem] font-light leading-relaxed text-bone/70"
          >
            Corte, barba e acabamento feitos com calma e precisão. Escolha seu barbeiro e reserve o horário online.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: D + 0.85, duration: 1, ease }}
            className="mt-10 flex flex-wrap items-center gap-x-9 gap-y-5"
          >
            <Link
              href="/agendar"
              className="inline-flex h-14 items-center bg-bone px-9 text-[0.78rem] font-medium uppercase tracking-[0.22em] text-ink transition-colors duration-300 hover:bg-gold-soft"
            >
              Agendar horário
            </Link>
            <Link
              href="#barbeiros"
              className="group inline-flex items-center gap-3 text-[0.78rem] uppercase tracking-[0.22em] text-bone/80 transition hover:text-bone"
            >
              Conheça a equipe
              <span className="h-px w-10 bg-bone/40 transition-all duration-500 group-hover:w-16 group-hover:bg-gold" />
            </Link>
          </motion.div>
        </motion.div>
      </div>

      {/* faixa de informações */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: D + 1.1, duration: 1 }}
        className="relative border-t border-line"
      >
        <dl className="mx-auto grid max-w-6xl grid-cols-1 px-6 text-sm sm:grid-cols-3 sm:divide-x sm:divide-line">
          <div className="py-5 sm:pr-8">
            <dt className="label text-mute">Endereço</dt>
            <dd className="mt-2 font-light text-bone/85">
              {site.address.street} · {site.address.district}
            </dd>
          </div>
          <div className="hidden py-5 sm:block sm:px-8">
            <dt className="label text-mute">Horário</dt>
            <dd className="mt-2 font-light text-bone/85">Segunda a sábado</dd>
          </div>
          <div className="hidden py-5 sm:block sm:pl-8">
            <dt className="label text-mute">Instagram</dt>
            <dd className="mt-2 font-light">
              <a href={site.instagram.url} target="_blank" rel="noopener noreferrer" className="text-bone/85 hover:text-gold-soft">
                {site.instagram.handle}
              </a>
            </dd>
          </div>
        </dl>
      </motion.div>
    </section>
  );
}
