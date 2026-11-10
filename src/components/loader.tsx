"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { BarberPole } from "./brand";

/**
 * Tela de carregamento: poste de barbeiro girando + barra dourada.
 * Aparece uma vez por sessão (não incomoda quem navega entre páginas).
 */
export function Loader() {
  const [show, setShow] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let seen = false;
    try {
      seen = sessionStorage.getItem("mb-loaded") === "1";
    } catch {}
    if (seen) {
      setShow(false);
      return;
    }
    const start = performance.now();
    const total = 2300;
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / total);
      setProgress(1 - Math.pow(1 - p, 3));
      if (p < 1) raf = requestAnimationFrame(tick);
      else {
        try {
          sessionStorage.setItem("mb-loaded", "1");
        } catch {}
        setTimeout(() => setShow(false), 250);
      }
    };
    raf = requestAnimationFrame(tick);
    document.documentElement.style.overflow = "hidden";
    return () => {
      cancelAnimationFrame(raf);
      document.documentElement.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    if (!show) document.documentElement.style.overflow = "";
  }, [show]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="loader"
          className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden"
          exit={{ pointerEvents: "none" }}
        >
          {/* duas cortinas que se abrem na saída */}
          <motion.div
            className="absolute inset-y-0 left-0 w-1/2 bg-ink"
            exit={{ x: "-100%" }}
            transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
          />
          <motion.div
            className="absolute inset-y-0 right-0 w-1/2 bg-ink"
            exit={{ x: "100%" }}
            transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
          />
          <motion.div
            className="relative flex flex-col items-center"
            exit={{ opacity: 0, scale: 0.92, filter: "blur(6px)" }}
            transition={{ duration: 0.45 }}
          >
            <motion.div
              initial={{ y: 24, opacity: 0, rotate: -6 }}
              animate={{ y: 0, opacity: 1, rotate: 0 }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            >
              <BarberPole className="relative h-44 w-auto " />
            </motion.div>
            <motion.p
              initial={{ opacity: 0, letterSpacing: "0.8em" }}
              animate={{ opacity: 1, letterSpacing: "0.42em" }}
              transition={{ delay: 0.35, duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
              className="mt-8 font-display text-xl text-bone"
            >
              MB <span className="text-gold">STYLE</span>
            </motion.p>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="mt-2 text-[0.62rem] uppercase tracking-[0.4em] text-mute"
            >
              Produtor de autoestima
            </motion.p>
            <div className="mt-8 h-px w-44 overflow-hidden bg-line">
              <div
                className="h-full bg-gradient-to-r from-gold-deep via-gold-soft to-gold"
                style={{ width: `${progress * 100}%` }}
              />
            </div>
            <p className="mt-3 font-mono text-[0.6rem] tabular-nums text-mute">{Math.round(progress * 100)}%</p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/** Atraso (s) para as animações de entrada esperarem a tela de carregamento. */
export function introDelay() {
  if (typeof window === "undefined") return 2.5;
  try {
    return sessionStorage.getItem("mb-loaded") === "1" ? 0.15 : 2.5;
  } catch {
    return 2.5;
  }
}
