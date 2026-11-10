"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { useRef } from "react";
import { ArrowUpRight, Clock3, MapPin } from "lucide-react";
import { site, whatsappLink } from "@/config/site";
import { gallery } from "@/config/gallery";
import { InstagramIcon, Monogram, WhatsAppIcon, Wordmark } from "../brand";
import { CharReveal, Diamond, MaskReveal, ParallaxImage } from "../fx";
import { LuxLink } from "../lux-link";
import { Eyebrow, Reveal } from "../ui";

/* ───────────────────────── O espaço ───────────────────────── */

function Tile({ i, className }: { i: number; className?: string }) {
  const g = gallery[i];
  return (
    <figure className={`group relative overflow-hidden bg-graphite ${className ?? ""}`} data-cursor="Ver">
      <MaskReveal className="h-full w-full" delay={i * 0.15}>
        {g?.src ? (
          <ParallaxImage
            src={g.src}
            alt={g.alt}
            className="h-full w-full opacity-80 grayscale transition duration-[1.4s] group-hover:opacity-100 group-hover:grayscale-0"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-graphite">
            <Monogram className="h-20 w-20 opacity-30" />
          </div>
        )}
      </MaskReveal>
      <figcaption className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-gradient-to-t from-ink/85 to-transparent p-5">
        <span className="label text-bone/85">{g?.alt}</span>
        <span className="font-display text-sm italic text-gold-soft">0{i + 1}</span>
      </figcaption>
    </figure>
  );
}

