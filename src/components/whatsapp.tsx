"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { ArrowUpRight, X } from "lucide-react";
import { site, whatsappLink } from "@/config/site";
import { Monogram, WhatsAppIcon } from "./brand";

const quick = [
  { label: "Quanto custa um corte?", text: "Olá! Quanto custa um corte na MB Style?" },
  { label: "Vocês atendem hoje?", text: "Olá! Vocês têm horário disponível hoje?" },
  { label: "Como chego aí?", text: "Olá! Como faço para chegar na MB Style?" },
  { label: "Outra dúvida", text: site.whatsappMessage },
];

/** Botão flutuante de WhatsApp com cartão de perguntas rápidas. */
export function WhatsAppWidget({ raised = false }: { raised?: boolean }) {
  const [open, setOpen] = useState(false);
  const [hint, setHint] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setHint(true), 6000);
    const t2 = setTimeout(() => setHint(false), 13000);
    return () => {
      clearTimeout(t);
      clearTimeout(t2);
    };
  }, []);

  return (
    <div className={`fixed right-5 z-50 ${raised ? "bottom-24 lg:bottom-7" : "bottom-5 sm:bottom-7"}`}><div className=" flex flex-col items-end gap-3 sm:right-2">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.94, transformOrigin: "bottom right" }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.96 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="glass w-[min(20rem,calc(100vw-2.5rem))] overflow-hidden rounded-[4px] shadow-2xl"
          >
            <div className="flex items-center gap-3 border-b border-line bg-gradient-to-br from-gold/15 to-transparent p-4">
              <div className="relative">
                <Monogram className="h-11 w-11 rounded-full bg-ink" withRing={false} />
                <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-coal bg-ok" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold">MB Style</p>
                <p className="text-xs text-mute">Respondemos pelo WhatsApp</p>
              </div>
              <button onClick={() => setOpen(false)} aria-label="Fechar" className="rounded-full p-1.5 hover:bg-white/5">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="space-y-3 p-4">
              <div className="w-fit max-w-[85%] rounded-[4px] bg-smoke px-3.5 py-2.5 text-sm">
                Olá! Tem alguma dúvida? Escolha uma opção ou mande sua mensagem.
              </div>
              <div className="flex flex-wrap gap-2">
                {quick.map((q, i) => (
                  <motion.a
                    key={q.label}
                    href={whatsappLink(q.text)}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + i * 0.05 }}
                    className="rounded-[3px] border border-line px-3 py-1.5 text-xs text-bone/80 transition hover:border-gold hover:bg-gold/10"
                  >
                    {q.label}
                  </motion.a>
                ))}
              </div>
              <a
                href={whatsappLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-11 items-center justify-center gap-2 rounded-[3px] bg-[#25D366] text-sm font-semibold text-ink transition hover:brightness-110"
              >
                <WhatsAppIcon className="h-4 w-4" /> Abrir conversa <ArrowUpRight className="h-4 w-4" />
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center gap-3">
        <AnimatePresence>
          {hint && !open && (
            <motion.button
              onClick={() => setOpen(true)}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="glass hidden rounded-[3px] px-4 py-2 text-xs font-light tracking-wide sm:block"
            >
              Dúvidas? Fale com a gente
            </motion.button>
          )}
        </AnimatePresence>
        <motion.button
          onClick={() => setOpen((o) => !o)}
          aria-label={open ? "Fechar WhatsApp" : "Falar no WhatsApp"}
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.94 }}
          className="relative flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-ink shadow-[0_8px_24px_-8px_rgba(0,0,0,0.8)]"
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={open ? "x" : "w"}
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {open ? <X className="h-6 w-6" /> : <WhatsAppIcon className="h-7 w-7" />}
            </motion.span>
          </AnimatePresence>
        </motion.button>
      </div>
    </div>
    </div>
  );
}
