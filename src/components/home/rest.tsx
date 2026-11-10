"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { useRef } from "react";
import { ArrowUpRight, CalendarCheck2, Clock3, MapPin, Scissors, UserRoundCheck } from "lucide-react";
import { site, whatsappLink } from "@/config/site";
import { gallery } from "@/config/gallery";
import { InstagramIcon, Monogram, WhatsAppIcon, Wordmark } from "../brand";
import { Eyebrow, Reveal, SplitHeading, ease } from "../ui";

/* ───────────────────────── O espaço ───────────────────────── */

function Tile({ i, className }: { i: number; className?: string }) {
  const g = gallery[i];
  return (
    <motion.figure
      initial={{ opacity: 0, clipPath: "inset(18% 18% 18% 18% round 28px)" }}
      whileInView={{ opacity: 1, clipPath: "inset(0% 0% 0% 0% round 28px)" }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 1.2, delay: i * 0.08, ease }}
      className={`group relative overflow-hidden rounded-[1.75rem] bg-graphite ${className ?? ""}`}
    >
      {g?.src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={g.src}
          alt={g.alt}
          className="h-full w-full object-cover transition-transform duration-[1.4s] group-hover:scale-105"
        />
      ) : (
        <div className="relative flex h-full w-full items-center justify-center bg-[radial-gradient(circle_at_30%_20%,#26262a,#0f0f11_70%)]">
          <span className="pole-stripes absolute inset-0 opacity-[0.015]" />
          <Monogram className="h-20 w-20 opacity-30 transition-opacity duration-700 group-hover:opacity-60" />
        </div>
      )}
      <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/90 to-transparent p-5 text-sm text-bone/80">
        {g?.alt}
      </figcaption>
    </motion.figure>
  );
}

export function Space() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y1 = useTransform(scrollYProgress, [0, 1], [60, -60]);
  const y2 = useTransform(scrollYProgress, [0, 1], [-30, 50]);

  return (
    <section id="espaco" className="relative py-28 sm:py-36">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-end">
          <div>
            <Reveal>
              <Eyebrow>O espaço</Eyebrow>
            </Reveal>
            <h2 className="mt-6 font-display text-5xl leading-[1.02] sm:text-6xl">
              <SplitHeading text="Casa nova," />
              <br />
              <span className="italic text-gold">
                <SplitHeading text="mesmo capricho." delay={0.12} />
              </span>
            </h2>
          </div>
          <Reveal delay={0.15}>
            <p className="max-w-md leading-relaxed text-bone/60">
              Cimento queimado, espelhos com luz quente e poltronas de couro preto. Um ambiente pensado para você
              relaxar enquanto a gente cuida do seu visual — na {site.address.street}, {site.address.district}.
            </p>
          </Reveal>
        </div>

        <div ref={ref} className="mt-16 grid h-[34rem] grid-cols-2 gap-4 sm:h-[38rem] sm:grid-cols-4 sm:grid-rows-2">
          <motion.div style={{ y: y1 }} className="col-span-1 row-span-2 sm:col-span-2">
            <Tile i={0} className="h-full" />
          </motion.div>
          <Tile i={1} />
          <motion.div style={{ y: y2 }}>
            <Tile i={2} className="h-full" />
          </motion.div>
          <Tile i={3} className="hidden sm:block" />
          <Tile i={4} className="hidden sm:block" />
        </div>
      </div>
    </section>
  );
}

/* ───────────────────────── Como funciona ───────────────────────── */

const steps = [
  { icon: UserRoundCheck, title: "Escolha o barbeiro", text: "Veja a equipe, as especialidades e quem tem horário livre." },
  { icon: Scissors, title: "Escolha o serviço", text: "Corte, barba, combos — preço e duração na hora." },
  { icon: CalendarCheck2, title: "Reserve o horário", text: "Só nome e celular. Com conta, a confirmação é automática." },
];

