"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import { ArrowUpRight, Clock } from "lucide-react";
import { clsx } from "clsx";
import { brl } from "@/lib/time";
import type { Service } from "@/lib/types";
import { useApp } from "../providers";
import { Eyebrow, Reveal, ServiceName, SplitHeading, ease } from "../ui";

const tabs: { id: "all" | Service["category"]; label: string }[] = [
  { id: "all", label: "Destaques" },
  { id: "corte", label: "Corte" },
  { id: "barba", label: "Barba" },
  { id: "combo", label: "Combos" },
  { id: "quimica", label: "Química" },
  { id: "extra", label: "Extras" },
];

const fmtDur = (m: number) => (m >= 60 ? `${Math.floor(m / 60)}h${m % 60 ? ` ${m % 60}min` : ""}` : `${m} min`);

export function Services() {
  const { services } = useApp();
  const [tab, setTab] = useState<(typeof tabs)[number]["id"]>("all");
  const list = services.filter((s) => (tab === "all" ? s.featured : s.category === tab));

  return (
    <section id="servicos" className="relative py-28 sm:py-36">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid grid-cols-[minmax(0,1fr)] gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
          <div className="lg:sticky lg:top-32 lg:self-start">
            <Reveal>
              <Eyebrow>O cardápio</Eyebrow>
            </Reveal>
            <h2 className="mt-6 font-display text-5xl leading-[1] sm:text-7xl">
              <SplitHeading text="Serviços" />
              <br />
              <SplitHeading text="& valores" delay={0.12} />
            </h2>
            <Reveal delay={0.2}>
              <p className="mt-6 max-w-sm font-light leading-relaxed text-bone/60">
                Do corte rápido ao ritual completo com toalha quente. Valores transparentes — você vê o preço e a
                duração antes de agendar.
              </p>
            </Reveal>

            <Reveal delay={0.3} className="mt-10 flex flex-wrap gap-x-6 gap-y-3">
              {tabs.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className={clsx(
                    "relative pb-2 text-[0.72rem] uppercase tracking-[0.2em] transition",
                    tab === t.id ? "text-bone" : "text-bone/45 hover:text-bone/80",
                  )}
                >
                  {tab === t.id && (
                    <motion.span
                      layoutId="svc-tab"
                      className="absolute inset-x-0 bottom-0 h-px bg-gold"
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    />
                  )}
                  <span className="relative">{t.label}</span>
                </button>
              ))}
            </Reveal>
          </div>

          <div className="relative min-h-[28rem]">
            <AnimatePresence mode="wait">
              <motion.ul
                key={tab}
                initial="hidden"
                animate="show"
                exit="exit"
                variants={{
                  show: { transition: { staggerChildren: 0.06 } },
                  exit: { opacity: 0, transition: { duration: 0.15 } },
                }}
                className="divide-y divide-line border-y border-line"
              >
                {list.map((s) => (
                  <motion.li
                    key={s.id}
                    variants={{
                      hidden: { opacity: 0, y: 18 },
                      show: { opacity: 1, y: 0, transition: { duration: 0.6, ease } },
                    }}
                  >
                    <Link
                      href={`/agendar?servico=${s.id}`}
                      className="group relative flex items-start gap-5 py-6 transition-colors"
                    >
                      <div className="relative min-w-0 flex-1">
                        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                          <h3 className="min-w-0 font-display text-xl transition-colors sm:text-2xl group-hover:text-gold-soft"><ServiceName name={s.name} /></h3>
                          <span className="hidden flex-1 border-b border-dotted border-bone/15 sm:block" />
                          <span className="ml-auto shrink-0 font-display text-xl text-gold sm:ml-0 sm:text-2xl">{brl(s.price)}</span>
                        </div>
                        {s.description && <p className="mt-1.5 max-w-md text-sm text-bone/50">{s.description}</p>}
                        <p className="mt-2 inline-flex items-center gap-1.5 text-xs text-mute">
                          <Clock className="h-3.5 w-3.5" /> {fmtDur(s.duration)}
                        </p>
                      </div>
                      <ArrowUpRight className="relative mt-1.5 h-5 w-5 shrink-0 text-gold opacity-0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100" />
                    </Link>
                  </motion.li>
                ))}
              </motion.ul>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
