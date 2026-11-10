"use client";

import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { useRef } from "react";
import { Counter, Ornament } from "../fx";
import { useApp } from "../providers";

const TEXT =
  "Aqui o corte não tem pressa. É ritual: conversa boa, mão firme e o acabamento que faz você levantar da cadeira outra pessoa.";

function Word({ w, progress, range }: { w: string; progress: MotionValue<number>; range: [number, number] }) {
  const opacity = useTransform(progress, range, [0.12, 1]);
  const color = useTransform(progress, range, ["#eee7da", w.includes("ritual") ? "#d6bd8c" : "#eee7da"]);
  return (
    <span className="relative mr-[0.25em] inline-block">
      <motion.span style={{ opacity, color }} className={w.includes("ritual") ? "italic" : undefined}>
        {w}
      </motion.span>
    </span>
  );
}

export function Manifesto() {
  const ref = useRef<HTMLParagraphElement>(null);
  const { services, barbers } = useApp();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 85%", "end 45%"] });
  const words = TEXT.split(" ");

  return (
    <section className="relative overflow-hidden border-t border-line py-28 sm:py-40">
      <div className="mx-auto max-w-5xl px-6 text-center">
        <Ornament className="mx-auto" />
        <p ref={ref} className="mt-12 font-display text-[clamp(2rem,4.6vw,3.9rem)] font-light leading-[1.15]">
          {words.map((w, i) => (
            <Word key={i} w={w} progress={scrollYProgress} range={[i / words.length, (i + 1) / words.length]} />
          ))}
        </p>

        <div className="mx-auto mt-20 grid max-w-4xl grid-cols-2 gap-y-10 sm:grid-cols-4">
          {[
            { n: barbers.length || 4, label: "Barbeiros" },
            { n: services.length || 14, label: "Serviços" },
            { n: 6, label: "Dias por semana" },
            { n: 30, label: "Dias de agenda aberta" },
          ].map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.9 }}
              className="relative px-4 sm:border-l sm:border-line sm:first:border-l-0"
            >
              <Counter to={s.n} className="block font-display text-6xl font-light text-bone" />
              <span className="label mt-3 block !text-[0.6rem] text-mute">{s.label}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