export function HowItWorks() {
  return (
    <section className="relative border-y border-line bg-coal py-24">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 md:grid-cols-3">
        {steps.map((s, i) => (
          <Reveal key={s.title} delay={i * 0.12} className="relative">
            <span className="font-display text-7xl italic text-bone/[0.06]">0{i + 1}</span>
            <div className="-mt-8 flex h-12 w-12 items-center justify-center rounded-2xl border border-gold/30 bg-gold/10 text-gold">
              <s.icon className="h-5 w-5" />
            </div>
            <h3 className="mt-5 font-display text-2xl">{s.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-bone/55">{s.text}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ───────────────────────── Contato ───────────────────────── */

export function Contact() {
  return (
    <section id="contato" className="relative py-28 sm:py-36">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_1.1fr]">
          <Reveal className="gold-border flex flex-col rounded-[2rem] p-8 sm:p-10">
            <Eyebrow>Visite a gente</Eyebrow>
            <h2 className="mt-6 font-display text-4xl leading-tight sm:text-5xl">
              Bora marcar <span className="italic text-gold">o próximo?</span>
            </h2>

            <div className="mt-10 space-y-7">
              <div className="flex gap-4">
                <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-gold" />
                <div>
                  <p className="font-medium">{site.address.street}</p>
                  <p className="text-sm text-mute">
                    {site.address.district} · {site.address.city}
                  </p>
                  <a
                    href={site.address.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-flex items-center gap-1 text-sm text-gold-soft hover:text-gold"
                  >
                    Abrir no mapa <ArrowUpRight className="h-3.5 w-3.5" />
                  </a>
                </div>
              </div>
              <div className="flex gap-4">
                <Clock3 className="mt-0.5 h-5 w-5 shrink-0 text-gold" />
                <dl className="grid flex-1 grid-cols-[auto_1fr] gap-x-6 gap-y-1.5 text-sm">
                  {site.hours.map((h) => (
                    <div key={h.days} className="contents">
                      <dt className="text-bone/60">{h.days}</dt>
                      <dd className={h.time === "Fechado" ? "text-mute" : "text-bone"}>{h.time}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>

            <div className="mt-auto grid gap-3 pt-10 sm:grid-cols-2">
              <a
                href={whatsappLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-13 items-center justify-center gap-2 rounded-full bg-[#25D366] font-semibold text-ink transition hover:brightness-110"
              >
                <WhatsAppIcon className="h-5 w-5" /> WhatsApp
              </a>
              <a
                href={site.instagram.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-13 items-center justify-center gap-2 rounded-full border border-bone/15 transition hover:border-gold/60"
              >
                <InstagramIcon className="h-5 w-5" /> {site.instagram.handle}
              </a>
            </div>
          </Reveal>

          <Reveal delay={0.15} className="relative min-h-[24rem] overflow-hidden rounded-[2rem] border border-line">
            <iframe
              title="Mapa da MB Style"
              src={site.address.mapsEmbed}
              className="absolute inset-0 h-full w-full grayscale invert-[0.92] hue-rotate-180 contrast-[0.9]"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
            <div className="pointer-events-none absolute inset-0 shadow-[inset_0_0_80px_rgba(9,9,10,0.9)]" />
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ───────────────────────── CTA final + rodapé ───────────────────────── */

export function FinalCta() {
  return (
    <section className="relative overflow-hidden py-28">
      <div className="absolute inset-x-0 top-1/2 h-64 -translate-y-1/2 bg-gold/[0.06] blur-3xl" />
      <div className="relative mx-auto max-w-4xl px-6 text-center">
        <h2 className="font-display text-[clamp(2.6rem,7vw,5.5rem)] leading-[0.98]">
          <SplitHeading text="Sua autoestima" />
          <br />
          <span className="text-gold-grad italic">
            <SplitHeading text="começa na cadeira." delay={0.15} />
          </span>
        </h2>
        <Reveal delay={0.3}>
          <Link
            href="/agendar"
            className="group mt-12 inline-flex h-16 items-center gap-3 rounded-full bg-gold pl-8 pr-2 text-lg font-semibold text-ink transition hover:bg-gold-soft"
          >
            Agendar agora
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-ink text-gold transition-transform group-hover:rotate-45">
              <ArrowUpRight className="h-5 w-5" />
            </span>
          </Link>
        </Reveal>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-line bg-coal">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-12 md:flex-row md:items-center md:justify-between">
        <div>
          <Wordmark />
          <p className="mt-4 max-w-xs text-sm text-mute">
            {site.tagline}. {site.address.street}, {site.address.district} — {site.address.city}.
          </p>
        </div>
        <nav className="flex flex-wrap gap-x-8 gap-y-3 text-sm text-bone/70">
          <Link href="/#servicos" className="hover:text-gold">Serviços</Link>
          <Link href="/#barbeiros" className="hover:text-gold">Barbeiros</Link>
          <Link href="/agendar" className="hover:text-gold">Agendar</Link>
          <Link href="/entrar" className="hover:text-gold">Minha conta</Link>
          <Link href="/painel" className="hover:text-gold">Área do barbeiro</Link>
        </nav>
      </div>
      <div className="border-t border-line">
        <p className="mx-auto max-w-6xl px-6 py-5 text-xs text-mute">
          © {new Date().getFullYear()} MB Style Barbearia · Itapeva-SP
        </p>
      </div>
    </footer>
  );
}
