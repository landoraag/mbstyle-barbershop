"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState } from "react";
import { site } from "@/config/site";
import { CharReveal, Diamond } from "../fx";
import { introDelay } from "../loader";
import { LuxLink } from "../lux-link";
import { ease } from "../ui";

const curtain = [0.76, 0, 0.24, 1] as const;

function Corner({ className, delay }: { className: string; delay: number }) {
  return (
    <svg viewBox="0 0 40 40" className={`absolute h-10 w-10 text-gold/70 ${className}`} fill="none" stroke="currentColor" aria-hidden>
      <motion.path
        d="M0 40V0H40"
        strokeWidth="1"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ delay, duration: 1.4, ease }}
      />
    </svg>
  );
}

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const [D] = useState(introDelay);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const imgY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const textY = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const fade = useTransform(scrollYProgress, [0, 0.55], [1, 0]);
  const sideY = useTransform(scrollYProgress, [0, 1], [0, -160]);

  return (
    <section ref={ref} id="inicio" className="relative flex min-h-[100svh] flex-col overflow-hidden">
      {/* foto: cortina abrindo + zoom lento + parallax */}
      <motion.div
        className="absolute inset-0"
        initial={{ clipPath: "inset(0% 0% 100% 0%)" }}
        animate={{ clipPath: "inset(0% 0% 0% 0%)" }}
        transition={{ delay: D - 0.1, duration: 1.6, ease: curtain }}
      >
        <motion.div className="absolute inset-0" style={{ y: imgY }}>
          <motion.img
            src={site.heroImage}
            alt=""
            aria-hidden
            className="h-full w-full object-cover object-[70%_30%] opacity-[0.42] grayscale contrast-[1.15]"
            initial={{ scale: 1.35 }}
            animate={{ scale: 1.06 }}
            transition={{ delay: D - 0.1, duration: 3.2, ease: [0.16, 1, 0.3, 1] }}
          />
        </motion.div>
        {/* tom quente sutil, como luz de espelho */}
        <div className="absolute inset-0 bg-[#b8955a] opacity-[0.07] mix-blend-color" />
      </motion.div>
      <div className="pointer-events-none absolute inset-0 bg-ink/40 sm:hidden" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,var(--color-ink)_6%,rgb(9_9_10/0.82)_42%,rgb(9_9_10/0.25)_100%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgb(9_9_10/0.7)_0%,transparent_28%,transparent_62%,var(--color-ink)_100%)]" />

      {/* texto vertical lateral */}
      <motion.div
        style={{ y: sideY }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: D + 1.4, duration: 1.2 }}
        className="pointer-events-none absolute right-6 top-1/2 hidden -translate-y-1/2 lg:block"
      >
        <p className="label flex items-center gap-4 text-bone/35 [writing-mode:vertical-rl]">
          Rua Iperó, 219 <Diamond className="h-1.5 w-1.5 text-gold" /> Vila Nova <Diamond className="h-1.5 w-1.5 text-gold" /> Itapeva
        </p>
      </motion.div>

      <div className="relative mx-auto flex w-full max-w-6xl flex-1 flex-col justify-center px-6 pt-36 pb-20">
        <motion.div style={{ y: textY, opacity: fade }} className="relative max-w-4xl">
          {/* cantos art déco desenhando */}
          <Corner className="-left-4 -top-8 hidden sm:block" delay={D + 0.9} />
          <Corner className="-bottom-6 right-0 hidden rotate-180 sm:block" delay={D + 1.1} />

          <motion.div
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: D + 0.2, duration: 1, ease }}
            className="flex items-center gap-4"
          >
            <motion.span
              className="h-px bg-gold"
              initial={{ width: 0 }}
              animate={{ width: 48 }}
              transition={{ delay: D + 0.2, duration: 1.2, ease }}
            />
            <span className="label text-gold">Barbearia · Itapeva — SP</span>
          </motion.div>

          <h1 className="mt-8 font-display text-[clamp(3.4rem,10vw,8.6rem)] leading-[0.9]">
            <span className="block">
              <CharReveal text="Você merece" delay={D + 0.25} />
            </span>
            <span className="block">
              <CharReveal text="seu melhor" delay={D + 0.55} />
            </span>
            <span className="block italic text-gold-soft">
              <CharReveal text="estilo." delay={D + 0.85} stagger={0.05} />
            </span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 18, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ delay: D + 1.3, duration: 1.2, ease }}
            className="mt-10 max-w-sm text-[1rem] font-light leading-relaxed text-bone/70"
          >
            Corte, barba e acabamento feitos com calma e precisão. Escolha seu barbeiro e reserve o horário online.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: D + 1.45, duration: 1.1, ease }}
            className="mt-11 flex flex-wrap items-center gap-4"
          >
            <LuxLink href="/agendar" cursor="Agendar">
              Agendar horário
            </LuxLink>
            <LuxLink href="#barbeiros" variant="outline">
              Conheça a equipe
            </LuxLink>
          </motion.div>
        </motion.div>
      </div>

      {/* indicador de rolagem */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: D + 1.9 }}
        className="pointer-events-none absolute bottom-28 right-14 hidden flex-col items-center gap-3 lg:flex"
      >
        <span className="label !text-[0.58rem] text-bone/40">Role</span>
        <span className="relative h-14 w-px overflow-hidden bg-bone/15">
          <motion.span
            className="absolute inset-x-0 top-0 h-5 bg-gold"
            animate={{ y: [-20, 56] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: [0.76, 0, 0.24, 1] }}
          />
        </span>
      </motion.div>

      {/* faixa de informações */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: D + 1.6, duration: 1, ease }}
        className="relative border-t border-line bg-ink/40 backdrop-blur-sm"
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
              <a href={site.instagram.url} target="_blank" rel="noopener noreferrer" data-cursor="Abrir" className="text-bone/85 hover:text-gold-soft">
                {site.instagram.handle}
              </a>
            </dd>
          </div>
        </dl>
      </motion.div>
    </section>
  );
}
