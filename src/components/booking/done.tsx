"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { CalendarPlus, Hourglass, MapPin } from "lucide-react";
import { site, whatsappLink } from "@/config/site";
import { brl, fmtLong, parseKey, toMin } from "@/lib/time";
import type { Appointment, Barber } from "@/lib/types";
import { WhatsAppIcon } from "../brand";
import { ease } from "../ui";

function gcalLink(a: Appointment, barber: Barber) {
  const start = parseKey(a.date);
  start.setHours(0, toMin(a.time), 0, 0);
  const end = new Date(start.getTime() + a.duration * 60000);
  const f = (d: Date) =>
    `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}T${String(d.getHours()).padStart(2, "0")}${String(d.getMinutes()).padStart(2, "0")}00`;
  const p = new URLSearchParams({
    action: "TEMPLATE",
    text: `${a.serviceName} — MB Style`,
    dates: `${f(start)}/${f(end)}`,
    details: `Com ${barber.name}. ${brl(a.price)}.`,
    location: `${site.address.street}, ${site.address.district}, Itapeva - SP`,
    ctz: "America/Sao_Paulo",
  });
  return `https://calendar.google.com/calendar/render?${p}`;
}

export function BookingDone({ appt, barber }: { appt: Appointment; barber: Barber }) {
  const confirmed = appt.status === "confirmed";
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center px-6 text-center">
      <div className="relative mb-10 mt-6 h-32 w-32">
        {Array.from({ length: 14 }).map((_, i) => {
          const a = (i / 14) * Math.PI * 2;
          return (
            <motion.span
              key={i}
              className="absolute left-1/2 top-1/2 h-1.5 w-1.5 rounded-full bg-gold"
              initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
              animate={{ x: Math.cos(a) * 110, y: Math.sin(a) * 110, opacity: 0, scale: 0.3 }}
              transition={{ delay: 0.55, duration: 1.1, ease }}
            />
          );
        })}
        <motion.div
          initial={{ scale: 0.4, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 14 }}
          className="absolute inset-0 rounded-full bg-gradient-to-br from-gold-soft to-gold-deep shadow-[0_20px_60px_-10px_rgba(201,163,92,0.6)]"
        />
        <svg viewBox="0 0 52 52" className="absolute inset-0 h-full w-full p-9">
          {confirmed ? (
            <motion.path
              d="M14 27 l8 8 l17 -18"
              fill="none"
              stroke="#09090a"
              strokeWidth="4.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ delay: 0.3, duration: 0.6, ease }}
            />
          ) : null}
        </svg>
        {!confirmed && (
          <motion.div
            initial={{ rotate: -180, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8, ease }}
            className="absolute inset-0 flex items-center justify-center text-ink"
          >
            <Hourglass className="h-12 w-12" strokeWidth={1.8} />
          </motion.div>
        )}
      </div>

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, ease }}>
        <p className="text-[0.7rem] uppercase tracking-[0.35em] text-gold">
          {confirmed ? "Horário confirmado" : "Pedido enviado"}
        </p>
        <h1 className="mt-4 font-display text-4xl sm:text-5xl">
          {confirmed ? (
            <>
              Te esperamos, <span className="italic text-gold">{appt.clientName.split(" ")[0]}!</span>
            </>
          ) : (
            <>
              Quase lá, <span className="italic text-gold">{appt.clientName.split(" ")[0]}.</span>
            </>
          )}
        </h1>
        <p className="mx-auto mt-4 max-w-md text-bone/60">
          {confirmed
            ? "Seu horário já está garantido na agenda."
            : `${barber.nickname ?? barber.name.split(" ")[0]} vai confirmar seu horário em breve. O horário já fica reservado para você enquanto isso.`}
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, ease }}
        className="gold-border mt-10 w-full rounded-[4px] p-6 text-left"
      >
        <dl className="grid grid-cols-2 gap-5 text-sm">
          <div>
            <dt className="text-mute">Barbeiro</dt>
            <dd className="mt-1">{barber.name}</dd>
          </div>
          <div>
            <dt className="text-mute">Serviço</dt>
            <dd className="mt-1">{appt.serviceName}</dd>
          </div>
          <div>
            <dt className="text-mute">Quando</dt>
            <dd className="mt-1 first-letter:uppercase">
              {fmtLong(appt.date)}, {appt.time}
            </dd>
          </div>
          <div>
            <dt className="text-mute">Valor</dt>
            <dd className="mt-1 font-display text-xl text-gold">{brl(appt.price)}</dd>
          </div>
        </dl>
        <div className="hairline my-5" />
        <p className="flex items-center gap-2 text-sm text-bone/70">
          <MapPin className="h-4 w-4 text-gold" /> {site.address.street}, {site.address.district}
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9 }}
        className="mt-6 grid w-full gap-3 sm:grid-cols-2"
      >
        <a
          href={gcalLink(appt, barber)}
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-13 items-center justify-center gap-2 rounded-[3px] bg-gold font-semibold text-ink hover:bg-gold-soft"
        >
          <CalendarPlus className="h-5 w-5" /> Adicionar à agenda
        </a>
        <a
          href={whatsappLink(`Olá! Acabei de agendar ${appt.serviceName} com ${barber.name} em ${fmtLong(appt.date)} às ${appt.time}.`)}
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-13 items-center justify-center gap-2 rounded-[3px] border border-bone/15 hover:border-gold/60"
        >
          <WhatsAppIcon className="h-5 w-5" /> Avisar no WhatsApp
        </a>
      </motion.div>
      <Link href="/" className="mt-8 text-sm text-mute hover:text-bone">
        Voltar ao início
      </Link>
    </div>
  );
}
