"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Check, Inbox, MessageCircle, X } from "lucide-react";
import { data } from "@/lib/data";
import { brl, fmtLong, onlyDigits } from "@/lib/time";
import type { Appointment } from "@/lib/types";

export function RequestsView({ appts }: { appts: Appointment[] }) {
  const list = [...appts].sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));
  return (
    <div>
      <p className="text-[0.7rem] uppercase tracking-[0.35em] text-gold">Pedidos</p>
      <h1 className="mt-2 font-display text-4xl">Aguardando sua confirmação</h1>
      <p className="mt-2 max-w-lg text-sm text-mute">
        Clientes sem conta pedem o horário e ele fica reservado até você aceitar ou recusar. Ao recusar, o horário
        volta a ficar livre no site.
      </p>

      <div className="mt-8 space-y-3">
        {list.length === 0 && (
          <div className="rounded-3xl border border-dashed border-line p-12 text-center">
            <Inbox className="mx-auto h-8 w-8 text-gold" />
            <p className="mt-3 text-mute">Nenhum pedido pendente. Tudo em dia ✂️</p>
          </div>
        )}
        <AnimatePresence>
          {list.map((a, i) => (
            <motion.div
              key={a.id}
              layout
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0, transition: { delay: i * 0.04 } }}
              exit={{ opacity: 0, x: 60, transition: { duration: 0.3 } }}
              className="flex flex-wrap items-center gap-4 rounded-3xl border border-warn/30 bg-warn/[0.04] p-5"
            >
              <div className="flex h-16 w-16 shrink-0 flex-col items-center justify-center rounded-2xl bg-warn/10 text-warn">
                <span className="font-display text-2xl leading-none">{a.date.slice(8)}</span>
                <span className="text-[0.65rem]">{a.time}</span>
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-semibold">{a.clientName}</p>
                <p className="text-sm text-bone/70 first-letter:uppercase">
                  {a.serviceName} · {fmtLong(a.date)} às {a.time} · <span className="text-gold">{brl(a.price)}</span>
                </p>
                <a
                  href={`https://wa.me/55${onlyDigits(a.clientPhone)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 inline-flex items-center gap-1 text-xs text-mute hover:text-ok"
                >
                  <MessageCircle className="h-3.5 w-3.5" /> {a.clientPhone}
                </a>
                {a.notes && <p className="mt-1 text-xs text-mute">“{a.notes}”</p>}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => data.setAppointmentStatus(a, "rejected")}
                  className="flex h-11 items-center gap-1.5 rounded-full border border-line px-4 text-sm hover:border-bad/60 hover:text-bad"
                >
                  <X className="h-4 w-4" /> Recusar
                </button>
                <button
                  onClick={() => data.setAppointmentStatus(a, "confirmed")}
                  className="flex h-11 items-center gap-1.5 rounded-full bg-gold px-5 text-sm font-semibold text-ink hover:bg-gold-soft"
                >
                  <Check className="h-4 w-4" /> Aceitar
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