export function Space() {
  const ref = useRef<HTMLDivElement>(null);

  return (
    <section id="espaco" className="relative py-28 sm:py-36">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-end">
          <div>
            <Reveal>
              <Eyebrow>O espaço</Eyebrow>
            </Reveal>
            <h2 className="mt-6 font-display text-5xl leading-[1] sm:text-7xl">
              <CharReveal text="Casa nova," inView />
              <br />
              <span className="italic text-gold-soft">
                <CharReveal text="mesmo capricho." inView delay={0.3} />
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

        <div ref={ref} className="mt-16 grid h-[34rem] grid-cols-2 gap-3 sm:h-[40rem] sm:grid-cols-3 sm:grid-rows-2">
          <motion.div className="col-span-2 row-span-1 sm:col-span-2 sm:row-span-2">
            <Tile i={0} className="h-full" />
          </motion.div>
          <Tile i={1} />
          <motion.div>
            <Tile i={2} className="h-full" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ───────────────────────── Como funciona ───────────────────────── */

const steps = [
  { n: "I", title: "Escolha o barbeiro", text: "Veja a equipe e quem tem horário livre." },
  { n: "II", title: "Escolha o serviço", text: "Preço e duração antes de confirmar." },
  { n: "III", title: "Reserve", text: "Só nome e celular. Com conta, a confirmação é imediata." },
];

export function HowItWorks() {
  return (
    <section className="border-y border-line">
      <div className="mx-auto grid max-w-6xl px-6 md:grid-cols-3 md:divide-x md:divide-line">
        {steps.map((s, i) => (
          <Reveal key={s.title} delay={i * 0.1} className="border-b border-line py-12 last:border-b-0 md:border-b-0 md:px-10 md:first:pl-0 md:last:pr-0">
            <span className="font-display text-xl italic text-gold">{s.n}.</span>
            <h3 className="mt-4 font-display text-3xl">{s.title}</h3>
            <p className="mt-3 max-w-xs text-sm font-light leading-relaxed text-bone/55">{s.text}</p>
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
          <Reveal className="gold-border flex flex-col rounded-[4px] p-8 sm:p-10">
            <Eyebrow>Onde estamos</Eyebrow>
            <h2 className="mt-6 font-display text-4xl leading-tight sm:text-5xl">
              Rua Iperó, <span className="italic text-gold-soft">219</span>
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
                className="flex h-13 items-center justify-center gap-2 rounded-[3px] bg-[#25D366] font-semibold text-ink transition hover:brightness-110"
              >
                <WhatsAppIcon className="h-5 w-5" /> WhatsApp
              </a>
              <a
                href={site.instagram.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-13 items-center justify-center gap-2 rounded-[3px] border border-bone/15 transition hover:border-gold/60"
              >
                <InstagramIcon className="h-5 w-5" /> {site.instagram.handle}
              </a>
            </div>
          </Reveal>

          <Reveal delay={0.15} className="relative min-h-[24rem] overflow-hidden rounded-[4px] border border-line">
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
    <section className="relative overflow-hidden py-36 sm:py-48">
      {gallery[0]?.src && (
        <ParallaxImage src={gallery[0].src} alt="" amount={20} className="absolute inset-0 opacity-[0.16] grayscale" />
      )}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_10%,var(--color-ink)_75%)]" />
      <div className="relative mx-auto max-w-5xl px-6 text-center">
        <Reveal>
          <p className="label flex items-center justify-center gap-4 text-gold">
            <Diamond className="h-1.5 w-1.5" /> Reserve sua cadeira <Diamond className="h-1.5 w-1.5" />
          </p>
        </Reveal>
        <h2 className="mt-8 font-display text-[clamp(2.8rem,8vw,6.8rem)] leading-[0.95]">
          <CharReveal text="Sua autoestima" inView />
          <br />
          <span className="italic text-gold-soft">
            <CharReveal text="começa na cadeira." inView delay={0.35} />
          </span>
        </h2>
        <Reveal delay={0.4} className="mt-14 flex justify-center">
          <LuxLink href="/agendar" cursor="Agendar">
            Agendar horário
          </LuxLink>
        </Reveal>
      </div>
    </section>
  );
}

export function Footer() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end end"] });
  const y = useTransform(scrollYProgress, [0, 1], ["60%", "0%"]);
  const opacity = useTransform(scrollYProgress, [0, 1], [0.2, 1]);
  return (
    <footer className="relative overflow-hidden border-t border-line bg-coal">
      <div className="mx-auto grid max-w-6xl gap-12 px-6 pt-20 pb-10 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <Wordmark />
          <p className="mt-6 max-w-xs text-sm font-light leading-relaxed text-mute">
            {site.tagline}. {site.address.street}, {site.address.district} — {site.address.city}.
          </p>
        </div>
        <nav className="flex flex-col gap-3 text-sm font-light">
          <span className="label mb-2 text-gold">Navegação</span>
          {[
            ["/#servicos", "Serviços"],
            ["/#barbeiros", "Barbeiros"],
            ["/#espaco", "O espaço"],
            ["/agendar", "Agendar"],
          ].map(([h, l]) => (
            <Link key={h} href={h} className="group w-fit text-bone/70 transition hover:text-bone">
              <span className="bg-[linear-gradient(currentColor,currentColor)] bg-[length:0%_1px] bg-left-bottom bg-no-repeat pb-0.5 transition-[background-size] duration-500 group-hover:bg-[length:100%_1px]">
                {l}
              </span>
            </Link>
          ))}
        </nav>
        <nav className="flex flex-col gap-3 text-sm font-light">
          <span className="label mb-2 text-gold">Acesso</span>
          {[
            ["/entrar", "Minha conta"],
            ["/painel", "Área do barbeiro"],
            [site.instagram.url, "Instagram"],
          ].map(([h, l]) => (
            <Link key={l} href={h} className="group w-fit text-bone/70 transition hover:text-bone">
              <span className="bg-[linear-gradient(currentColor,currentColor)] bg-[length:0%_1px] bg-left-bottom bg-no-repeat pb-0.5 transition-[background-size] duration-500 group-hover:bg-[length:100%_1px]">
                {l}
              </span>
            </Link>
          ))}
        </nav>
      </div>
      <div ref={ref} className="relative overflow-hidden">
        <motion.p
          style={{ y, opacity }}
          className="select-none whitespace-nowrap text-center font-display text-[24vw] font-light leading-[0.78] tracking-[-0.03em] text-outline"
          aria-hidden
        >
          MB Style
        </motion.p>
      </div>
      <div className="border-t border-line">
        <div className="mx-auto flex max-w-6xl flex-wrap justify-between gap-2 px-6 py-5 text-xs text-mute">
          <span>© {new Date().getFullYear()} MB Style Barbearia · Itapeva-SP</span>
          <span>Produtor de autoestima</span>
        </div>
      </div>
    </footer>
  );
}
